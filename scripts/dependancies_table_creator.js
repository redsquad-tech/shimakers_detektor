import path from 'path';
import dotenv from 'dotenv';
import create_CSV from './lib/create_CSV.js';
import is_GH from './utils/is_GH.js';
import get_author from './lib/get_author.js';
import { get_organsiations, get_followers } from './lib/GH_API_requests.js';

dotenv.config();

const DS_RAW = path.join('datasets', 'raw_test.csv');
const DS_RESULT = path.join('datasets', 'result_social_test.csv');
// const DS_RAW = path.join('datasets',  process.env.DS_RAW_SOCIAL);
// const DS_RESULT = path.join('datasets', process.env.DS_RESULT_SOCIAL);

const raw_headers = ['date', 'type', 'product', 'link', 'comment'];;

const result_headers = [
    {id: 'author', title: 'Автор'},
    {id: 'friends', title: 'Подписки'},
    {id: 'organizations', title: 'Организации'},
];

/* LEVEL 2: form table */
const form_author_dependancies_table = async (data, table, authors) => {
    const linkname = data.link;

    /* LEVEL 3: get author */
    const author = is_GH(linkname) && await get_author(linkname); 

    if (author && !authors.has(author)) {
        authors.add(author);
        
        /* LEVEL 4: get details */
        const orgs = await get_organsiations(author);
        const followers = await get_followers(author);

        const dependancies = orgs?.length > 0 && {
            author: author,
            organizations: orgs,
            friends: followers,
        };

        dependancies && table.push(dependancies);
    }
};

/* LEVEL 1 */
create_CSV(
    DS_RAW, 
    DS_RESULT, 
    result_headers,
    raw_headers,
    form_author_dependancies_table
)