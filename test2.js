import * as fs from "fs";
import * as path from "path";
import csv from "csvtojson";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIR_INPUT_FOLDER = path.join(__dirname, 'csv');
const DIR_INPUT_FILE = path.join(DIR_INPUT_FOLDER, "nodejs-hw1-ex1.csv");

const DIR_OUTPUT_FOLDER = path.join(__dirname, 'csvParse');
const DIR_OUTPUT_FILE = path.join(DIR_OUTPUT_FOLDER, 'test2.txt');

function readCsvSaveTxt (DIR_INPUT_FILE, DIR_OUTPUT_FILE, DIR_OUTPUT_FOLDER){
    if (!fs.existsSync(DIR_OUTPUT_FOLDER)) {
        fs.mkdirSync(DIR_OUTPUT_FOLDER);
        console.log('Folder was created!', DIR_OUTPUT_FOLDER);
    } else (
        console.log('Folder exist!!!', DIR_OUTPUT_FOLDER)
    )

    const readStream = fs.createReadStream(DIR_INPUT_FILE);
    const writeStream= fs.createWriteStream(DIR_OUTPUT_FILE);

    try {
        readStream.pipe(csv()).pipe(writeStream);
        console.log('File was converted!');
    } catch (e){
        console.log(e)
    }
}

readCsvSaveTxt (DIR_INPUT_FILE, DIR_OUTPUT_FILE, DIR_OUTPUT_FOLDER)
