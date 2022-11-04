import { program } from 'commander';
import fs from 'fs';
import cp from 'child_process';
import { Readable } from 'stream';

program
  .option('--script', 'Enable JavaScript', false)
  .option('-n, --number <number>', 'Times for repetition', '1')
  .argument('<file>', 'File to bench')
  .parse();

const enableScript = program.opts().script;
const benchCount = parseInt(program.opts().number);
const file = program.args[0];

(async () => {
  const total = [], load = [];
  const code = fs.readFileSync(file);
  for (let i = 0; i < benchCount; i++) {
    const readable = new Readable();
    readable.push(code);
    readable.push(null);
    const screenshot = cp.spawn('node', ['scripts/screenshot.js', enableScript && '--script', '--time', '-o /tmp/example.png']);
    readable.pipe(screenshot.stdin);
    for await (const data of screenshot.stdout) {
      const [t1, t2] = parseTimeLog(data.toString());
      if (t1 && t2) {
        total.push(t1);
        load.push(t2);
        const last = total.length - 1;
        console.log(`[Round ${last + 1}] Total: ${total[last]}, Load: ${load[last]}`)
      }
    }
  }
  const tSum = total.reduce((a, b) => a + b, 0);
  const lSum = load.reduce((a, b) => a + b, 0);
  console.log(`[Average] Total: ${(tSum / total.length).toFixed(0)}, Load: ${(lSum / load.length).toFixed(0)}`)
})();

/**
 * 解析 [%pid] Total Elapsed: %t1, Load Elapsed: %t2
 */
function parseTimeLog(line) {
  const pat = /^\[(\d+)\](?:.+?)(\d+)(?:.+?)(\d+)$/m;
  const match = pat.exec(line);
  if (match) {
    const [, , t1, t2] = match;
    return [parseInt(t1), parseInt(t2)];
  }
  return [0, 0]; 
}
