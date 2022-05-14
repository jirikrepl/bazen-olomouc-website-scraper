import fetch from 'node-fetch';
import xpath from 'xpath';
import { DOMParser } from 'xmldom';

const response = await fetch('https://www.bazen-olomouc.cz/');
const body = await response.text();

// console.log(body);

const doc = new DOMParser({ errorHandler: { warning: null } }).parseFromString(body);
const nodes = xpath.select('//header[@class="header"]//ul/li[2]/strong', doc);

console.log(`${nodes[0].localName}: ${nodes[0].firstChild.data}`);
console.log(`Node: ${nodes[0].toString()}`);
