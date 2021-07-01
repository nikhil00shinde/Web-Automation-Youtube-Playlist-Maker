const { resolve } = require("path");
const pup = require("puppeteer");
const readline = require("readline");
const chalk = require("chalk");


let page;
let browser;
let playList ;
let songName = [];
let email = "ridirin378@d4wan.com";
let pass = "123456AB";

getEmailPass()
.then(function()
{
    return takingInput();
})
.then(function ()
{
    fName();
})


async function fName()
{
    try
    {
    
    browser = await pup.launch({
            headless:false,
            slowMo:50,
            defaultViewport:null,
            args:["--start-maximized"],
        });


        let pagesArr = await browser.pages();

        page = pagesArr[0];
        
        // it will wait until it loads the full page
        // Now we are opening a youtube 
        await page.goto("https://www.youtube.com/");

        
        // clicking on sign in button
        await page.waitForSelector('[aria-label="Sign in"]');
        await Promise.all([
            page.waitForNavigation(),
            page.click('[aria-label="Sign in"]'),
        ]);
            

        // typing the mail id
        await page.waitForSelector('[type="email"]');
        await page.type('[type="email"]',email);

        //click on next button
        await page.waitForSelector(".qhFLie .VfPpkd-RLmnJb");
        await Promise.all([
            page.waitForNavigation(),
            page.click(".qhFLie .VfPpkd-RLmnJb")
        ])

        //type password
        await page.waitForSelector('[type="password"]',{visible:true});
        await new Promise(function (resolve,reject){setTimeout(async function()
        {
            await page.type('[type="password"]',pass);
            resolve();
        },1000)
    })
        

            //show password
            await page.waitForTimeout(1000);
            await page.waitForSelector('.VfPpkd-MPu53c.VfPpkd-MPu53c-OWXEXe-dgl2Hf.Ne8lhe.swXlm.az2ine.y5MMGc.sD2Hod.VfPpkd-MPu53c-OWXEXe-mWPk3d',{visible:true});
            await page.click(".VfPpkd-MPu53c.VfPpkd-MPu53c-OWXEXe-dgl2Hf.Ne8lhe.swXlm.az2ine.y5MMGc.sD2Hod.VfPpkd-MPu53c-OWXEXe-mWPk3d");


        // click on next button
        await page.waitForSelector(".VfPpkd-dgl2Hf-ppHlrf-sM5MNb .VfPpkd-RLmnJb",{visible:true});
        await Promise.all([
            page.waitForNavigation(),
            page.click(".VfPpkd-dgl2Hf-ppHlrf-sM5MNb .VfPpkd-RLmnJb")
        ])

        // typing the song name on the search 
        await page.waitForSelector(".style-scope.ytd-searchbox  #search-input.ytd-searchbox-spt",{visible:true});
        await page.click(".style-scope.ytd-searchbox  #search-input.ytd-searchbox-spt");
        let p = new Promise(function (resolve,reject)
        {
            setTimeout(async function()
            {
                await page.type(".style-scope ytd-searchbox  #search-input.ytd-searchbox-spt",songName[0]);
                resolve();
            },1000);
        })
        await p;
            
        
        // then click on the search box option
        await page.waitForTimeout(2000);
        await page.waitForSelector("#search-icon-legacy.style-scope.ytd-searchbox",{visible:true});
        await Promise.all([
            page.waitForNavigation(),
            page.click("#search-icon-legacy.style-scope.ytd-searchbox"),
        ])
            
            // clicking on the song 
            await page.waitForTimeout(2000);
        await page.waitForSelector(".style-scope.ytd-video-renderer .style-scope.ytd-video-renderer",{visible:true});
        await Promise.all([
            page.waitForNavigation(),
            page.click(".style-scope.ytd-video-renderer .style-scope.ytd-video-renderer"),
        ])

        //click on skip add
        let add = checkIfAddIsPresent(".ytp-ad-text.ytp-ad-skip-button-text");
        await add;

        //now we have to check the save option for
         await page.evaluate( function ()
        {
            let a = document.querySelectorAll('#button[aria-label="Save to playlist"] .style-scope.ytd-button-renderer');
            a[1].click();
        })
         
        //click on create playlist
         await page.waitForTimeout(1000);
         await page.evaluate(function ()
         {
            let a = document.querySelector("#content-icon.style-scope.ytd-compact-link-renderer");
            a.click();
         })
         
         await page.waitForTimeout(1000);
         await page.type('[slot="input"]',playList);
         await page.waitForTimeout(1000);
         await page.evaluate(function ()
         {
            let a = document.querySelectorAll(".style-scope.ytd-button-renderer.style-blue-text.size-default");
            a[0].click();
         })

        

    
        for(let i=1;i<songName.length;i++)
        {
            await handleSongAdded(i);
        }
         
        await  playThePlaylist();
        console.log("\n");
        console.log(chalk.blue.bgRed.bold("Playlist has been created!!!"))
    }
    catch(err)
    {
        console.log(err);
    }
}



function checkIfAddIsPresent(selector)
{
    return new Promise(async function (resolve,reject)
    {
        try{
            await page.waitForSelector(selector);

            setTimeout(async function ()
            {
                await page.click(selector);
                resolve();
            },6000);

        }
        catch(err)
        {
            resolve();
        }
    })
}
function handleSongAdded(i)
{
    return new Promise(async function (resolve,reject)
    {
        try{
           
            await page.waitForTimeout(2000);
            await page.waitForSelector(".style-scope.ytd-searchbox  #search-input.ytd-searchbox-spt",{visible:true});
            await page.click(".style-scope.ytd-searchbox  #search-input.ytd-searchbox-spt");


              //clear the old name written
              await page.waitForTimeout(2000);
            for(let j=0;j<(songName[i-1]).length;j++)
            {
                await page.keyboard.press("Backspace");
            }
            let p = new Promise(function (resolve,reject)
            {
                setTimeout(async function()
                {
                    await page.type(".style-scope ytd-searchbox  #search-input.ytd-searchbox-spt",songName[i]);
                    resolve();
                },1000);
            })
            await p;
            
            
            // click on search
            await page.waitForTimeout(1000);
            await page.waitForSelector("#search-icon-legacy.style-scope.ytd-searchbox",{visible:true});
            await Promise.all([
                page.waitForNavigation(),
                page.click("#search-icon-legacy.style-scope.ytd-searchbox"),
            ])
            
            // click on the song
            await page.waitForTimeout(2000);
            await page.waitForSelector(".style-scope.ytd-video-renderer .style-scope.ytd-video-renderer",{visible:true});
            await Promise.all([
                page.waitForNavigation(),
                page.click(".style-scope.ytd-video-renderer .style-scope.ytd-video-renderer"),
            ])

            //click on skip add
           let add = checkIfAddIsPresent(".ytp-ad-text.ytp-ad-skip-button-text");
           await add;

            //now we have to check the save option
            await page.waitForTimeout(1000);
            await page.evaluate(function ()
            {
                let a = document.querySelectorAll('#button[aria-label="Save to playlist"] .style-scope.ytd-button-renderer');
                a[1].click();
            })
         
         
            
        
            //click on the playlist that you want to save button
            await page.waitForTimeout(3000);
            await page.evaluate(function ()
            {
                let a = document.querySelectorAll("#checkboxContainer.style-scope.tp-yt-paper-checkbox");
                a[1].click();
            });
            
            // click on cross sign
            await page.waitForTimeout(1000);
            await page.waitForSelector('[aria-label="Cancel"].style-scope.yt-icon-button');
            await page.click('[aria-label="Cancel"].style-scope.yt-icon-button');
            await page.waitForTimeout(3000);
            resolve();
        }
        catch(err)
        {
              console.log(err);
        } 
        
    });
}
function playThePlaylist()
{
    return new Promise(async function (resolve,reject)
    {
        try
        {
            //have to reload the page
            await page.waitForTimeout(1000);
            await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });


             //click on the menu option
            await page.waitForTimeout(2000);
            await page.waitForSelector('.style-scope.yt-icon-button[aria-label="Guide"] #guide-icon');
            await page.click('.style-scope.yt-icon-button[aria-label="Guide"] #guide-icon');
            

            // click on new added playlist
            await page.waitForTimeout(3000);
            await page.evaluate(function ()
            {
                let a = document.querySelectorAll(".title.style-scope.ytd-guide-entry-renderer");
                a[6].click();
            })

            // click on sort
            await page.waitForTimeout(1000);
            await page.waitForSelector(".dropdown-trigger.style-scope.yt-dropdown-menu");
            await page.click(".dropdown-trigger.style-scope.yt-dropdown-menu");

            //click on sort to oldest
            await page.waitForTimeout(2000);
            await page.evaluate(function ()
            {
                let a = document.querySelectorAll(".yt-simple-endpoint.style-scope.yt-dropdown-menu .style-scope.yt-dropdown-menu");

                a[5].click();
            })

            //now click on the song 
            await page.waitForTimeout(1000);
            await page.waitForSelector("#content.style-scope.ytd-playlist-video-renderer");
            await page.click("#content.style-scope.ytd-playlist-video-renderer");
            resolve();
        }
        catch(err)
        {
                console.log(err);
        }   
    })
}
function takingInput()
{
    return new Promise(function (resolve,reject)
    {
          let rl = readline.createInterface({
              input : process.stdin,
              output : process.stdout,
              prompt : chalk.redBright("EnterSongName->>  ")
          })

          rl.question(chalk.yellowBright.bold("Enter the name of the playlist: "), function (answer)
          {
              playList = answer;
              console.log("\n");
              rl.prompt();
          })

          rl.on("line",function (input)
          {
              if(input == "close")
              {
                  rl.close();
                  resolve();
              }
              else{
                songName.push(input); 
                rl.prompt();
              }
              
          })

    })
}
function getEmailPass()
{
    return new Promise(function (resolve,reject)
    {
        let rl = readline.createInterface({
            input : process.stdin,
            output : process.stdout,
        })
    
        rl.question(chalk.magentaBright.bold("Enter your email: "),function(answer)
        {
            email = answer;
            rl.question(chalk.blueBright("Enter your Password: "),function(answer)
            {
                pass = answer;
                console.log("\n");
                rl.close();
                resolve();
            })
        })
    
      
    })
}