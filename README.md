# missmatched-task-checker

## Pre-requisition before using the application

inside sitesched apps
- login with your credentials and copy the projectId to .env file
- try to scrapping the data and compare with original data

outside sitesched apps
- convert your .mpp or pdf files to .csv file using project365 apps or another similar apps
- copy the csv files to project, you can also check the validity of the validity of original file with check duration (ready to use)
 of the files and check the predecessor w or w.o. its lags/leads (cooming soon)


## Setup

run
```
npx playwright install-deps
npx playwright install

npm install
```
## Scraping data from sitesched app

update .env file then run
```
ts-node ./script/scrape.ts
```

## Compare data from sitesched app with csv files

update file paths in "compare.ts" then run
```
ts-node ./script/compare.ts
```

## Check duration in csv file

update file paths in file "checkCsvDuration.ts" then run
```
ts-node ./script/checkCsvDuration.ts
```
