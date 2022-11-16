import { program } from "commander";
import pidusage from "pidusage";
import pidtree from "pidtree";
import puppeteer from "puppeteer";

program
  .argument('<string>', 'Target url')
  .option('--interval <number>', 'Monitor interval in ms', 1000)
  .option('--duration <number>', 'Monitor duration in ms', 3000)
  .parse();

const url = program.args[0];
const { interval, duration } = program.opts();
(async () => { 
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.goto(url);
  const monitor = setInterval(async () => {
    const pid = browser.process().pid;
    const pidList = [pid, ...await pidtree(pid)];
    const infoList = await Promise.all(pidList.map(ch => pidusage(ch)));
    const totalMemory = infoList.reduce((a, b) => a + b.memory, 0);
    console.log(pidList, (totalMemory / 1024 / 1024).toFixed(2) + "MB");
  }, interval);
  
  setTimeout(() => {
    clearTimeout(monitor);
    page.close();
    browser.close();
  }, duration);
})();
