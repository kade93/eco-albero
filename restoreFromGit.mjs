import fs from 'fs';
import { execSync } from 'child_process';

const oldCode = execSync('git show 6f7ee3d:app.jsx', { encoding: 'utf8' });
const match = oldCode.match(/(const PLOTS = \[\s*[\s\S]*?\];)/);
if(match) {
    let targetBlock = match[1];
    // Wipe out the 'sold' statuses so that everything is 'available' except 'management'
    let replaced = targetBlock.replace(/status:\s*'sold'/g, "status: 'available'");
    
    let currentCode = fs.readFileSync('app.jsx', 'utf8');
    // Replace the current 1-46 numbered block with the recovered target block
    currentCode = currentCode.replace(/(const PLOTS = \[\s*[\s\S]*?\];)/, replaced);
    fs.writeFileSync('app.jsx', currentCode);
    console.log("SUCCESS: Reverted PLOTS array from commit 6f7ee3d.");
} else {
    console.error("Match failed on 6f7ee3d");
}
