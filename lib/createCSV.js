const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const { sortByAlphabet } = require('../utils/sort.js');

 module.exports.createCSV = async (raw_path, result_path, result_headers, raw_headers, async_handler) => {
    // TODO: get rid of global variables table and authors (?)
    let table = [];
    const authors = new Set();
    const sortParam = 'author';

    const readStream = fs.createReadStream(raw_path);
    const csvWriter = createCsvWriter({
        path: result_path,
        header: result_headers,
    });

    new Promise((resolve, reject) => {
        const promises = [];
        
        readStream
        .pipe(csv({headers: raw_headers, separator: ',', escape: '"'}))
        .on('data', async (data) => {
            promises.push(async_handler(data, table, authors));
        })
        .on('error', (error) => {
            console.log('Read file error:', error.message);
            reject();
        })
        .on('end', async () => {
            await Promise.all(promises);
            resolve();

            const tableSorted = sortByAlphabet(table, sortParam);

            await csvWriter.writeRecords(tableSorted);

            console.log('END ======================\n', tableSorted);
        })
    })
}
