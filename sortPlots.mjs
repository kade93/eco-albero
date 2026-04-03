import fs from 'fs';

let code = fs.readFileSync('app.jsx', 'utf8');

const plotsStrMatch = code.match(/const PLOTS = \[\s*([\s\S]*?)\s*\];/);
if (plotsStrMatch) {
    let plotsArrStr = plotsStrMatch[1];
    
    let objects = [];
    plotsArrStr.replace(/\{[^}]+\}/g, (match) => {
        let idMatch = match.match(/id:\s*'([\w-]+)'/);
        if(!idMatch) return match;
        
        objects.push({ 
            matchStr: match,
            originalId: idMatch[1]
        });
        return match;
    });

    objects.sort((a, b) => {
        // IDs are like '9-1' or '4-1'
        let [a1, a2] = a.originalId.split('-').map(Number);
        let [b1, b2] = b.originalId.split('-').map(Number);
        if (a1 !== b1) return a1 - b1;
        return a2 - b2;
    });

    let newPlots = objects.map((obj, i) => {
        let newMatchStr = obj.matchStr.replace(/id:\s*'[^']+'/, `id: '${i + 1}'`);
        return newMatchStr;
    }).join(',\n    ');

    let newPlotsBlock = `const PLOTS = [\n    ${newPlots}\n];`;
    code = code.replace(/const PLOTS = \[\s*[\s\S]*?\];/, newPlotsBlock);
    fs.writeFileSync('app.jsx', code);
    console.log("Array sorted and sequentially numbered 1-46.");
}
