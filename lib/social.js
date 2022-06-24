const path = require('path');
const { createCSV } = require('../lib/createCSV.js');
const { fetchSocial } = require('../handlers/fetchHandlers.js');

const DS_RAW = path.join('datasets',  process.env.DS_RAW_SOCIAL);
const DS_RESULT = path.join('datasets', process.env.DS_RESULT_SOCIAL);

const rawHeaders = [
    'Автор',
    'Потенциально опасный PR автора',
    'Дата создания',
    'Дата принятия',
    'Рейтинг репозитория',
    'Язык репозитория',
    'Тип исходного вредоносного вклада',
    'Исходный вредоносный вклад',
    'Комментарий к исходному вредоносному вкладу'
];

const resultHeaders = [
    {id: 'author', title: 'Автор'},
    {id: 'friends', title: 'Подписки'},
    {id: 'organizations', title: 'Организации'},
];

module.exports.createSocialList = async () => {
    await createCSV(
        DS_RAW, 
        DS_RESULT, 
        resultHeaders,
        rawHeaders,
        fetchSocial
    )
}