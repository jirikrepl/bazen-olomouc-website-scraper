import fetch from 'node-fetch';

const response = await fetch('https://www.bazen-olomouc.cz/');
const body = await response.text();

console.log(body);
