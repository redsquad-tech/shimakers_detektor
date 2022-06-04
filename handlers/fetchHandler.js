const datasetHandlers = require('./datasetHandlers.js');
const GH_Handlers = require('./GH_Handlers.js');

// TODO: shouldn't change table and authors inside the module
module.exports.fetchAsyncData = async (date, data, table, authors) => {
    if (datasetHandlers.isGitLink(data.link)) {
        const author = await datasetHandlers.getAuthor(data.link);
        
        if(!authors.has(author)) {
            const PRs = await GH_Handlers.getPullRequestsFromEvent(author, date);
            
            if (PRs) {
                for (let pr of PRs) {
                    const tableInfo = {
                        author: author,
                        PR: pr.url,
                        created_at: pr.created_at,
                        merged_at: pr.merged_at,
                        stars: pr.stars,
                        lang: pr.lang,
                        type: data.type,
                        link: data.link,
                        comment: data.comment
                    };
    
                    table.push(tableInfo);
                }
            }
        }

        authors.add(author);
    // TODO: return authors and table (?)
    }     
};