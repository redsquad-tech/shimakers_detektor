const axios = require('axios')

const PAT = process.env.PAT;

let options = {
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Token " + PAT,
        'user-agent': 'node.js'
    }
};

const getGHRequest = (url) => {
    return axios
        .get(url, options)
        .catch((e) => console.log('axios request has failed:\n', e.message));
}

const getRepoInfo = async (url) => {
    try {
        const response = await getGHRequest(url);
        const data = response.data;

        return {
            stars: data.stargazers_count,
            lang: data.language
        };
    }
    catch (e) {
        console.log('getRepoInfo faild:\n', e.message);
    }
}

module.exports.getAuthorFromCommit = async (parametrs) => {
    try {
        let url =`https://api.github.com/repos/${parametrs}`;

        const response = await getGHRequest(url);
        const data = response.data;
        let author = data?.author?.login ? data?.author?.login : data?.commit?.author?.name;

        return author;
    }
    
    catch (e) {console.log('getAuthorFromCommit is failed:\n', e.message)};
}

module.exports.getAuthorFromPull = async (parametrs) => {
    try {
        let url =`https://api.github.com/repos/${parametrs}`;

        const response = await getGHRequest(url);
        const data = response.data;
        
        return data.user.login;
    }
    
    catch (e) {console.log('getAuthorFromPull is failed:\n', e.message)};
}

module.exports.getAuthorFromPullCommit = async (parametrs, commitSHA) => {
    try {
        let url =`https://api.github.com/repos/${parametrs}`;
        
        const response = await getGHRequest(url);
        const data = response.data;

        const commit = data.filter((commit) => commit.sha === commitSHA)[0];

        return commit.author.login;
    }
    
    catch (e) {console.log('getAuthorFromPullCommit is failed:\n', e.message)};
}

module.exports.getAuthorFromIssue = async (parametrs) => {
    try {
        let url =`https://api.github.com/repos/${parametrs}`;

        const response = await getGHRequest(url);
        const data = response.data;

        return data.user.login;
    }
    
    catch (e) {console.log('getAuthorFromIssue is failed:\n', e.message)};
}

module.exports.getPullRequestsFromEvent = async (username, date_from) => {
    try {
        let url = `https://api.github.com/users/${username}/events`;
        
        const result = [];
        const response = await getGHRequest(url);
        const data = response.data;

        for (let event of data) {
            if (event.type === 'PullRequestEvent' && new Date(event.created_at) > date_from) {
                const repoInfo = await getRepoInfo(event.repo.url);
                
                const fullInfo = {
                    url: event.payload.pull_request.html_url,
                    created_at: event.payload.pull_request.created_at,
                    merged_at: event.payload.pull_request.merged_at,
                    stars: repoInfo.stars,
                    lang: repoInfo.lang
                };

                result.push(fullInfo);
            }
        }    

        // TODO: refactor complicated sorting logic
        const uniquePRs = Array.from(new Set(result))
            // Remove doubles with null merged_at field
            .filter((elem, index) => {
                let isNotDouble = true;
                
                result.forEach((e, i) => {
                    if (index !== i && elem.url === e.url)
                        isNotDouble = elem.merged_at !== null
                });

                return isNotDouble;
            }) 
            // Sort by url
            .sort((a, b) => a.url.localeCompare(b.url));

        return uniquePRs;
    }
    catch (e) {
        console.log('getPullRequestsFromEvent faild:\n', e.message);
    }
}

module.exports.getOrgansiations = async (username) => {
    try {
        let url =`https://api.github.com/users/${username}/orgs`;

        const response = await getGHRequest(url);
        const data = response.data;

        const orgs = data.map((org) => org.login)

        return orgs;
    }
    
    catch (e) {console.log('getAuthorFromIssue is failed:\n', e.message)};
}

module.exports.getFollowers = async (username) => {
    try {
        let url =`https://api.github.com/users/${username}/followers`;

        const response = await getGHRequest(url);
        const data = response.data;

        const orgs = data.map((org) => org.login)

        return orgs;
    }
    
    catch (e) {console.log('getAuthorFromIssue is failed:\n', e.message)};
}