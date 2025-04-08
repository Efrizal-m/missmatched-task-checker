import { chromium } from 'playwright-core';
import { Page } from 'playwright';
import fs from 'fs';
import { config } from '../config';

export const openBrowserAndScrape = async (email: string, password: string) => {
    try {
        const browser = await chromium.launch({ devtools: true, headless: false });
        const page = await browser.newPage();

        await login(page, email, password);

        await page.goto(`${config.baseUrl}/projects/${config.projectId}/progress`);
        await page.waitForTimeout(2000); // Wait to ensure the page loads initially

        // Wait for the .gantt_grid_data element to be available
        await page.waitForSelector('.gantt_grid_data', { timeout: 5000 });
        console.log("Found .gantt_grid_data element");

        // Initialize the data array
        let allTasks: any[] = [];
        let scrollCount = 0;

        // Start scrolling and scraping
        let lastScrollTop = 0;

        // Scroll within the .gantt_grid_data container
        while (true) {
            // Scroll the .gantt_grid_data element
            if (scrollCount > 0) {
                await page.evaluate(() => {
                    const ganttGridData = document.querySelector('.gantt_layout_cell.gantt_ver_scroll') as HTMLElement;
                    ganttGridData.scrollTop += 511;
                });
            }

            await page.waitForTimeout(3000); // Wait for content to load after scroll
            await page.screenshot({ path: `states/${email}/${config.projectId}/4_${scrollCount+1}.png` });
    
            // Scrape data after scrolling
            const tasks = await page.evaluate(() => {
                const taskData: any[] = [];
                const taskRows = document.querySelectorAll('.gantt_row');
                
                taskRows.forEach(row => {
                    const taskName = row.querySelector('[data-column-index="0"] .gantt_tree_text')?.textContent?.trim();
                    const duration = row.querySelector('[data-column-index="1"] .gantt_tree_text')?.textContent?.trim();
                    const startDate = row.querySelector('[data-column-index="2"] .gantt_tree_text')?.textContent?.trim();
                    const endDate = row.querySelector('[data-column-index="3"] .gantt_tree_text')?.textContent?.trim();

                    if (taskName && startDate && endDate) {
                        taskData.push({
                            taskName,
                            duration: duration ? duration : "0d",
                            startDate,
                            endDate,
                        });
                    }
                });

                return taskData;
            });

            // Append the scraped tasks to allTasks
            tasks.forEach(task => {
                const isDuplicate = allTasks.some(existingTask => 
                    existingTask.taskName === task.taskName &&
                    existingTask.startDate === task.startDate &&
                    existingTask.endDate === task.endDate
                );
                if (!isDuplicate) {
                    allTasks.push(task);
                }
            });

            // Save the data to a file after each scroll
            fs.writeFileSync(`states/${email}/${config.projectId}/tasks_page_${scrollCount+1}.json`, JSON.stringify(tasks, null, 2));

            console.log(`Page ${scrollCount} scraped and saved.`);

            if (scrollCount > 0) {
                const newScrollTop = await page.$eval('.gantt_layout_cell.gantt_ver_scroll', (el: HTMLElement) => el.scrollTop);
                if (newScrollTop === lastScrollTop) {
                    break; // Stop scrolling if no more content is loaded
                }                
                lastScrollTop = newScrollTop;
            }

            scrollCount++; // Increment the scroll count                
        }

        // Output the full scraped data to a final file
        fs.writeFileSync(`states/${email}/all_tasks_${config.projectId}.json`, JSON.stringify(allTasks, null, 2));

        console.log("Scraping finished, all tasks saved.");

        // Close the browser
        await browser.close();
        
    } catch (error) {
        console.error("Failed to open browser and page:", error);
    }
};

export const login = async (page: Page, email: string, password: string) => {
    try {
        await page.goto(`${config.baseUrl}/login`);
        await page.waitForTimeout(3000);
        await page.screenshot({ path: `states/${email}/1.png` });

        const emailInput = page.locator('input[id="email"]');
        await emailInput.fill(email);
        const passwordInput = page.locator('input[id="password"]');
        await passwordInput.fill(password);
        await page.screenshot({ path: `states/${email}/2.png` });

        const buttonSelector = 'button:has-text("Login")';  // Adjust the text content as necessary
        await page.click(buttonSelector);

        await page.waitForTimeout(5000);
        await page.screenshot({ path: `states/${email}/3.png` });
        
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};

openBrowserAndScrape(`${config.credentials.email}`, `${config.credentials.password}`);
