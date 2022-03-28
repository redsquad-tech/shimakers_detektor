const datasetHandlers = require('./handlers/datasetHandlers.js');
const fileHandlers = require('./handlers/fileHandlers.js');

const DS_RAW = process.env.DS_RAW;
const DS_RESULT = process.env.DS_RESULT;

const rawDS = fileHandlers.readCSV(DS_RAW);
const gitDS = datasetHandlers.pickGitLinks(rawDS)
const gitDSWithAuthors = datasetHandlers.addAuthor(gitDS)

gitDSWithAuthors
    .then(async (dataset) => {
        const result = await datasetHandlers.createResultDS(dataset);

        return result;
    })
    .then((result) => {
        console.log('Could be written:', result)
        fileHandlers.writeCSV(DS_RESULT, result);
    })
    .catch((e) => console.log('gitDSWithAuthors failed:', e.message));