# shimakers_detektor

##### npm install

install dependencies

#### Variables

##### PAT

Variable for GH API key (is needed to increase limit of requsts per hour)

##### nameTargetDS

Variable with name of TargetDS

##### createTargetDS

Creates result csv file

`input:` csv file with the separators `\t` for cells and `;` for rows kind of:
|dangerous project/user/repo name | link | comment | username |
|:--------------------------------:|:---------------------------------------------------:|:-----------:|:-------------------:|
|dangerous_user| https://github.com/dangerous_user/dangerous_project | description | dangerous_user_name |

`output:`
| repo link | username |
|:----------------------------------------------------:|:-----------------:|
| https://github.com/dangerous_user/dangerous_project |dangerous_user_name|
