import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({acceptDownloads:true});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://127.0.0.1:8765/',{waitUntil:'load'});
 assert.equal(await page.locator('#export').isDisabled(),true);
 const bytes=await page.evaluate(async()=>{
  const {PDFDocument}=await import('https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm');
  const doc=await PDFDocument.create();doc.addPage([300,400]);return [...await doc.save()];
 });
 await page.locator('#files').setInputFiles([{name:'test.pdf',mimeType:'application/pdf',buffer:Buffer.from(bytes)}]);
 await page.waitForFunction(()=>document.querySelector('#count')?.textContent==='1');
 assert.equal(await page.locator('#export').isDisabled(),false);
 await page.locator('#duplicate').click();
 assert.equal(await page.locator('#count').innerText(),'2');
 await page.locator('#rotateRight').click();
 await page.locator('#text').fill('QA note');
 await page.locator('#addText').click();
 await page.getByText('QA note',{exact:true}).waitFor();
 const [download]=await Promise.all([page.waitForEvent('download',{timeout:20000}),page.locator('#export').click()]);
 const pdf=await readFile(await download.path());
 assert.equal(pdf.subarray(0,5).toString('ascii'),'%PDF-');
 assert.ok(pdf.byteLength>200,'exported PDF should be nonempty');
 assert.deepEqual(errors.filter(x=>!/RenderingCancelledException/.test(x)),[],'unexpected browser errors');
 console.log('PASS: PDF import, duplication, rotation, annotations and PDF export');
}finally{await browser.close()}
