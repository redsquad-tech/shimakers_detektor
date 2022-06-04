# shimakers_detektor

Script index.js creates dataset with information about possibly harmfull projects in which the dangerous users made a contribution through pull request

##### npm install

install dependencies

## USAGE

#### 1 way

##### npm start

Launches the index.js file where readMalwareList() fuction executes steps of parsing.

##### npm run build

Moves dataset to the site folder

#### 2 way

##### make

Bulid the project

### Required variables

.env file in the root of the project should include:

##### DS_RAW

Name of the initial file in the datasets folder

##### DS_RESULT

Name of the final file in the datasets folder

##### PAT

Variable for GH API key (it is needed to increase limit of requsts per hour). Should be NOT expired

## DETAILS

#### readMalwareList(csv_path: string)

This is the main function. It reads initial raw.csv file created of [open dataset](https://docs.google.com/spreadsheets/d/1H3xPB4PgWeFcHjZ7NOPtrcya_Ua4jUolWm-7z9-jSpQ/htmlview?usp=sharing&pru=AAABf7rAbC0*P8SbG5KHN5WLt2JJJhoK-Q)

`input:` name of the csv file. File should has the separator `,` for cells.

**Attention:** sentecies which include commas should be in doible qotes: `"Sentence, with comma"` :

|        date         | type_of_the_threat | dangerous project/user/repo name |                        link                         |                              comment                              |      username       |
| :-----------------: | :----------------: | :------------------------------: | :-------------------------------------------------: | :---------------------------------------------------------------: | :-----------------: |
| 11.01.1991 11:11:11 |        ddos        |        dangerous_project         | https://github.com/dangerous_user/dangerous_project | "In case the sentence includes commas, should be in fouble qotes" | dangerous_user_name |

`output:` result.csv file:

| contributor    |                          contributor_PR                          |    creation date     |      merge date      | stars | language | reason_for_listing_contributor_to_malware |             harmfull_contribution_link              |                       comment_to_the_reason                       |
| :------------- | :--------------------------------------------------------------: | :------------------: | :------------------: | :---: | :------: | :---------------------------------------: | :-------------------------------------------------: | :---------------------------------------------------------------: |
| dangerous_user | https://github.com/project/possibly_dangerous_repo/pull/{number} | 2022-05-23T23:10:58Z | 2022-05-30T23:52:08Z | 1000  |   PHP    |                   ddos                    | https://github.com/dangerous_user/dangerous_project | "In case the sentence includes commas, should be in double qotes" |

#### MAIN STEPS OF PARSING IN readMalwareList()

1. fetchHandler.fetchAsyncData(date: Date, data: Object of strings, table: Array | Array of objects, authors: Set of authors)
   `input:` date, data, table, authors
   `output:` object with fields for writing to the result table (unsorted)
   {
   author: string,
   PR: string,
   created_at: string,
   merged_at: string | null,
   stars: number,
   lang: string,
   type: string,
   link: string,
   comment: string
   }

2. datasetHandlers.getAuthor(issue_path: string)

`input:` link to the project/repo/commit

`output:` string with username

3. GH_Handlers.getPullRequestsFromEvent(author: string, date_from: Date):

`input:` author and date since when pullRequestEvent is needed

`output:` Array of objects with the pull requests info from pullRequestEvent which author made since date_from.

> [

    url: string,
    created_at: string,
    merged_at: string,
    stars: string,
    lang: string

]

#### CUSTOM HANDLERS

- datasetHandlers.js module gets cirtain properties via parsed info from initial dataset

- formatURLHandlers.js module forms appropriate URL links for GET requests

- GH_Handlers.js module is based on [github API](https://docs.github.com/en/rest) and executes GET requests and fetch properties from API responses which are needed in result dataset.
