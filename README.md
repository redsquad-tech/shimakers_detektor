# shimakers_detektor

#### scripts

**suspicious_table_creator.js** creates csv `datasets/result.csv` file for site table rendering

**dependencies_table_creator.js** creates csv `datasets/result_dependencies.csv` for the social graph

#### datasets

##### raw.csv

To start the project the file `datasets/raw.csv` should exist. It is based on [public dataset](https://docs.google.com/spreadsheets/d/1H3xPB4PgWeFcHjZ7NOPtrcya_Ua4jUolWm-7z9-jSpQ/htmlview# "public dataset"). File should has the separator `,` for cells.

**Attention:** sentecies which include commas should be in doible qotes: `"Sentence, with comma"`

The file should contain columns:

|        date         | type |      product      |                        link                         |                              comment                              |
| :-----------------: | :--: | :---------------: | :-------------------------------------------------: | :---------------------------------------------------------------: |
| 11.01.1991 11:11:11 | ddos | dangerous_project | https://github.com/dangerous_user/dangerous_project | "In case the sentence includes commas, should be in fouble qotes" |

##### result.csv

The file should contain columns:

| author         |                                PR                                |      created_at      |      merged_at       | stars | lang | type |                            link                             |                                                           comment |
| :------------- | :--------------------------------------------------------------: | :------------------: | :------------------: | :---: | :--: | :--: | :---------------------------------------------------------: | ----------------------------------------------------------------: |
| dangerous_user | https://github.com/project/possibly_dangerous_repo/pull/{number} | 2022-05-23T23:10:58Z | 2022-05-30T23:52:08Z | 1000  | PHP  | DDoS | https://github.com/dangerous_user/initial_dangerous_project | "In case the sentence includes commas, should be in double qotes" |

### site

`NextJS` site needs:

- `public/result.csv` to render table with author information
- `public/raw.csv` to download source file

### scripts/lib

#### Author

Gets author from GitHub link

#### scripts/lib/Suspicious.js

Gets information about author

#### scripts/lib/Dependancies.js

Gets followers and organisations connected with author

## USAGE

##### npm install

install dependencies

#### 1 way

##### npm start

Run **suspicious_table_creator.js** and **dependencies_table_creator.js** files

##### npm run build

Copy `datasets/raw.csv` and `datasets/result.csv` to the `site/public` folder

#### 2 way

##### make

Bulid the project

### Required variables

.env file in the root of the project should include:

##### DS_RAW

Name of the file based on [public dataset](https://docs.google.com/spreadsheets/d/1H3xPB4PgWeFcHjZ7NOPtrcya_Ua4jUolWm-7z9-jSpQ/htmlview# "public dataset")

##### DS_RESULT

Name of the file for site table rendering

##### DS_RESULT_DEPENDENCIES

Name of the file for the social graph

##### PAT

GitHub Personal Access Token is needed to increase limit of requsts per hour
