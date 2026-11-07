const {chromium,devices}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  for(const viewport of [{width:360,height:640},{width:640,height:360},{width:412,height:839}])for(const activation of ['tap','contact'])for(const cached of [false,true])for(const count of [2,4,6]){
   const page=await browser.newPage({...devices['Pixel 7'],viewport});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   let html=fs.readFileSync(__dirname+'/index.html','utf8').replace(/<script[\s\S]*?<\/script>/g,'').replace(/<link[^>]*>/g,'');
   if(cached)html=html.replace(/<button id="resizePlayer"[\s\S]*?<\/button>/,'');
   await page.setContent(html);
   await page.addStyleTag({content:fs.readFileSync(__dirname+'/styles.css','utf8')});
   await page.addScriptTag({content:fs.readFileSync(__dirname+'/app.js','utf8')});
   assert(await page.evaluate(()=>window.__hitsterReady));
   await page.locator('[data-count="'+count+'"]').tap();
   await page.locator('#nameFields input').first().fill('Android');
   // Reproduce a contact for which Android never sends click/touchend.
   if(activation==='tap')await page.locator('#startGame').tap();
   else await page.locator('#startGame').dispatchEvent('pointerdown',{pointerId:1,pointerType:'touch',button:0,bubbles:true,cancelable:true});
   assert(await page.locator('#setup').isHidden());
   assert.equal(await page.locator('#game').evaluate(el=>el.getBoundingClientRect().top),0);
   assert.equal(await page.locator('.player-zone:visible').count(),count);
   assert.equal(await page.locator('.p1').innerText(),'Android');
   assert.deepEqual(errors,[]);
   await page.close();
  }
  console.log('PASS Android tap and contact without click: 2/4/6 players, name entry then Start, current and cached page without resize control.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
