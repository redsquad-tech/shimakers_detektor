# shimakers_detektor

Script index.js creates dataset with information about possibly dangerous projects in which the harmfull users made a contribution through pull request

##### npm install

install dependencies

##### npm start

Launches the index.js file where readMalwareList() fuction executes steps of parsing.

#### readMalwareList(csv_path: string)

This is the main function. It reads initial raw.csv file created of [open dataset](https://docs.google.com/spreadsheets/d/1H3xPB4PgWeFcHjZ7NOPtrcya_Ua4jUolWm-7z9-jSpQ/htmlview?usp=sharing&pru=AAABf7rAbC0*P8SbG5KHN5WLt2JJJhoK-Q)

`input:` name of the csv file. File should has the separator `,` for cells.

**Attention:** sentecies which include commas should be in doible qotes: `"Sentence, with comma"` :

|        date         | type_of_the_threat | dangerous project/user/repo name |                        link                         |                              comment                              |      username       |
| :-----------------: | :----------------: | :------------------------------: | :-------------------------------------------------: | :---------------------------------------------------------------: | :-----------------: |
| 11.01.1991 11:11:11 |        ddos        |        dangerous_project         | https://github.com/dangerous_user/dangerous_project | "In case the sentence includes commas, should be in fouble qotes" | dangerous_user_name |

`output:` output is possible in two ways

- list of objects in condole stdout

> [ {type: string, author: string, repo: string, PR: link, comment: string},
>
> > {type: string, author: string, repo: string, PR: link, comment: string} ]

- Result is written to result.csv file:

| type |     author     |                link_on_project_repo                 |                  link_on_PR                   |                              comment                              |
| :--: | :------------: | :-------------------------------------------------: | :-------------------------------------------: | :---------------------------------------------------------------: |
| ddos | dangerous_user | https://github.com/dangerous_user/dangerous_project | https://github.com/project/repo/pull/{number} | "In case the sentence includes commas, should be in fouble qotes" |

#### MAIN STEPS OF PARSING IN readMalwareList()

1. datasetHandlers.getAuthor(issue_path: string)

`input:` link to the project/repo/commit

`output:` string with username

2. GH_API_Handlers.getPR(author: string, date_from: Date):

`input:` author and date of the earliest pullRequestEvent

`output:` List of objects with the information from pullRequestEvent which author made since date_from.

> [ {repo: link_to_repo_where_PR_was_made_by_author, PR: link_to_PR},
>
> > {repo: link_to_repo_where_PR_was_made_by_author, PR: link_to_PR}, ]

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
