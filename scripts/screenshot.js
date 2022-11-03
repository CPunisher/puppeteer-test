import puppeteer from 'puppeteer';
import { program } from 'commander';

program
  .option('--script', 'Enable JavaScript', false)
  .option('--time', 'Output time info', false)
  .option('-o, --output <string>', 'Output path for image', 'output/example.png');
program.parse();

const options = program.opts();
const pid = process.pid;

(async () => {
  const html = (await streamToPromise(process.stdin)).toString();
  const outputFile = options.output;
  const enableScript = options.script;
  const enableTime = options.time;
  log("Enable Script: " + enableScript);

  const st1 = new Date();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const st2 = new Date();
  page.setJavaScriptEnabled(enableScript);
  await page.setContent(html, {
    waitUntil: ['domcontentloaded', 'networkidle0'],
  });
  const et2 = new Date();

  await page.screenshot({path: outputFile, fullPage: true});
  await browser.close();
  const et1 = new Date();

  log("Output file: " + outputFile);
  if (enableTime) {
    log(`Total Elasped: ${et1 - st1}, Load Elasped: ${et2 - st2}`);
  }
})();

function log(msg) {
  console.log(`[${pid}] ${msg}`);
} 

function streamToPromise(stream) {
  return new Promise((resolve, reject) => {
    let chunks = [];

    function onData(chunk) {
      chunks.push(chunk);
    };

    function onEnd() {
      unbind();
      resolve(Buffer.concat(chunks));
    };

    function onError(error) {
      unbind();
      reject(error);
    };

    function unbind() {
      stream.removeListener('data', onData);
      stream.removeListener('end', onEnd);
      stream.removeListener('error', onError);
    }

    stream.on('data', onData);
    stream.on('end', onEnd);
    stream.on('error', onError);
  });
}
