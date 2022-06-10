const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
require('dotenv').config();

const username = process.env.username;
const password = process.env.password;

(async() => {
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({ headless: false });
    const page = (await browser.pages())[0];
    await page.goto("https://gotyping.fun/login")
    await page.type('[type="email"]', username)
    await page.type('[type="password"]', password) 
    await page.click('[type="submit"]');
    await page.waitForNavigation({ waituntil: 'load' });
    console.log("You've successfully logged in!");
    await page.waitForTimeout(5000);
    // Go to /play section
    await page.goto("https://gotyping.fun/play");
    await page.waitForNavigation({ waituntil: 'networkidle0' }); // Wait until there are no more network requests
    // Click the play button, but first we wait
    await page.waitForSelector('.start-game.p-3', { visible: true }).then(() => {
        page.click('.start-game.p-3');
    })
    await page.waitForTimeout(3500); // Wait for 3.5 seconds
    /*
    let answers = await page.$$('#challenge#challenge'); // Get the parent div
    for (let i = 0; i < answers.length; i++) {
        let wordToType = await answers[i].$eval('span', i => i.getAttribute('innerText'))
        console.log("Typed the word: " + wordToType);
        await page.type('#answer#answer', wordToType, { delay: 50 });
    }
    */
})();
