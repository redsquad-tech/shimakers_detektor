const axios = require('axios')
require('dotenv').config();

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

// Get author
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

module.exports.getPR = async (username, date_from) => {
    try {
        let url = `https://api.github.com/users/${username}/events`;
        
        const result = [];
        const response = await getGHRequest(url);
        const data = response?.data;

        if (data) {
            for (let event of data) {
                if (event.type === 'PullRequestEvent' && new Date(event.created_at) > date_from) {
                    result.push(event.payload.pull_request.html_url);
                }
            }    
        }
        
        return result;
    }
    catch (e) {
        console.log('getReposFromPushEvents faild:\n', e.message);
    }
}

/* Depricated */

const getRepos = async (url) => {
    try {
        const urlFull = `${url}/events`;
        const response = await getGHRequest(urlFull);
        
        return response.data;
    }
    
    catch (e) {console.log('getRepos is failed:\n', e.message)};
}

const getCommits = async (commits, author) => {
    try {
        return commits.map((commit) => commit.author.name == author && commit.sha)
    }
    
    catch (e) {console.log('getCommits is failed:\n', e.message)};
}

//  From pushEvent get repos with author's contribution
module.exports.getInfoFromPushEvents = async (username, date_from) => {
    try {
        let url = `https://api.github.com/users/${username}/events`;
        
        const result = [];
        const response = await getGHRequest(url);
        const data = response.data;

    
        for (let event of data) {
            if (event.type === 'PushEvent' && new Date(event.created_at) > date_from) {
                const name = event.payload.commits[0].author.name;

                const repos = await getRepos(event.repo.url);
                
                for (let repoEvent of repos) {
                    const branch = new RegExp(repoEvent.payload.ref);
                    
                    if (repoEvent.type === 'PushEvent' && /main|master/.test(branch)) {
                        const commitSHA = getCommits(repoEvent.payload.commits, name);
                        
                        commitSHA.forEach((SHA) => {
                            result.push({
                                username: username,
                                repo: `https://github.com/${repoEvent.repo.name}`, 
                                commit: `https://github.com/${event.repo.name}/commit/${SHA}`,
                            })

                        })
                    }   
                }
            }
        }

        return result;
    }
    catch (e) {
        console.log('getReposFromPushEvents faild:\n', e.message);
    }
}