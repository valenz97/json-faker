const path = require('path');
const fs = require('fs').promises;
const express = require('express');
const app = express();

const port = 8099;
const mocksDirectory = path.join(__dirname, 'mocks');

const findJsonFiles = async (directory, currentPath = '') => {
  const entries = await fs.readdir(directory, {withFileTypes: true});
  
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      // if it's a directory, call recursively the function
      return findJsonFiles(fullPath, path.join(currentPath, entry.name));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      return path.join(currentPath, entry.name);
    } else {
      console.error(`Path '${path.join(currentPath, entry.name)}' it's not valid`);
      return null;
    }
  }));
  
  return files.flat().filter(Boolean);
}

// Serve JSON files dynamically
const exposeFile = async () => {
  const jsonFiles = await findJsonFiles(mocksDirectory);
  
  jsonFiles.forEach((jsonPath) => {
    const urlPath = '/' + jsonPath.replace(/\.json$/, '');
    console.log(`Serving path '${path.resolve(__dirname, urlPath)}'`);
    app.use(urlPath, express.static(path.join(mocksDirectory, jsonPath)));
  });
}

// Start the server
exposeFile().then(() => {
  app.listen(port, () => {
    console.log(`Now listening on http://localhost:${port}`);
  });
  
  // serve the entry page
  app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname});
  });
});

