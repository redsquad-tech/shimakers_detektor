const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const { fetchAsyncData } = require('./handlers/fetchHandler.js');

const DS_RAW = process.env.DS_RAW;
const DS_RESULT = process.env.DS_RESULT;
const DATE_FROM = new Date(process.env.DATE_FROM);

const rawHeaders = ['date', 'type', 'product', 'link', 'comment'];
const resultHeaders = [
    {id: 'author', title: 'Автор'},
    {id: 'PR', title: 'Потенциально опасный PR автора'},
    {id: 'created_at', title: 'Дата создания'},
    {id: 'merged_at', title: 'Дата принятия'},
    {id: 'stars', title: 'Рейтинг репозитория'},
    {id: 'lang', title: 'Язык репозитория'},
    {id: 'type', title: 'Тип исходного вредоносного вклада'},
    {id: 'link', title: 'Исходный вредоносный вклад'},
    {id: 'comment', title: 'Комментарий к исходному вредоносному вкладу'},
];

const readMalwareList = async (csv_path) => {
    // TODO: get rid of global variables table and authors (?)
    let table = [];
    const authors = new Set();

    const readStream = fs.createReadStream(csv_path);
    const csvWriter = createCsvWriter({
        path: path.join('datasets', DS_RESULT),
        header: resultHeaders,
    });

    new Promise((resolve, reject) => {
        const promises = [];
        
        readStream
        .pipe(csv({headers: rawHeaders, separator: ',', escape: '"'}))
        .on('data', async (data) => {
            promises.push(fetchAsyncData(DATE_FROM, data, table, authors));
        })
        .on('error', (error) => {
            console.log('Read file error:', error.message);
            reject();
        })
        .on('end', async () => {
            await Promise.all(promises);
            resolve();

            const tableSortedByType = table.sort((a, b) => a.type.localeCompare(b.type));

            await csvWriter.writeRecords(tableSortedByType);

            console.log('END ======================\n', tableSortedByType);
        })
    })
}

readMalwareList(path.join('datasets',  DS_RAW), DATE_FROM);