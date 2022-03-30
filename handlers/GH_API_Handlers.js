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
        .catch((e) => console.log('axios request has failed!\n', e.message));
}

// Get author
module.exports.getAuthorFromCommit = async (parametrs) => {
    try {
        let url =`https://api.github.com/repos/${parametrs}`;

        const response = await getGHRequest(url);
        const data = response.data;
        let field = data?.author?.login ? data?.author?.login : data?.commit?.author?.name;

        return field;
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

//  From pushEvent get repos with author's contribution
module.exports.getReposFromPushEvents = async (username) => {
    try {
        let url = `https://api.github.com/users/${username}/events`;
        let repoList = new Set();

        const response = await getGHRequest(url);
        const data = response.data;

        const actualEvents = data.filter((event) =>  event.type === 'PushEvent' && new Date(event.created_at) > new Date("2022-02-24"))

        actualEvents.forEach((event) => repoList.add(`https://github.com/${event.repo.url.split('/').slice(-2).join('/')}`));

        return repoList;
    }
    catch (e) {
        console.log('getReposFromPushEvents faild', e.message);
    }
}