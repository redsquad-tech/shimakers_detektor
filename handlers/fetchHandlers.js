const datasetHandlers = require('./datasetHandlers.js');
const GH_Handlers = require('./GH_Handlers.js');

// TODO: shouldn't change table and authors inside the module
module.exports.fetchMain = async (data, table, authors) => {
    const DATE_FROM = new Date(process.env.DATE_FROM);

    if (datasetHandlers.isGitLink(data.link)) {
        const author = await datasetHandlers.getAuthor(data.link);
        
        if (!authors.has(author)) {
            authors.add(author);
            const PRs = await GH_Handlers.getPullRequestsFromEvent(author, DATE_FROM);
            
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
    }     
};

module.exports.fetchSocial = async (data, table, authors) => {
    const author = data['Автор'];
    
    if (!authors.has(author)) {
        authors.add(author);

        const orgs = await GH_Handlers.getOrgansiations(author);
        const followers = await GH_Handlers.getFollowers(author);

        if (orgs?.length > 0) {
            const tableInfo = {
                author: author,
                organizations: orgs,
                friends: followers
            };
            
            table.push(tableInfo);
        }
    }
};