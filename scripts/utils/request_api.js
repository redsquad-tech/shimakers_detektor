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

const request_api = (url) => {
    return axios
        .get(url, options)
        .catch((e) => console.log(`axios request has failed:\n${e.message}`));
};

export default request_api;