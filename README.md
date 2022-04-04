# shimakers_detektor

Script index.js creates dataset with repo links and usernames of possibly dangerous repositories

##### npm install

install dependencies

##### npm start

Launches dataset creation steps:

1. readMalwareList(csv_path: string): read initial raw.csv file created of [open dataset](https://docs.google.com/spreadsheets/d/1H3xPB4PgWeFcHjZ7NOPtrcya_Ua4jUolWm-7z9-jSpQ/htmlview?usp=sharing&pru=AAABf7rAbC0*P8SbG5KHN5WLt2JJJhoK-Q)

`input:` name of the csv file. File should has the separator `,` for cells.
**Attention:** sentecies which include commas should be in doible qotes: `"Sentence, with comma"` :
|data|type|dangerous project/user/repo name | link | comment | username |
|:---|:---:|:-----------------------------:|:---------------------------------------------------:|:-----------:|:-------------------:|
|11.01.1991 11:11:11 ,{separator} |ddos , |dangerous_user ,| https://github.com/dangerous_user/dangerous_project ,| "description,{explicit text comma} can includes, commas" , | dangerous_user_name|

2. datasetHandlers.getAuthor(issue_path: string)
   `input:` link to the project/repo/commit
   `output:`username: string

3. datasetHandlers.getRepoAndCommits(author: string, date_from: Date):
   `input:` author: string, date_from: Date

`output:` List of objects. Every object made of repo event info where author made a commit. Type of:
{username: username,
repo: `https://github.com/project/repo`,
commit: `https://github.com/project/repo/commit/SHA`,
}

4. Result is written to result.csv and in condole stdout:
   `output:` list of object type of:
   [
   {type: string, author: string, repo: string, commit: string, data: string}
   {type: string, author: string, repo: string, commit: string, data: string}
   ]

5. fileHandlers.writeCSV(filename: string, dataset: string): writes the dataset in the csv file

### Required variables

in .env file should be:

##### DS_RAW

Name of the initial file in the datasets folder

##### DS_RESULT

Name of the final file in the datasets folder

##### PAT

Variable for GH API key (is needed to increase limit of requsts per hour). Should be NOT expired
