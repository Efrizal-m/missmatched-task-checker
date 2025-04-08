# missmatched-task-checker

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
