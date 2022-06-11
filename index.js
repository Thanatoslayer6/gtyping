const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
require('dotenv').config();

const username = process.env.username;
const password = process.env.password;

(async() => {
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({ headless: process.env.headless || false });
    const page = (await browser.pages())[0];
    // LOGIN
    await page.goto("https://gotyping.fun/login")
    await page.type('[type="email"]', username)
    await page.type('[type="password"]', password) 
    await page.click('[type="submit"]');
    await page.waitForNavigation({ waituntil: 'networkidle0' });
    console.log("You've successfully logged in!");
    // END LOGIN
    // GET NUMBER OF TICKETS
    const TicketsHandleDashboard = await page.$('.play-now-btn')
    const numOfTickets_dashboard = await TicketsHandleDashboard.evaluate(el => el.textContent);
    console.log("You have " + numOfTickets_dashboard + " tickets");
    await page.waitForTimeout(2000);
    // END NUMBER OF TICKETS
    for (let k = 0; k < parseInt(numOfTickets_dashboard); k++) {
        // Go to /play section
        if (k == 0) {
            await page.goto("https://gotyping.fun/play");
        } else {
            await page.reload();
        }

        await page.waitForTimeout(2500); // Wait for 2.5 seconds
        let TimerHandle = await page.$('.game-timer > h2')
        let WpmHandle = await page.$('.user-wpm > h2')
        let NumOfTicketsHandle = await page.$('.d-flex > a') 
        // Click the play button, but first we wait
        await page.waitForSelector('.control-btn .start-game').then(() => {
            console.log("~~~[ Clicking button now! Please wait until the game is over! ]~~~");
            page.click('.control-btn .start-game');
        })
        await page.waitForTimeout(3500); // Wait for 3.5 seconds
        let answers = await page.$$('#challenge span')
        for (let i = 0; i < answers.length; i++) {
            let wordToType = await answers[i].evaluate(el => el.textContent);
            // console.log(wordToType);
            await page.type('#answer', wordToType);
            // Check if time is up
            if (await TimerHandle.evaluate(el => el.textContent) == 0) { 
                console.log("================================================")
                console.log("GAME OVER: " + await WpmHandle.evaluate(el => el.textContent) + " points");
                console.log("YOU HAVE: " + (parseInt(await NumOfTicketsHandle.evaluate(el => el.textContent)) - 1) + " tickets left");
                console.log("================================================")
                await page.waitForTimeout(3500); // Wait for atleast 3.5s to save score
                break;
            }
        }
    }
    console.log("Au Revoir :)");
    await browser.close();
})();
