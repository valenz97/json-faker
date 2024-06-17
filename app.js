const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();

const port = 8099;
const mocksDirectory = path.join(__dirname, 'mocks');

const pathList = [];

const findJsonFiles = async (directory, currentPath = '') => {
  const entries = await fs.promises.readdir(directory, {withFileTypes: true});
  
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      // if it's a directory, call recursively the function
      const subdirectoryFiles = await findJsonFiles(fullPath, path.join(currentPath, entry.name));
      return {files: subdirectoryFiles, directory: fullPath};
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      return {file: path.join(currentPath, entry.name)};
    } else {
      console.error(`Path '${path.join(currentPath, entry.name)}' it's not valid`);
      return null;
    }
  }));
  
  return files.flat().filter(Boolean).reduce((acc, val) => {
    if (val.directory) {
      acc.directories.push(val.directory);
      acc.files.push(...val.files.files);
    } else if (val.file) {
      acc.files.push(val.file);
    }
    return acc;
  }, {files: [], directories: []});
}

// Serve JSON files dynamically
const exposeFile = async () => {
  const {files} = await findJsonFiles(mocksDirectory);
  
  files.forEach((jsonPath) => {
    const urlPath = '/' + jsonPath.replace(/\.json$/, '');
    if (!pathList.includes(urlPath)) {
      pathList.push(urlPath);
      console.log(`Serving path '${path.resolve(__dirname, urlPath)}'`);
      app.use(urlPath, express.static(path.join(mocksDirectory, jsonPath)));
    }
  });
}

// Watch directories for changes
const watchDirectories = (directories) => {
  directories.forEach(directory => {
    fs.watch(directory, (eventType, filename) => {
      console.log(`${eventType}: ${filename} in ${directory}`);
      exposeFile().then(() => {
        // Serve the entry page
        app.get('/', (req, res) => {
          res.render('index.pug', {pathList: pathList});
        });
      });
    });
  });
}

// Start the server
exposeFile().then(async () => {
  const {directories} = await findJsonFiles(mocksDirectory);
  watchDirectories([mocksDirectory, ...directories]);
  
  app.listen(port, () => {
    console.log(`Now listening on http://localhost:${port}`);
  });
  
  // Serve the entry page
  app.get('/', (req, res) => {
    res.render('index.pug', {pathList: pathList});
  });
});
