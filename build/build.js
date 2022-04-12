const path = require('path');
const fs = require('fs');
const { Csv2md } = require('csv2md');


const DS_RESULT = 'result.csv';
const MARKDOWN = 'index.md';

let csv2md = new Csv2md({
    pretty: true
  })

fs.readFile(path.join('datasets', DS_RESULT), {encoding: 'utf-8'}, (error, data) => {
    if (error) throw error.message;

    csv2md.convert(data).then((res) => {
        fs.writeFile(path.join('site', MARKDOWN), res, (err) => {
            if (err) throw err.message;
            console.log('The file has been saved!');
          });    
    })
});



