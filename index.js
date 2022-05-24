const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const datasetHandlers = require('./handlers/datasetHandlers.js');
const GH_API_Handlers = require('./handlers/GH_API_Handlers.js');

const DS_RAW = process.env.DS_RAW;
const DS_RESULT = process.env.DS_RESULT;
const DATE_FROM = new Date(process.env.DATE_FROM);

const resultHeaders = [
    {id: 'author', title: 'Автор'},
    {id: 'PR', title: 'Потенциально опасный PR автора'},
    {id: 'type', title: 'Тип исходного вредоносного вклада'},
    {id: 'link', title: 'Исходный вредоносный вклад'},
    {id: 'comment', title: 'Комментарий к исходному вредоносному вкладу'},
];

const fetchAsyncData = async (data, table, authors) => {
    if (datasetHandlers.isGitLink(data.link)) {
        const author = await datasetHandlers.getAuthor(data.link);
        const PRs = !authors.has(author) && await GH_API_Handlers.getPR(author, DATE_FROM);

        if (PRs && !authors.has(author)) {
            const uniquePRs = Array.from(new Set(PRs)).sort((a, b) => a.localeCompare(b));
            
            for (let pr of uniquePRs) {
                table.push({author: author, PR: pr, type: data.type, link: data.link, comment: data.comment})
            }
        }
        authors.add(author);
    }     
};

const readMalwareList = async (csv_path) => {
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
        .pipe(csv({headers: ['date', 'type', 'product', 'link', 'comment'], separator: ',', escape: '"'}))
        .on('data', async (data) => {
            promises.push(fetchAsyncData(data, table, authors));
        })
        .on('error', (error) => {
            console.log('Read file error:', error.message);
            reject();
        })
        .on('end', async () => {
            await Promise.all(promises);
            resolve();

            const tableSortedByType = table.sort((a, b) => a.type.localeCompare(b.type));

            for (let row of tableSortedByType) {
                await csvWriter.writeRecords([{author: row.author, PR: row.PR, type: row.type, link: row.link, comment: row.comment}]);   
            }
            
            console.log('END ======================\n', tableSortedByType);
        })
    })
}

readMalwareList(path.join('datasets',  DS_RAW), DATE_FROM);