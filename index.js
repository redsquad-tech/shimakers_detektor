const fs = require('fs');
const axios = require('axios')
require('dotenv').config();

const PAT = process.env.PAT;

/* ==========
Existing DSs 
========== */
const DS_RAW = process.env.DS_RAW;
const DS_NO_USERS = process.env.DS_NO_USERS;
const DS = process.env.DS;
/* ========== */

const nameTargetDS = './datasets/TargetDS';

let options = {
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Token " + PAT,
        'user-agent': 'node.js'
    }
};

/* ==========
URL HANDLE: format url for GH API request 
========== */
const parseURL = (url, getParametr) => {
    const parametr = url.replace('https://github.com/', '').split('/');
    
    return getParametr(parametr);
}

const commitParsedURL = (splitURL) => {
    splitURL[2] = 'commits'
    
    return splitURL.join('/');
}

const pullParsedURL = (splitURL) => {
    splitURL[2] = 'pulls';
    splitURL = splitURL.includes('commit') ? splitURL.slice(0, 4) : splitURL;

    return splitURL.join('/');
}

/* ==========
FILE HANDLE
========== */
const writeFile = (dataString, datasetName) => {
    fs.writeFile(`${datasetName}.csv`, dataString, { encoding: 'utf8'}, (err) => {
    // fs.writeFile(`${datasetName}.csv`, dataString, { encoding: 'utf8', flag: "a+" }, (err) => {
        if (err) {
            return console.log('fs writing error', err);
        }
        console.log('writeFile: is done');    
      });    
}

// CREATE DATASET WITH USERS
const createFullDS = (filename) => {    
    fs.readFile(filename, 'utf8', async (err, data) => {
        if (err) {
            return console.log('fs reading error', err);
        }
        
        let dataset = [];
        for (let row of data.split(/\n/)) {
            let username;

            for (let [index, cell] of row.split(/\t/).entries()) {
                if (index === 1) {
                    if ((/pull/).test(cell)) {
                        username = await getAuthorFromPull(parseURL(cell, pullParsedURL))
                    }
                    else if ((/commit/).test(cell)) {
                        username = await getAuthorFromCommit(parseURL(cell, commitParsedURL))
                    }
                    else {
                        username = cell.replace('https://github.com/', '').split('/')[0];
                    }
                }
            }
                 
            row += '\t' + username;
            dataset.push(row)
        }
            
        dataset = dataset.filter((r) => r).join(';\n');

        writeFile(dataset, DS_RAW);
    })  
}


// MAIN DATASET (REPO | USER)
const createTargetDS = (filename) => {
    fs.readFile(filename, 'utf8', async (err, data) => {
        if (err) {
            return console.log('fs reading error', err);
        }
        
        let dataset = [];
        for (let row of data.split(/\n/)) {
            let repos;
            let currentCell;

            for (let [index, cell] of row.split(/\t/).entries()) {
                currentCell = cell;
                if (index === 3) repos = await getUserRepos(cell);                    
            }

            repos && repos.forEach((r) => dataset.push(r + '\t' + currentCell));
            console.log('in dataset', dataset);
        }

        writeFile(dataset.join(';\n'), nameTargetDS);
    })  
}
/*  ==========
GH API HANDLE
========== */
const getGHRequest = (url) => {
    return axios
        .get(url, options)
        .catch((err) => console.log('axios request has failed!\n', err));
}

// Get author
const getAuthorFromCommit = async (parametrs) => {
    try {
        let url =`https://api.github.com/repos/${parametrs}`;

        const response = await getGHRequest(url);
        const data = response.data;
        let field = data?.author?.login ? data?.author?.login : data?.commit?.author?.name;

        return field;
    }
    catch (e) {console.log('getAuthorFromCommit is failed:\n')};
    
}

const getAuthorFromPull = async (parametrs) => {
    try {
        let url =`https://api.github.com/repos/${parametrs}`;

        const response = await getGHRequest(url);
        const data = response.data;

        return data.user.login;
    }
    catch (e) {console.log('getAuthorFromPull is failed:\n', e)};
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
        console.log('checkActualCommits faild', e);
    }   
}

const getUserRepos = async (username) => {
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
        console.log('getUserRepos faild', e);
    }
}

// createFullDS(DS_NO_USERS);
createTargetDS(DS);