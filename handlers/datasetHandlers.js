const formatURLHandlers = require('../handlers/formatURLHandlers.js');
const GH_API_Handlers = require('../handlers/GH_API_Handlers.js');

module.exports.pickGitLinks = (rawDataset) => {    
    console.log('pickGitLinks');

    let dataset = rawDataset
    .split(/\n/)
        .map((row) => {
            if (row.includes('github.com')) {
                return row
                .split(/\t/)
                    .reduce((currentRow, cell, index) => {
                        if (![0, 1].includes(index)) {
                            const delimetr = [2, 3].includes(index) ? '\t' : '\n';
                            currentRow = currentRow + cell + delimetr;
                        }
                        
                        return currentRow;
                }, '');
            }
        })
        .filter((r) => r).join('\n');
        
    return dataset;
}

module.exports.addAuthor = async (gitDataset) => {    
    console.log('addAuthor');

    let dataset = [];

    for (let row of gitDataset.split(/\n/)) {
        let username;
        let url;

        for (let [index, cell] of row.split(/\t/).entries()) {
            if (index === 1) {
                if ((/pull/).test(cell)) {
                    url = formatURLHandlers.formRequestURL(cell, 'pulls');
                    username = await GH_API_Handlers.getAuthorFromPull(url);
                }
                else if ((/commit/).test(cell)) {
                    url = formatURLHandlers.formRequestURL(cell, 'commits');
                    username = await GH_API_Handlers.getAuthorFromCommit(url);
                }
                else {
                    username = cell.replace('https://github.com/', '').split('/')[0];
                }
            }
        }
        
        if (username) {
            row += '\t' + username;
            dataset.push(row)
        }
    }
        
    return dataset.filter((r) => r).join('\n');
}

module.exports.createResultDS = async (fullDataset) => {
    console.log('createResultDS');

    let dataset = [];

    for (let row of fullDataset.split(/\n/)) {
        let repos;
        let comment;
        let author;

        for (let [index, cell] of row.split(/\t/).entries()) {
            
            if (index === 2) {
                comment = cell;
            }
            if (index === 3) {
                author = cell;
                repos = await GH_API_Handlers.getUserRepos(cell);
            }
        }

        console.log('createResultDS author:', author);

        repos && repos.forEach((r) => dataset.push(r + '\t' + comment + '\t' + author));
    }

    return dataset.filter((r) => r).join('\n');
}