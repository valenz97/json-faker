const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();

const port = 8099;
const mainDirPath = path.join(__dirname, 'mocks');

fs.watch('./mocks', (eventType, filename) => {
  console.log(`${eventType}: ${filename}`);
  exposeFile(mainDirPath);
})

const exposeFile = (currentDirPath) => {
  fs.readdir(currentDirPath, (err, files) => {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
    
    const jsonList = files.filter(f => f.endsWith(".json"));
    
    jsonList.forEach((json) => {
      app.get('/' + json.split('.')[0], (req, res) => {
        console.log(`Serving path ${currentDirPath}/${json}`);
        res.sendFile(json, {root: currentDirPath});
      });
    });
    
    const dirList = files.filter(f => !f.endsWith(".json"));
    
    dirList.forEach((dirName) => {
      if (dirName === '.DS_Store') { // create a list of folders to ignore
        return console.debug(`Folder with name ${dirName} ignored`);
      }
      
      const dirFullPath = path.join(currentDirPath, dirName);
      
      fs.stat(dirFullPath, (err, stats) => {
        if (err) {
          return console.error('Error getting file stats:', err);
        }
        
        if (stats.isDirectory()) {
          exposeFile(dirFullPath); // Recursive call for subdirectories
        }
      });
    });
  });
}


app.get('/', (req, res) => {
  res.sendFile('index.html', {root: __dirname});
});

/*app.get('/example', (req, res) => {
  // maybe should add mocks/ dir
  res.sendFile('example.json', {root: __dirname});
});*/

app.listen(port, () => {
  console.log(`Now listening on http://localhost:${port}`);
  exposeFile(mainDirPath);
});


