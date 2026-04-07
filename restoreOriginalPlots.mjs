import fs from 'fs';
import { execSync } from 'child_process';

const oldCode = execSync('git show HEAD:app.jsx', { encoding: 'utf8' });
const match = oldCode.match(/(const PLOTS = \[\s*[\s\S]*?\];)/);
if(match) {
    // Replace 'sold' with 'available' but leave 'management' alone
    let replaced = match[1].replace(/status:\s*'sold'/g, "status: 'available'");
    
    let currentCode = fs.readFileSync('app.jsx', 'utf8');
    currentCode = currentCode.replace(/(const PLOTS = \[\s*[\s\S]*?\];)/, replaced);
    fs.writeFileSync('app.jsx', currentCode);
    console.log("Restored Original Plots to 1-1~9-X, removed sold status, kept management.");
}
