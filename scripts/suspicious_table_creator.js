import path from 'path';
import dotenv from 'dotenv';
import create_CSV from './lib/create_CSV.js';
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
    // TODO: replace linkname to link
    const link = data.link;

    const author_info = new Author(link);
    const author = is_gh(link) && await author_info.get_author(); 

    if (author && author !== undefined && !authors.has(author)) {
        authors.add(author);

        const suspicious_info = new Suspicious(data, author, DATE_FROM);
        const details = await suspicious_info.get_details();

        details && table.push(...details);
    }
};

create_CSV(
    DS_RAW,
    DS_RESULT,
    result_headers,
    raw_headers,
    create_suspicious_table
);