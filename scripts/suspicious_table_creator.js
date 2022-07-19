import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

import { default as csv_parser } from 'csv-parser';
import { createObjectCsvWriter as csv_writer} from 'csv-writer';

import { sort_by_alphabet } from './utils/sort.js';
import is_gh from './utils/is_gh.js';
import Author from './lib/Author/Author.js';
import Suspicious from './lib/Suspicious.js';


dotenv.config();

const DS_RAW = path.join('datasets', process.env.DS_RAW);
const DS_RESULT = path.join('datasets', process.env.DS_RESULT);
const DATE_FROM = new Date(process.env.DATE_FROM);

const raw_headers = ['date', 'type', 'product', 'link', 'comment'];
const result_headers = [
    {id: 'author', title: 'Автор'},
    {id: 'PR', title: 'Потенциально опасный PR автора'},
    {id: 'created_at', title: 'Дата создания'},
    {id: 'merged_at', title: 'Дата принятия'},
    {id: 'stars', title: 'Рейтинг репозитория'},
    {id: 'lang', title: 'Язык репозитория'},
    {id: 'type', title: 'Тип исходного вредоносного вклада'},
    {id: 'link', title: 'Исходный вредоносный вклад'},
    {id: 'comment', title: 'Комментарий к исходному вредоносному вкладу'},
];

const create_suspicious_table = async (data, table, authors) => {
    const link = data.link;

    if (is_gh(link)) {
        const author_info = new Author(link);
        const author = await author_info.get_author(); 
    
        if (author && author !== undefined && !authors.has(author)) {
            authors.add(author);
    
            const suspicious_info = new Suspicious(data, author, DATE_FROM);
            const details = await suspicious_info.get_details();
    
            details && table.push(...details);
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
            promises.push(create_suspicious_table(data, table, authors));
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
);