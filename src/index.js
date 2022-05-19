/* eslint-disable no-await-in-loop */
import fetch from 'node-fetch';
import xpath from 'xpath';
import { DOMParser } from 'xmldom';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import { sleep } from './utils.js';

/**
 * fetch swimming pool website html and get number of swimmers with xpath query
 */
async function getVisitorsCount() {
  const response = await fetch('https://www.bazen-olomouc.cz/');
  const body = await response.text();
  // console.log(body);

  const doc = new DOMParser({ errorHandler: { warning: null } }).parseFromString(body);
  const nodes = xpath.select('//header[@class="header"]//ul/li[2]/strong', doc);

  // console.log(`${nodes[0].localName}: ${nodes[0].firstChild.data}`);
  // console.log(`Node: ${nodes[0].toString()}`);
  return nodes[0].firstChild.data;
}

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

  const browsers = [];
  let lastVisitorsCount = 0;

  setInterval(async () => {
    const visitorsCount = await getVisitorsCount();
    console.log(`visitorsCount at ${new Date().getHours()}:${new Date().getMinutes()} is *${visitorsCount}*`);

    const delta = visitorsCount - lastVisitorsCount;
    lastVisitorsCount = visitorsCount;
    console.log(`delta is: ${delta}`);

    // open browsers for new visitors
    if (delta > 0) {
      for (let i = 0; i < delta; i += 1) {
        console.log('open new browser:', i + 1);

        const browser = await puppeteer.launch({
          executablePath: '/usr/bin/google-chrome',
          args: [
            // Required for Docker version of Puppeteer
            '--no-sandbox',
            '--disable-setuid-sandbox',
            // This will write shared memory files into /tmp instead of /dev/shm,
            // because Docker’s default for /dev/shm is 64MB
            '--disable-dev-shm-usage',
          ],
        });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Linux x86_64; rv:99.0) Gecko/20100101 Firefox/99.0');
        await page.goto(`http://localhost:${port}`);
        browsers.push({ browser, page });
        await sleep(250); // try to avoid possible GA rate limiter
      }
    }
    // close browsers of left visitors
    if (delta < 0) {
      for (let i = 0; i < Math.abs(delta); i += 1) {
        console.log('closed browser:', i + 1);
        const { browser } = browsers.pop();
        await browser.close();
      }
    }
    // refresh all browsers
    console.log('--- refreshing browsers ---');
    for (const { page } of browsers) {
      page.reload();
      await sleep(250); // try to avoid possible GA rate limiter
    }
  }, 1000 * 180); // every 2.5 minutes
})();
