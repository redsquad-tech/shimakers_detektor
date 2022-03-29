const formRequestURLToCommits = (splitURL) => {
    splitURL[2] = 'commits'
    
    return splitURL.join('/');
}

const formRequestURLToPulls = (splitURL) => {
    splitURL[2] = 'pulls';
    
    return splitURL.join('/');
}

const formRequestURLToPullCommit = (splitURL) => {
    splitURL[2] = 'pulls';

    const urlData = {
        commits: splitURL.slice(0, 5).join('/'), 
        commitSHA: splitURL.slice(-1).join('/')
    }
    
    return urlData;
}

const formRequestURLToIssues = (splitURL) => {
    return splitURL.join('/');
}

module.exports.formRequestURL = (url, getUrlType) => {
    const formattedURL = url.replace('https://github.com/', '').split('/');

    switch (getUrlType) {
        case 'commits':
            return formRequestURLToCommits(formattedURL);
        case 'pulls':
            return formRequestURLToPulls(formattedURL);
        case 'issues':
            return formRequestURLToIssues(formattedURL);
        case 'pullCommit':
            return formRequestURLToPullCommit(formattedURL);
    }
}