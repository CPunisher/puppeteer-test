import fs from "fs";
import { program } from "commander";

program.argument('<json>').argument('<key>').parse();

const [json, key] = program.args;
const rawData = fs.readFileSync(json);
const jsonData = JSON.parse(rawData);
console.log(jsonData[key]);
