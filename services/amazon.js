const puppeteer = require('puppeteer');
const { exec, execSync } = require("child_process");
const pageParams = { waitUntil: ["networkidle0", "domcontentloaded"] };
const viewPortParams = { width: 1800, height: 700 };
const allConfigs = require('../config.json');
const amazon = allConfigs.amazon;

module.exports.run = async function (username, password, contact, refresh, browserHidden) {
    const hidden = browserHidden === "hidden" ? true : false;
    const browserLaunchParams = { headless: hidden };
    const browser = await puppeteer.launch(browserLaunchParams);
    const page = await browser.newPage();
    await page.setViewport(viewPortParams);

    await page.goto(amazon.launch_url, pageParams);
    await page.waitFor(2000);
    await page.click("#a-autoid-0");
    await page.waitFor(2000);
    await page.focus('#ap_email');
    await page.type('#ap_email', username);
    await page.click("#continue");
    await page.waitFor(2000);
    await page.focus('#ap_password');
    await page.type('#ap_password', password);
    await page.click('#signInSubmit');
    await page.waitFor(2000);
    await page.click("#nav-cart");
    await page.waitFor(2000);
    await page.click(".a-button-primary");
    await page.waitFor(2000);
    await page.click('#a-autoid-0');
    await page.waitFor(2000);

    let notFound = true;
    const notAvailableTextToFind = "No doorstep delivery windows are available";
    const txtMessageToSend = "Delivery Window is available for Today!";
    const sendMsgCmd = "osascript -e 'tell application \"Messages\" to send \"" + txtMessageToSend + "\" to buddy \"" + contact + "\"'";
    
    while (notFound) {
        notFound = (await page.content()).includes(notAvailableTextToFind);
        if (!notFound) {
            console.log("Delivery windows are available");
            exec(sendMsgCmd);
        } else {
            execSync("sleep " + parseInt(refresh));          
            await page.reload(pageParams);
        } 
    }

    await browser.close();
};