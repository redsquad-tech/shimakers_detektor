const formatURLHandlers = require('../handlers/formatURLHandlers.js');
const GH_Handlers = require('./GH_Handlers.js');

module.exports.isGitLink = (link) => {   
    try {
        return link.includes('github.com')
    } 
    catch (error) {
        console.log('isGitLink is failed:', error.message);
    }
}

module.exports.getAuthor = async (issue_path) => {    
    try {
        let username;
        let url;
        
        if (issue_path.includes('issues')) { 
            return;
        } 
        else if (issue_path.includes('pull')) {
            if (issue_path.includes('commits')) {
                urlData = formatURLHandlers.formRequestURL(issue_path, 'pullCommit');
                username = await GH_Handlers.getAuthorFromPullCommit(urlData.commits, urlData.commitSHA);
            }
            else {
                url = formatURLHandlers.formRequestURL(issue_path, 'pulls');
                username = await GH_Handlers.getAuthorFromPull(url);
            }
        }
        else if (issue_path.includes('commit')) {
            url = formatURLHandlers.formRequestURL(issue_path, 'commits');
            username = await GH_Handlers.getAuthorFromCommit(url);
        }
        else {
            username = issue_path.replace('https://github.com/', '').split('/')[0];
        }

        console.log('getAuthor:', username);

        return username;
    }
    catch (error) {
        console.log('getAuthor is failed:', error.message);
    }   
}

/* depricated */
module.exports.getRepoAndCommits = async (author, date_from) => {
    try {
        const info = await GH_Handlers.getInfoFromPushEvents(author, date_from);
    
        return info;    
    }
    catch (error) {
        console.log('getRepoAndCommits is failed:', error.message);
    }
}