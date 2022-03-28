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

// Get author's actual repos
const checkActualCommits = async (commits) => {
    try {
        const response = await getGHRequest(commits);   
        const data = response.data;
        const hasActualCommits = data.filter((commit) => new Date(commit.commit.author.date) > new Date("2022-02-24"));
    
        return hasActualCommits.length;
    }
    catch (e) {
        console.log('checkActualCommits faild', e.message);
    }   
}

module.exports.getUserRepos = async (username) => {
    try {
        let url = `https://api.github.com/users/${username}`;

        const response = await getGHRequest(url);
        const data = response.data;
        
        const responseRepos = await getGHRequest(data.repos_url);
        const dataRepos = responseRepos.data;
    
        let actualRepos = [];
        for (const repo of dataRepos) {
            await checkActualCommits(repo.commits_url.slice(0, -6)) > 0 && actualRepos.push(repo.html_url);
          }
    
        return actualRepos;
    }
    catch (e) {
        console.log('getUserRepos faild', e.message);
    }
}
