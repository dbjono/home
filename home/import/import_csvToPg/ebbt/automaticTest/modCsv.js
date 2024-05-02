const fs = require('fs');
const csv = require('csv-parser');
const { Transform } = require('stream');
const path = require('path');

const inputFile = 'C:/ST/Repos/data/ebbt-automaticTests.csv';
const outputFile = 'ebbt-automaticTests.csv';

const inputHeaders = ['Issue key', 'Issue id', 'Summary', 'Custom field (Complexity)', 'Component/s', 'Component/s', 'Component/s', 'Custom field (Test Coverage)'];
const outputHeaders = ['Issuekey', 'IssueId', 'Summary', 'Complexity', 'Component1', 'Component2', 'Component3', 'TestCoverage'];

// Function to transform CSV data
function transformCsvData(data) {
    const transformedData = {};
    inputHeaders.forEach((header, index) => {
        const newHeader = outputHeaders[index];
        transformedData[newHeader] = data[header];
    });
    return transformedData;
}

// Create a writable stream to write transformed data
const outputStream = fs.createWriteStream(outputFile);

// Create a transform stream to transform CSV data
const transformStream = new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
        const transformedData = transformCsvData(chunk);
        const stringData = JSON.stringify(transformedData); // Converti l'oggetto in stringa JSON
        this.push(stringData); // Push della stringa trasformata
        callback();
    }
});


// Pipe CSV data to transform stream
fs.createReadStream(inputFile)
    .pipe(csv())
    .pipe(transformStream)
    .pipe(outputStream)
    .on('finish', () => {
        console.log('Original File is: ' + inputFile)
        console.log('CSV data transformed and written to ' + outputFile);;
    });
