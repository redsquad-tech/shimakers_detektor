const formRequestURLToCommits = (splitURL) => {
    splitURL[2] = 'commits'
    
    return splitURL.join('/');
}

const formRequestURLToPulls = (splitURL) => {
    splitURL[2] = 'pulls';
    splitURL = splitURL.includes('commit') ? splitURL.slice(0, 4) : splitURL;

    return splitURL.join('/');
}

module.exports.formRequestURL = (url, getUrlType) => {
    let getUrl = getUrlType === 'commits' ? formRequestURLToCommits : formRequestURLToPulls;
    
    const formattedURL = url.replace('https://github.com/', '').split('/');
    
    return getUrl(formattedURL);
}