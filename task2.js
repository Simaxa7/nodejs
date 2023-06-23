import * as fs from "fs";
import * as path from "path";
import csv from "csvtojson";
import { pipeline } from "stream";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIR_INPUT_FOLDER = path.resolve(__dirname, 'csv');
const DIR_INPUT_FILE = path.resolve(DIR_INPUT_FOLDER,"nodejs-hw1-ex1.csv");

const DIR_OUTPUT_FOLDER = path.resolve(__dirname, 'csvParse');
const DIR_OUTPUT_FILE = path.resolve(DIR_OUTPUT_FOLDER, 'task2.txt');

const readStream = fs.createReadStream(DIR_INPUT_FILE);
const writeStream = fs.createWriteStream(DIR_OUTPUT_FILE);

const errorHandler = error =>
    error
        ? console.error('failed...', error)
        : console.log('File was converted!');

if (!fs.existsSync(DIR_OUTPUT_FOLDER)) {
    fs.mkdir(DIR_OUTPUT_FOLDER);
    console.log('Folder was created!', DIR_OUTPUT_FOLDER);
} else (
    console.log('Folder exist!!!', DIR_OUTPUT_FOLDER)
)

pipeline(
    readStream,
    csv(),
    writeStream,
    errorHandler
)
