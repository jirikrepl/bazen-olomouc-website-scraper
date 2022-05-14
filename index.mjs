import fetch from 'node-fetch';
import xpath from 'xpath';
import { DOMParser } from 'xmldom';
import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(port);
console.log('Server started at http://localhost:' + port);

const response = await fetch('https://www.bazen-olomouc.cz/');
const body = await response.text();
// console.log(body);

const doc = new DOMParser({ errorHandler: { warning: null } }).parseFromString(body);
const nodes = xpath.select('//header[@class="header"]//ul/li[2]/strong', doc);

console.log(`${nodes[0].localName}: ${nodes[0].firstChild.data}`);
console.log(`Node: ${nodes[0].toString()}`);
