import fs from 'fs';
import { execSync } from 'child_process';

const oldCode = execSync('git show HEAD:app.jsx', { encoding: 'utf8' });
const match = oldCode.match(/(const PLOTS = \[\s*[\s\S]*?\];)/);
if(match) {
    let replaced = match[1].replace(/status:\s*'(sold|management)'/g, "status: 'available'");
    let currentCode = fs.readFileSync('app.jsx', 'utf8');
    currentCode = currentCode.replace(/(const PLOTS = \[\s*[\s\S]*?\];)/, replaced);
    fs.writeFileSync('app.jsx', currentCode);
    console.log("Restored Original Plots with Available status");
}
