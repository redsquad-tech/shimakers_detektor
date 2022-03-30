# shimakers_detektor

Script index.js creates dataset with repo links and usernames of possibly dangerous repositories

##### npm install

install dependencies

##### npm start

Launches dataset creation steps:

1. fileHandlers.readCSV(filename: string): read initial result.csv file created of [open dataset](https://docs.google.com/spreadsheets/d/1H3xPB4PgWeFcHjZ7NOPtrcya_Ua4jUolWm-7z9-jSpQ/htmlview?usp=sharing&pru=AAABf7rAbC0*P8SbG5KHN5WLt2JJJhoK-Q)

`input:` name of the csv file with the separators `\t` for cells and `\n` for rows kind of:
|dangerous project/user/repo name | link | comment | username |
|:--------------------------------:|:---------------------------------------------------:|:-----------:|:-------------------:|
|dangerous_user **{implicitly: \t}**| https://github.com/dangerous_user/dangerous_project \t| description \t | dangerous_user_name \n|

`output:` string

2. datasetHandlers.pickGitLinks(initial_dataset_name: string): chooses git links from this dataset

3. datasetHandlers.addAuthor(dataset_git_only): string): Add author field to the dataset

`input:` string

`output:` string with dataset kind of
| suspicious repo link | comment | username |
|:----------------------------------------------------:|:-----------------:|:-----------------:|
| https://github.com/dangerous_user/dangerous_project **{explicitly: \t}**| dangerous because of ... \t|dangerous_user_name \n|

4. datasetHandlers.getReposFromUserCommits(dataset_with_authors: string): chooses actual push events which the author have done since 2022.02.24, picks target repositories of the push and creates appropriate rows with the repo info in the dataset

`input:` string

`output:` string with dataset kind of
| suspicious repo link | comment | username |
|:----------------------------------------------------:|:-----------------:|:-----------------:|
| https://github.com/dangerous_user/dangerous_projectA \t| dangerous because of ... \t|dangerous_user_name1 \n|
| https://github.com/dangerous_user/dangerous_projectB \t| dangerous because of ... \t|dangerous_user_name1 \n|
| https://github.com/dangerous_user/dangerous_projectC \t| dangerous because of ... \t|dangerous_user_name1 \n|
| https://github.com/dangerous_user/dangerous_projectA \t| dangerous because of ... \t|dangerous_user_name2 \n|
| https://github.com/dangerous_user/dangerous_projectA \t| dangerous because of ... \t|dangerous_user_name3 \n|

5. fileHandlers.writeCSV(filename: string, dataset: string): writes the dataset in the csv file

### Required variables

in .env file should be:

##### DS_RAW

Name of the initial file in the datasets folder

##### DS_RESULT

Name of the final file in the datasets folder

##### PAT

Variable for GH API key (is needed to increase limit of requsts per hour). Should be NOT expired
