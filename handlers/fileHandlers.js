const path = require('path');
const fs = require('fs');

module.exports.writeCSV = (filename, dataset) => {
    const CSVpath = path.join('datasets', filename);

    fs.writeFile(CSVpath, dataset, { encoding: 'utf8'}, (e) => {
        if (e) {
            return console.log('fs writing error', e.message);
        }
        console.log('writeFile: done');    
      });    
}

module.exports.readCSV = (filename) => {
    const CSVpath = path.join('datasets', filename)
    
    return fs.readFileSync(CSVpath, 'utf8', (e, data) => {
        if (e) {
            return console.log('fs reading error', e.message);
        }

        return data;
    })
}
