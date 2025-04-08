import fs from "fs";
import csv from "csv-parser";
import moment from "moment";

// File paths
const csvFilePath = "./csv/250206_37 Bay View St Sitesched Upload.csv";
const jsonFilePath = "./states/testexample@tandukrusa.com/all_tasks_cc7c2a36-4294-416b-8070-7004a599a772.json";

// Types for the CSV and JSON data
interface CsvRow {
    ID: string;
    text: string;
    start_date: string;
    end_date: string;
    duration: string;
}

interface JsonTask {
    taskName: string;
    startDate: string;
    endDate: string;
    duration: string;
}

// Function to read CSV file
const readCsv = (filePath: string): Promise<CsvRow[]> => {
    return new Promise((resolve, reject) => {
        const results: CsvRow[] = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (data: CsvRow) => results.push(data))
            .on("end", () => resolve(results))
            .on("error", (error: Error) => reject(error));
    });
};

const readJson = (filePath: string): Promise<JsonTask[]> => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                return reject(new Error(`Failed to read file: ${err.message}`));
            }
            try {
                const parsedData = JSON.parse(data);
                resolve(parsedData);
            } catch (parseError) {
                reject(new Error(`Failed to parse JSON data: ${parseError}`));
            }
        });
    });
};


const convertStringToNumber = (str: string): number => {
    // Use a regular expression to remove non-numeric characters
    const numericPart = str.replace(/\D/g, ''); // \D matches any non-digit character
    return parseInt(numericPart, 10); // Convert the numeric string to a number
};

// Function to compare data
const compareData = async (): Promise<void> => {
    try {
        const csvData = await readCsv(csvFilePath);
        const jsonData = await readJson(jsonFilePath);

        const mismatches: { task: string; fromPDF: any; fromApp: any }[] = [];
        const mismatchesIds: number[] = [];

        csvData.forEach(row => {
            const csvTask = {
                id: parseInt(row.ID, 10),
                text: row.text.replace(/\s+/g, " ").trim(),
                start_date: moment(row.start_date, "ddd M/D/YY").format("DD/MM/YYYY"),
                end_date: moment(row.end_date, "ddd M/D/YY").format("DD/MM/YYYY"),
                duration: parseInt(row.duration, 10),
            };

            jsonData.forEach((jsonTask, index) => {
                if (index + 1 === csvTask.id && csvTask.text === jsonTask.taskName) {  
                    if (csvTask.id <= 47) {
                        const jsonValues = {
                            start_date: moment(jsonTask.startDate, 'DD-MM-YY').format("DD/MM/YYYY"),
                            end_date: moment(jsonTask.endDate, 'DD-MM-YY').format("DD/MM/YYYY"),
                            duration: convertStringToNumber(jsonTask.duration),
                        };
    
                        if (
                            csvTask.start_date !== jsonValues.start_date ||
                            csvTask.end_date !== jsonValues.end_date ||
                            csvTask.duration !== jsonValues.duration
                        ) {
                            mismatches.push({ task: csvTask.text, fromPDF: csvTask, fromApp: jsonValues });
                            mismatchesIds.push(csvTask.id);
                        }
    
                    } else if (csvTask.id > 47) {
                        const jsonValues = {
                            start_date: moment(new Date(jsonTask.startDate)).format("DD/MM/YYYY"),
                            end_date: moment(new Date(jsonTask.endDate)).format("DD/MM/YYYY"),
                            duration: convertStringToNumber(jsonTask.duration),
                        };
                        
                        if (
                            csvTask.start_date !== jsonValues.start_date ||
                            csvTask.end_date !== jsonValues.end_date ||
                            csvTask.duration !== jsonValues.duration
                        ) {
                            mismatches.push({ task: csvTask.text, fromPDF: csvTask, fromApp: jsonValues });
                            mismatchesIds.push(csvTask.id);
                        }
                    }
                }
            });
        });

        console.log("Mismatched Tasks:", JSON.stringify(mismatches, null, 2));
        console.log("Total Mismatched Tasks:", mismatches.length);
    } catch (error) {
        console.error("Error:", error);
    }
};

// Run the comparison
compareData();
