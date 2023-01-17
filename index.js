const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/scrap', async (req, res) => {
    const url = req.headers.url;
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url);
  
    const fontFamilies = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      return [...new Set(elements.map((element) => {
        return window.getComputedStyle(element, null).getPropertyValue('font-family');
      }))];
    });
  
    var jsonString = JSON.stringify(fontFamilies);
    var cleanString = jsonString.replace(/[\\"]/g, "");
    cleanString = cleanString.replace('[', "");
    cleanString = cleanString.replace(']', "");
    var cleanArray = cleanString.split(',');
    var cleanJson = cleanArray.map(font => {
        return {
            name: font
        }
    });
    console.log(cleanJson)
    res.send(cleanJson);
    await browser.close();
  });

app.listen(3000, () => {
  console.log('Scraper API listening on port 3000!');
});
