# shimakers_detektor

Script index.js creates dataset with information about possibly dangerous projects in which the harmfull users made a contribution through pull request

##### npm install

install dependencies

**NOTE:** to build the site main page need make `npm install -g csv2md`

##### npm start

Launches the index.js file where readMalwareList() fuction executes steps of parsing.

##### npm run buld

Creates main page for the site in the buld folder

#### readMalwareList(csv_path: string)

This is the main function. It reads initial raw.csv file created of [open dataset](https://docs.google.com/spreadsheets/d/1H3xPB4PgWeFcHjZ7NOPtrcya_Ua4jUolWm-7z9-jSpQ/htmlview?usp=sharing&pru=AAABf7rAbC0*P8SbG5KHN5WLt2JJJhoK-Q)

`input:` name of the csv file. File should has the separator `,` for cells.

**Attention:** sentecies which include commas should be in doible qotes: `"Sentence, with comma"` :

|        date         | type_of_the_threat | dangerous project/user/repo name |                        link                         |                              comment                              |      username       |
| :-----------------: | :----------------: | :------------------------------: | :-------------------------------------------------: | :---------------------------------------------------------------: | :-----------------: |
| 11.01.1991 11:11:11 |        ddos        |        dangerous_project         | https://github.com/dangerous_user/dangerous_project | "In case the sentence includes commas, should be in fouble qotes" | dangerous_user_name |

`output:` result.csv file:

|  contributor   |                          contributor_PR                          | reason_for_listing_contributor_to_malware |             harmfull_contribution_link              |                       comment_to_the_reason                       |
| :------------: | :--------------------------------------------------------------: | :---------------------------------------: | :-------------------------------------------------: | :---------------------------------------------------------------: |
| dangerous_user | https://github.com/project/possibly_dangerous_repo/pull/{number} |                   ddos                    | https://github.com/dangerous_user/dangerous_project | "In case the sentence includes commas, should be in double qotes" |

#### MAIN STEPS OF PARSING IN readMalwareList()

1. datasetHandlers.getAuthor(issue_path: string)

`input:` link to the project/repo/commit

`output:` string with username

2. GH_API_Handlers.getPR(author: string, date_from: Date):

`input:` author and date since when pullRequestEvent is needed

`output:` Array of strings with the pull requests links from pullRequestEvent which author made since date_from.

> [ link_to_PR, link_to_PR2, link_to_PR3 ]

#### CUSTOM HANDLERS

- datasetHandlers.js module gets cirtain properties via parsed info from initial dataset

- formatURLHandlers.js module forms appropriate URL links for GET requests

- GH_API_Handlers.js module is based on [github API](https://docs.github.com/en/rest) and executes GET requests and fetch properties from API responses which are needed in result dataset.

### Required variables

in .env file should be:

##### DS_RAW

Name of the initial file in the datasets folder

##### DS_RESULT

Name of the final file in the datasets folder

##### PAT

Variable for GH API key (it is needed to increase limit of requsts per hour). Should be NOT expired
