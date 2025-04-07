import fs from "fs";
import csv from "csv-parser";
import countWorkingDays from '../utils/countWorkingDays';
import moment, { Moment } from "moment";

// File paths
const csvFilePath = "../csv/250206_37 Bay View St Sitesched Upload.csv";

// Define the shape of the CSV data row
interface CsvRow {
    ID: string;
    text: string;
    start_date: string;  // The dates are passed as strings in the CSV
    end_date: string;
    duration: string;
}

// Define the shape of the result object when durations are incorrect
interface DurationValidationResult {
    ID: string;
    Task: string;
    ExpectedDuration: number;
    ActualDuration: number;
    Valid: boolean;
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

// Function to validate if the duration is correct
const validateDurations = async () => {
    const results: DurationValidationResult[] = [];
    const csvData = await readCsv(csvFilePath);
    
    csvData.forEach(row => {
        const startDate = parseInt(row.start_date);
        const endDate = parseInt(row.end_date);
        const durationStr = row.duration.trim();
    
        // Extract number of days from the duration string (e.g., "575 days" -> 575)
        const duration = parseInt(durationStr.replace(' days', '').trim());
    
        // Calculate the actual working days between the start and end dates
        const actualWorkingDays = countWorkingDays(moment(startDate), moment(endDate));
    
        // Check if the duration in CSV matches the calculated working days
        const isValid = actualWorkingDays === duration;
    
        if (!isValid && duration !== 0) {
            results.push({
                ID: row.ID,
                Task: row.text,
                ExpectedDuration: duration,
                ActualDuration: actualWorkingDays,
                Valid: isValid,
            });
        }
    });

    console.log(`Incorrect durations: `, results);
    console.log(`Total Incorrect durations: `, results.length);
};

validateDurations();
