require('dotenv').config();

const { createMainMalwareList } = require('./lib/main.js');
const { createSocialList } = require('./lib/social.js');

const flags = ['--main', '--social'];
const src = process.argv[process.argv.length - 1];

switch (src) {
    case flags[0]: 
        createMainMalwareList();
        break;
    case flags[1]:
        createSocialList();
        break;
    default:
        console.log('Choose a flag: --main or --social');
}