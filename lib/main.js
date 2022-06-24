const path = require('path');
const { createCSV } = require('../lib/createCSV.js');
const { fetchMain } = require('../handlers/fetchHandlers.js');

const DS_RAW = path.join('datasets', process.env.DS_RAW);
const DS_RESULT = path.join('datasets', process.env.DS_RESULT);

const rawHeaders = ['date', 'type', 'product', 'link', 'comment'];
const resultHeaders = [
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

module.exports.createMainMalwareList = async () => {
    await createCSV(
        DS_RAW,
        DS_RESULT,
        resultHeaders,
        rawHeaders,
        fetchMain
    )
}