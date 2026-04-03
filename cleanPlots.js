const fs = require('fs');
let code = fs.readFileSync('app.jsx', 'utf8');

let counter = 1;
code = code.replace(/const PLOTS = \[([\s\S]*?)\];/, (match, p1) => {
    let replaced = p1.replace(/\{([^}]+)\}/g, (objMatch) => {
        let newObj = objMatch;
        if (newObj.includes("status: 'management'")) {
             newObj = newObj.replace(/id:\s*'[^']+'/, "id: '관리사무동'");
        } else {
             newObj = newObj.replace(/id:\s*'[^']+'/, `id: '${counter++}'`);
             newObj = newObj.replace(/status:\s*'sold'/, "status: 'available'");
        }
        return newObj;
    });
    return `const PLOTS = [${replaced}];`;
});

fs.writeFileSync('app.jsx', code);
