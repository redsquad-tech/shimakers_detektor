import fs from 'fs';
import { default as csv_parser } from 'csv-parser';
import { createObjectCsvWriter as csv_writer} from 'csv-writer';
import { sort_by_alphabet } from '../utils/sort.js';

const create_CSV = async (raw_path, result_path, result_headers, raw_headers, async_table_creator) => {
    // TODO: get rid of global variables table and authors (?)

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
            promises.push(async_table_creator(data, table, authors));
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
}

export default create_CSV;