import fetch from 'node-fetch';
import xpath from 'xpath';
import { DOMParser } from 'xmldom';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import { sleep } from './utils.js';

(async () => {
  // eslint-disable-next-line no-underscore-dangle
  const __filename = fileURLToPath(import.meta.url);
  // eslint-disable-next-line no-underscore-dangle
  const __dirname = path.dirname(__filename);

  const app = express();
  const port = process.env.PORT || 8080;
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
  });

  app.listen(port);
  console.log(`Server started at http://localhost:${port}`);

  const response = await fetch('https://www.bazen-olomouc.cz/');
  const body = await response.text();
  // console.log(body);

  const doc = new DOMParser({ errorHandler: { warning: null } }).parseFromString(body);
  const nodes = xpath.select('//header[@class="header"]//ul/li[2]/strong', doc);

  console.log(`${nodes[0].localName}: ${nodes[0].firstChild.data}`);
  console.log(`Node: ${nodes[0].toString()}`);

  for (let i = 0; i < 20; i += 1) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Linux x86_64; rv:99.0) Gecko/20100101 Firefox/99.0');
    await page.goto(`http://localhost:${port}`);
    console.log('opened page', i);
    await sleep(1000);
  }
  // const page = await browser.newPage();
  // await page.setUserAgent('Mozilla/5.0 (Linux x86_64; rv:99.0) Gecko/20100101 Firefox/99.0');
  // await page.goto(`http://localhost:${port}`);
  // await page.screenshot({ path: 'example.png' });
  // await browser.close();
})();
