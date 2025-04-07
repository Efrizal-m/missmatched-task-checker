# missmatched-task-checker

## Setup

run
```npx playwright install-deps
npx plawright install

npm install
```
## Scraping data from sitesched appu

update .env file then run
```
ts-node ./command/scrape.ts
```

## Compare data from sitesched app with csv files

update file paths in "compare.ts" then run
```
ts-node ./command/compare.ts
```

## Check duration in csv file

update file paths in file "checkCsvDuration.ts" then run
```
ts-node ./command/checkCsvDuration.ts
```