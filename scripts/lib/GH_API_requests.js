import axios from 'axios';
// TODO: replace dotenv lib
import dotenv from 'dotenv';

dotenv.config();

const PAT = process.env.PAT;

let options = {
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Token " + PAT,
        'user-agent': 'node.js'
    }
};

const get_GH_response = (url) => {
    return axios
        .get(url, options)
        .catch((e) => console.log('axios request has failed:\n', e.message));
};

/* GETTING AUTHOR */

export const get_author_from_commit = async (parametrs) => {
    try {
        let url =`https://api.github.com/repos/${parametrs}`;

        const response = await get_GH_response(url);
        const data = response.data;
        let author = data?.author?.login ? data?.author?.login : data?.commit?.author?.name;

        return author;
    }
    
    catch (e) {console.log('get_author_from_commit is failed:\n', e.message)};
};

export const get_author_from_pull = async (parametrs) => {
    try {
        let url =`https://api.github.com/repos/${parametrs}`;

        const response = await get_GH_response(url);
        const data = response.data;
        
        return data.user.login;
    }
    
    catch (e) {console.log('get_author_from_pull is failed:\n', e.message)};
};

export const get_author_from_pull_commit = async (parametrs, commitSHA) => {
    try {
        let url =`https://api.github.com/repos/${parametrs}`;
        
        const response = await get_GH_response(url);
        const data = response.data;

        const commit = data.filter((commit) => commit.sha === commitSHA)[0];

        return commit.author.login;
    }
    
    catch (e) {console.log('get_author_from_pull_commit is failed:\n', e.message)};
};

/* GETTING INFORMATION */

export const get_PR_events = async (username, date_from) => {
    try {
        let url = `https://api.github.com/users/${username}/events`;
        
        const response = await get_GH_response(url);
        const data = response.data;

        const PR_events = data.filter((event) => event.type === 'PullRequestEvent' && new Date(event.created_at) > date_from);

        return PR_events;
    }
    catch (e) {
        console.log('get_PR_events faild:\n', e.message);
    }
};

export const get_stars_and_lang_by_repo = async (url) => {
    try {
        const response = await get_GH_response(url);
        const data = response.data;

        return {
            stars: data.stargazers_count,
            lang: data.language
        };
    }
    catch (e) {
        console.log('get_stars_lang_from_repo is faild:\n', e.message);
    }
};

export const get_organsiations = async (username) => {
    try {
        let url =`https://api.github.com/users/${username}/orgs`;

        const response = await get_GH_response(url);
        const data = response.data;

        const orgs = data.map((org) => org.login)

        return orgs;
    }
    
    catch (e) {console.log('get_organsiations is failed:\n', e.message)};
}

export const get_followers = async (username) => {
    try {
        let url =`https://api.github.com/users/${username}/followers`;

        const response = await get_GH_response(url);
        const data = response.data;

        const orgs = data.map((org) => org.login)

        return orgs;
    }
    
    catch (e) {console.log('get_followers is failed:\n', e.message)};
}