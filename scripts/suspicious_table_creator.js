import path from 'path';
import dotenv from 'dotenv';
import create_CSV from './lib/create_CSV.js';
import is_GH from './utils/is_GH.js';
import get_author from './lib/get_author.js';
import { get_PR_events, get_stars_and_lang_by_repo } from './lib/GH_API_requests.js';
import sort_by_alphabet from './utils/sort.js'

dotenv.config();

const DS_RAW = path.join('datasets', 'raw_test.csv');
const DS_RESULT = path.join('datasets', 'result_test.csv');
// const DS_RAW = path.join('datasets', process.env.DS_RAW);
// const DS_RESULT = path.join('datasets', process.env.DS_RESULT);
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

const get_details_by_author = async (data, author, date) => {
    let rows = [];

    /* LEVEL 4.1: get PR for parsing */
    const PR_events = await get_PR_events(author, date);
    
    if (!PR_events) return;
    
    /* LEVEL 4.2: get derails for talbe */
    for (let event of PR_events) {
        const stars_and_lang = await get_stars_and_lang_by_repo(event.repo.url);
                
        const row = {
            author: author,
            PR: event.payload.pull_request.html_url,
            created_at: event.payload.pull_request.created_at,
            merged_at: event.payload.pull_request.merged_at,
            stars: stars_and_lang.stars,
            lang: stars_and_lang.lang,
            type: data.type,
            link: data.link,
            comment: data.comment
        };

        rows.push(row);
    }

    /* LEVEL 4.3: set order */

    // Filter doubles with null merged_at field
    const rows_ordered = rows
    .filter((elem, index) => {
        let isNotDouble = true;
        
        rows.forEach((e, i) => {
            if (index !== i && elem.PR === e.PR)
                isNotDouble = elem.merged_at !== null
        });

        return isNotDouble;
    }) 
    
    sort_by_alphabet(rows_ordered, 'PR');

    return rows_ordered;
};

/* LEVEL 2: chunk */
const form_author_suspicious_table = async (data, table, authors) => {
    const linkname = data.link;

    /* LEVEL 3: get author */
    const author = is_GH(linkname) && await get_author(linkname); 

    if (author && !authors.has(author)) {
        authors.add(author);
        
        /* LEVEL 4: get details */
        const details = await get_details_by_author(data, author, DATE_FROM);

        details && table.push(...details);
    }
};

/* LEVEL 1 */
create_CSV(
    DS_RAW,
    DS_RESULT,
    result_headers,
    raw_headers,
    form_author_suspicious_table
);