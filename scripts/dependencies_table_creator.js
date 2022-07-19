import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

import { default as csv_parser } from 'csv-parser';
import { createObjectCsvWriter as csv_writer} from 'csv-writer';

import is_gh from './utils/is_gh.js';
import { sort_by_alphabet } from './utils/sort.js';

import Author from './lib/Author/Author.js';
import Dependancies from './lib/Dependancies.js';

dotenv.config();

const DS_RAW = path.join('datasets',  process.env.DS_RAW);
const DS_RESULT = path.join('datasets', process.env.DS_RESULT_DEPENDENCIES);

const raw_headers = ['date', 'type', 'product', 'link', 'comment'];;

const result_headers = [
    {id: 'author', title: 'Автор'},
    {id: 'friends', title: 'Подписки'},
    {id: 'organizations', title: 'Организации'},
];

const get_friends = async (author) => {
    const dep = new Dependancies(author);
    const friends_list = await dep.get_friends();
    
    return friends_list;
}

const get_orgs = async (author) => {
    const dep = new Dependancies(author);
    const orgs_list = await dep.get_orgs();
    
    return orgs_list;
}

const create_dependencies_table = async (data, table, authors) => {
    const link = data.link;

    if (is_gh(link)) {
        const author_info = new Author(link);
        const author = await author_info.get_author(); 
    
        if (author && author !== undefined && !authors.has(author)) {
            authors.add(author);
            
            const friends = await get_friends(author);
            const orgs = await get_orgs(author);
    
            const details = {
                author: author,
                organizations: orgs,
                friends: friends,
            };
            
            details && table.push(details);
        }
    }
};

const create_CSV = async (raw_path, result_path, result_headers, raw_headers) => {
    let table = [];
    const authors = new Set();
    const sort_param = 'author';

    const read_stream = fs.createReadStream(raw_path);
    const CSV_writer = csv_writer({
        path: result_path,
        header: result_headers,
    });

    new Promise((resolve, reject) => {
        const promises = [];
        
        read_stream
        .pipe(csv_parser({headers: raw_headers, separator: ',', escape: '"'}))
        .on('data', async (data) => {
            promises.push(create_dependencies_table(data, table, authors));
        })
        .on('error', (error) => {
            console.log('Read file error:', error.message);
            reject();
        })
        .on('end', async () => {
            await Promise.all(promises);
            resolve();

            sort_by_alphabet(table, sort_param);

            await CSV_writer.writeRecords(table);

            console.log('END ======================\n', table);
        })
    })
};

create_CSV(
    DS_RAW,
    DS_RESULT,
    result_headers,
    raw_headers
)