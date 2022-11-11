const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();

const port = 8099;
const directoryPath = path.join(__dirname, 'mocks');


fs.watch('./mocks', (eventType, filename) => {
    console.log(`${eventType}: ${filename}`);
})


const exponeFiles = function () {
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        files.forEach(function (file) {
            console.log(file);
            app.get('/' + file.split('.')[0], (req, res) => {
                res.sendFile('mocks/' + file, {root: __dirname});
            });
        });
    });
}

exponeFiles();

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname});
});

app.get('/example', (req, res) => {
    res.sendFile('example.json', {root: __dirname});
});

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});


