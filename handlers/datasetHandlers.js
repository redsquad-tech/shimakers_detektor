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
                    if ((/commits/).test(cell)) {
                        urlData = formatURLHandlers.formRequestURL(cell, 'pullCommit');
                        username = await GH_API_Handlers.getAuthorFromPullCommit(urlData.commits, urlData.commitSHA);
                    }
                    else {
                        url = formatURLHandlers.formRequestURL(cell, 'pulls');
                        username = await GH_API_Handlers.getAuthorFromPull(url);
                    }
                }
                else if ((/commit/).test(cell)) {
                    url = formatURLHandlers.formRequestURL(cell, 'commits');
                    username = await GH_API_Handlers.getAuthorFromCommit(url);
                }
                else if ((/issues/).test(cell)) {
                    url = formatURLHandlers.formRequestURL(cell, 'issues');
                    username = await GH_API_Handlers.getAuthorFromIssue(url);
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

module.exports.getReposFromUserPush = async (fullDataset) => {
    console.log('getReposFromUserPush');

    let authors = new Set();
    let dataset = ['suspicious repo link\tcomment\tusername'];

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
                repos = !authors.has(author) && await GH_API_Handlers.getReposFromPushEvents(cell);

                authors.add(author);
            }
        }

        console.log('getReposFromUserPush author:', author);

        repos && repos.forEach((r) => dataset.push(r + '\t' + comment + '\t' + author));
    }

    return dataset.filter((r) => r).join('\n');
}