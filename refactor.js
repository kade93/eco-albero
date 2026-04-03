const fs = require('fs');
let code = fs.readFileSync('app.jsx', 'utf8');

// 1. Refactor PLOTS
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

// 2. Adjust Promo Text & Size
code = code.replace(/46필지 한정, 일부 필지 선택 진행 중/g, "46필지 한정, 일부 필지 선택 진행중");
// Increase mobile promo banner sizes
code = code.replace(/text-\[12px\] font-black/g, "text-[14px] md:text-[16px] font-black");
// Increase desktop overlay promo sizes
code = code.replace(/text-\[10px\] md:text-xs font-black/g, "text-xs md:text-sm font-black");

// 3. Update Hero Copy blocks tightly
code = code.replace(/<h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-\[54px\] text-slate-900 font-bold font-sans break-keep leading-\[1\.25\] relative z-20">\s*단 하나의 배치,\s*<\/h1>/g, '<div className="text-sm md:text-base lg:text-lg text-[#D4AF37] font-bold tracking-widest uppercase mb-2 md:mb-3 font-sans">ECO ALBERO PRIVATE ESTATE</div>');
code = code.replace(/<h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-\[54px\] text-\[#1A2F23\] font-bold font-sans break-keep leading-\[1\.25\] xl:mt-3 w-full xl:w-\[130%\] relative z-20 whitespace-normal sm:whitespace-nowrap">\s*당신의 위치를 선택하세요\s*<\/h1>/g, '<h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-[54px] text-slate-900 font-black font-sans break-keep leading-[1.3] w-full xl:w-[130%] relative z-20 whitespace-normal sm:whitespace-nowrap drop-shadow-sm">같은 하루, 다른 삶을 선택하다</h1>');
code = code.replace(/<strong className="text-slate-800 tracking-wide text-base">숲세권 프리미엄 타운하우스, 에코알베로<\/strong><br \/>\s*단지 곳곳에 펼쳐지는 놀라운 전망과 녹지 공간을 확인해보세요\. 원하시는 필지를 클릭하시면 실제 현장에 선 듯한 파노라마 뷰가 펼쳐집니다\./g, '<strong className="text-[#1A2F23] tracking-wide text-base md:text-lg">자연이 일상이 되고, 아이들은 마음껏 뛰어놀며 삶의 여유와 품격이 깊어지는 프리미엄 전원주택 단지, 에코알베로</strong><br /><span className="mt-2 inline-block">도심과 자연을 함께 누리는 균형 잡힌 입지 | 병원·생활 인프라까지 편리하게 연결되는 입지 | 청주시내 25분·세종 35분·대전 35분</span>');

fs.writeFileSync('app.jsx', code);
console.log('Refactor exact components completed successfully.');
