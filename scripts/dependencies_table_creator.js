import path from 'path';
import dotenv from 'dotenv';
import create_CSV from './lib/create_CSV.js';
import is_gh from './utils/is_gh.js';
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

const create_dependencies_table = async (data, table, authors) => {
    const link = data.link;
    const author_info = new Author(link);
    const author = is_gh(link) && await author_info.get_author(); 

    if (author && author !== undefined && !authors.has(author)) {
        authors.add(author);
        
        const dependancies_info = new Dependancies(author);
        const details = await dependancies_info.get_details();
        
        details && table.push(details);
    }
};

create_CSV(
    DS_RAW, 
    DS_RESULT, 
    result_headers,
    raw_headers,
    create_dependencies_table
)