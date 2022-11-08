import fs from 'fs';
import { program } from 'commander';
import path from 'path';
import cp from 'child_process';

program
  .argument('<dir>', 'Directory of input files')
  .option('--script', 'Enable JavaScript', false)
program.parse();

const enableScript = program.opts().script;
const dir = program.args[0];

(async function() {
  const files = await fs.promises.readdir(dir);

  for (const file of files) {
    const filePath = path.resolve(dir, file);
    const saveFilePath = path.resolve('output', postfix(file, 'png'));
    console.log('Read: ' + filePath);

    const readable = fs.createReadStream(filePath);
    const screeenshot = cp.spawn('node', ['scripts/screenshot.js', enableScript && '--script', '--time', '-o', saveFilePath]);
    readable.pipe(screeenshot.stdin);
    screeenshot.stdout.pipe(process.stdout);
    screeenshot.stderr.pipe(process.stderr);
  }
})();

function postfix(origin, postfix) {
  const index = origin.lastIndexOf('.');
  if (index > -1) {
    origin = origin.substring(0, index);
  }
  return origin + '.' + postfix;
}
