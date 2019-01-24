const puppeteer = require('puppeteer');
let browser = null;
let page = null;
const user = require('./user').instagram;


const instagram = {
    initialize: async ()=>{
        browser = await puppeteer.launch({
            headless:false
        });
        page = await browser.newPage();
    },
    login: async ()=>{
        await page.goto('https://www.instagram.com');
        await page.waitFor('a[href="/accounts/login/?source=auth_switcher"]');
        await page.click('a[href="/accounts/login/?source=auth_switcher"]');
        await page.waitFor(500);
    
        await page.waitFor('input[name="username"]');
        await page.type('input[name="username"]',user.username);
        await page.type('input[name="password"]',user.password);
        await page.click('button[type="submit"]');
    },
    getFollowing: async ()=>{
        // await page.waitFor(500);
        await page.waitFor('div[role="presentation"] > div[role="dialog"] > div > div:nth-of-type(3) > button:nth-of-type(2)');
        await page.click('div[role="presentation"] > div[role="dialog"] > div > div:nth-of-type(3) > button:nth-of-type(2)');
        // await page.click('');
        // await page.waitFor('#react-root > section > nav > div._8MQSO.Cx7Bp > div > div > div.ctQZg > div > div:nth-child(3) > a');
        // await page.click('#react-root > section > nav > div._8MQSO.Cx7Bp > div > div > div.ctQZg > div > div:nth-child(3) > a');
        await page.waitFor(`a[href="/${user.username}/"]`);
        await page.click(`a[href="/${user.username}/"]`);
        await page.waitFor(`a[href="/${user.username}/following/"]`);
        await page.click(`a[href="/${user.username}/following/"]`);
        await page.waitFor('div[role="presentation"] > div[role="dialog"] > div:nth-of-type(2) > ul > div');

        let listNodes = await page.$$('div[role="presentation"] > div[role="dialog"] > div:nth-of-type(2) > ul > div > li');
        // console.log(listNodes);
        // debugger;
        let followingList = [];
        let count = 1;

        while(listNodes.length < 146){
            await page.evaluate(`document.querySelector('div[role="dialog"] > div:nth-of-type(2)').scrollTo(0,314*${count})`);
            await page.waitFor(500);
            listNodes = await page.$$('div[role="presentation"] > div[role="dialog"] > div:nth-of-type(2) > ul > div > li');
            count += 1;
        }
        for (let followingElement of listNodes){
            let followingUsername = await followingElement.$eval('a[class="FPmhX notranslate _0imsa "]', ele=>ele.innerText);
            //basically $eval will access children in all levels, how to just one level down like >
            //how to access li elements using pure js in evaluate method?

            // let followingUsername = await followingElement.$eval('div[class="uu6c_"] > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1)', element=>element.innerText); 
            let followingImage = await followingElement.$eval('img[class="_6q-tv"]', element=>element.getAttribute('src'));
            followingList.push({
                followingUsername,
                followingImage
            });
        }
        console.log(followingList);

    },
    getFollowers: async ()=>{
        await page.waitFor(1000);
        await page.goto(`https://www.instagram.com/${user.username}/followers/`);


    },
    getUnfollowed:null,
}

module.exports = instagram;