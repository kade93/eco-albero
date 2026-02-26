import React, { useState, useEffect, useRef } from 'react';

// --- Icons (Inline SVGs for reliability in preview) ---
const IconX = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>;
const IconCamera360 = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>;
const IconPhone = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.88 12.88 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
</svg>;
const IconMapPin = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
</svg>;
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
</svg>;
const IconClock = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
</svg>;

const getAssetPath = (path) => {
    const base = import.meta.env.BASE_URL;
    // Ensure base ends with / and path doesn't start with /
    const normalizedBase = base.endsWith('/') ? base : `${base}/`;
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    return `${normalizedBase}${normalizedPath}`;
};

const PHASES = {
    '1': { color: '#9d67cc', label: '1차' },
    '2': { color: '#ff9d48', label: '2차' },
    '3': { color: '#2ecc71', label: '3차' },
    '4': { color: '#3498db', label: '4차' },
    '5': { color: '#ff6b81', label: '5차' },
    '6': { color: '#1abc9c', label: '6차' },
    '7': { color: '#a0522d', label: '7차' },
    '8': { color: '#b2ed6b', label: '8차' },
    '9': { color: '#e74c3c', label: '9차' },
};

// --- Plot Data (Extracted from 2112x2016 source) ---
const PLOTS = [
    { id: '9-1', x: 65.41, y: 65.43, phase: '9', path: 'M1368 1353.5L1334 1287L1395 1252.5L1442 1348.5L1368 1353.5Z' },
    { id: '9-2', x: 69.54, y: 63.96, phase: '9', path: 'M1469 1340L1415 1243L1469 1210.5L1521.5 1314L1469 1340Z' },
    { id: '9-3', x: 73.43, y: 61.64, phase: '9', path: 'M1545.5 1302.5L1494.5 1200.5L1563.5 1164.5L1605 1243L1545.5 1302.5Z' },
    { id: '9-4', x: 77.72, y: 58.83, phase: '9', path: 'M1631.5 1233L1588 1152.5L1656.5 1116.5L1700 1195L1631.5 1233Z' },
    { id: '9-5', x: 81.76, y: 56.35, phase: '9', path: 'M1719.5 1178L1677.5 1105L1749.5 1061.5L1767.5 1158L1719.5 1178Z' },
    { id: '8-1', x: 62.04, y: 44.54, phase: '8', path: 'M1310.5 948L1259 851L1310.5 824.5L1360.5 918.5L1310.5 948Z' },
    { id: '8-2', x: 65.67, y: 42.47, phase: '8', path: 'M1384 907.5L1331.5 812.5L1394.5 778.5L1440.5 874.5L1384 907.5Z' },
    { id: '8-3', x: 69.47, y: 40.4, phase: '8', path: 'M1464 865L1413 771L1475 738L1520.5 833L1464 865Z' },
    { id: '8-4', x: 73.06, y: 38.44, phase: '8', path: 'M1541 824.5L1496 728.5L1541 702.5L1596.5 794.5L1541 824.5Z' },
    { id: '7-1', x: 49.05, y: 50.44, phase: '7', path: 'M1011 995L1021 979L1081.5 946L1136 1040L1006 1105L985.5 1058L1011 995Z' },
    { id: '7-2', x: 54.85, y: 48.53, phase: '7', path: 'M1156.5 1028.5L1105 932L1161 902.5L1213 1000.5L1156.5 1028.5Z' },
    { id: '7-3', x: 58.37, y: 46.57, phase: '7', path: 'M1232.5 990L1183 894L1232.5 864L1283.5 956L1232.5 990Z' },
    { id: '6-1', x: 47.49, y: 60.38, phase: '6', path: 'M957.5 1249L966 1294.5L1099 1233.5L1039.5 1127.5L998.5 1150L957.5 1249Z' },
    { id: '6-2', x: 52.82, y: 57.68, phase: '6', path: 'M1072 1150L1118.5 1222.5L1179.5 1184L1135.5 1108L1072 1150Z' },
    { id: '6-3', x: 58.04, y: 54.97, phase: '6', path: 'M1189.5 1088L1234.5 1164.5L1281 1140.5L1234.5 1059.5L1189.5 1088Z' },
    { id: '6-4', x: 61.31, y: 53.03, phase: '6', path: 'M1258.5 1048.5L1297 1127.5L1352 1099.5L1308 1021.5L1258.5 1048.5Z' },
    { id: '6-5', x: 64.57, y: 51.07, phase: '6', path: 'M1326.5 1009L1371.5 1088L1422.5 1059.5L1371.5 982L1326.5 1009Z' },
    { id: '5-1', x: 70.72, y: 55.03, phase: '5', path: 'M1489 1151L1448.5 1071.5L1502 1046.5L1539.5 1127.5L1489 1151Z' },
    { id: '5-2', x: 74.02, y: 53.12, phase: '5', path: 'M1563 1114.5L1518.5 1034L1563 1006L1609 1085.5L1563 1114.5Z' },
    { id: '5-3', x: 77.53, y: 51.13, phase: '5', path: 'M1633 1071.5L1591 996L1642.5 968L1687.5 1046.5L1633 1071.5Z' },
    { id: '5-4', x: 68.19, y: 49.93, phase: '5', path: 'M1436 1046.5L1391.5 968L1448.5 946L1489 1025.5L1436 1046.5Z' },
    { id: '5-5', x: 71.68, y: 48.08, phase: '5', path: 'M1508.5 1010L1471 934.5L1518.5 907L1563 985L1508.5 1010Z' },
    { id: '5-6', x: 75.0, y: 46.07, phase: '5', path: 'M1578.5 968L1539.5 895.5L1591 866.5L1633 946L1578.5 968Z' },
    { id: '4-1', x: 57.86, y: 70.4, phase: '4', path: 'M1204 1456.5L1161.5 1376.5L1237 1337L1282 1422L1243 1466.5L1204 1456.5Z' },
    { id: '4-2', x: 61.29, y: 67.45, phase: '4', path: 'M1282 1404.5L1243 1329L1313.5 1293.5L1351.5 1367L1282 1404.5Z' },
    { id: '4-3', x: 60.83, y: 60.34, phase: '4', path: 'M1282 1257L1243 1182L1286.5 1155.5L1330 1231L1282 1257Z' },
    { id: '4-4', x: 64.11, y: 58.47, phase: '4', path: 'M1351.5 1218L1313.5 1145L1357 1118.5L1396 1194L1351.5 1218Z' },
    { id: '4-5', x: 67.42, y: 56.58, phase: '4', path: 'M1422.5 1182L1380 1106L1427 1077.5L1468 1155.5L1422.5 1182Z' },
    { id: '2-1', x: 56.62, y: 62.44, phase: '2', path: 'M1238 1278L1196 1196L1131.5 1228.5L1176 1313L1238 1278Z' },
    { id: '2-2', x: 52.65, y: 64.57, phase: '2', path: 'M1155 1322.5L1112.5 1240.5L1046 1272L1091.5 1351.5L1155 1322.5Z' },
    { id: '2-3', x: 48.79, y: 66.7, phase: '2', path: 'M1073 1363.5L1028.5 1278L970 1322.5L1007.5 1396L1073 1363.5Z' },
    { id: '2-4', x: 52.54, y: 71.64, phase: '2', path: 'M1123.5 1396L1022.5 1450L1123.5 1519L1155 1460.5L1123.5 1396Z' },
    { id: '2-5', x: 55.14, y: 76.19, phase: '2', path: 'M1169 1482.5L1104.5 1575L1162 1610L1218 1529.5L1169 1482.5Z' },
    { id: '2-6', x: 58.42, y: 79.13, phase: '2', path: 'M1228.5 1542.5L1176 1619.5L1249.5 1661.5L1287 1610L1228.5 1542.5Z' },
    { id: '3-1', x: 50.72, y: 79.72, phase: '3', path: 'M1013 1718L945 1824L841 1742V1644H959L971 1682L1013 1718Z' },
    { id: '3-2', x: 65.45, y: 55.62, phase: '3', path: 'M959 1564V1624H841V1564H959Z' },
    { id: '3-3', x: 44.07, y: 74.22, phase: '3', path: 'M961.5 1472.5L959 1544H841V1472.5H961.5Z' },
    { id: '3-4', x: 52.42, y: 57.03, phase: '3', path: 'M934.5 1378L959 1453H841L833 1423L934.5 1378Z' },
    { id: '1-1', x: 49.78, y: 78.04, phase: '1', path: 'M1108.5 1534.5L1025.5 1677L1001 1654.5L1013 1466L1108.5 1534.5Z' },
    { id: '1-2', x: 58.57, y: 94.51, phase: '1', path: 'M1169.5 1923L1290 1959.5L1299 1927.5L1269.5 1867.5L1224.5 1831L1169.5 1923Z' },
    { id: '1-3', x: 55.09, y: 91.83, phase: '1', path: 'M1210.5 1823L1154.5 1923L1088 1898L1154.5 1789L1210.5 1823Z' },
    { id: '1-4', x: 51.73, y: 90.07, phase: '1', path: 'M1138 1783.5L1075.5 1893.5L1023.5 1867.5L1088 1751L1138 1783.5Z' },
    { id: '1-5', x: 48.66, y: 88.14, phase: '1', path: 'M1075.5 1743L1006 1856L958.5 1831L1023.5 1712L1075.5 1743Z' },
    { id: '1-6', x: 60.08, y: 87.24, phase: '1', path: 'M1316.5 1762L1282.5 1808.5L1197.5 1758L1231.5 1703.5L1316.5 1762Z' },
    { id: '1-7', x: 56.2, y: 83.71, phase: '1', path: 'M1231.5 1670.5L1182 1751L1120.5 1712L1169.5 1633.5L1231.5 1670.5Z' },
    { id: '1-8', x: 52.71, y: 81.51, phase: '1', path: 'M1154.5 1625L1108.5 1703.5L1050 1670.5L1098.5 1592.5L1154.5 1625Z' },
];

// SVG path 데이터로부터 자동으로 중앙 좌표(bounding box 중심)를 계산하는 함수
const getPathCenter = (pathStr) => {
    const commands = pathStr.match(/[A-Za-z][^A-Za-z]*/g);
    const points = [];
    let currX = 0, currY = 0;

    if (commands) {
        commands.forEach(cmd => {
            const type = cmd[0];
            const args = cmd.slice(1).trim().split(/[\s,]+/).map(Number);
            if ((type === 'M' || type === 'L') && args.length >= 2) {
                currX = args[0];
                currY = args[1];
                points.push({ x: currX, y: currY });
            } else if (type === 'H' && args.length >= 1) {
                currX = args[0];
                points.push({ x: currX, y: currY });
            } else if (type === 'V' && args.length >= 1) {
                currY = args[0];
                points.push({ x: currX, y: currY });
            }
        });
    }

    if (points.length === 0) return { left: '50%', top: '50%' };

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    points.forEach(p => {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
    });

    // 폴리곤의 Bounding Box 중앙값을 구한 뒤, 뷰박스 크기(2112x2016)에 비례한 퍼센트로 변환합니다.
    return {
        left: `${((minX + maxX) / 2 / 2112) * 100}%`,
        top: `${((minY + maxY) / 2 / 2016) * 100}%`
    };
};

const ZoomableImage = ({ src, alt }) => {
    const [isZoomed, setIsZoomed] = useState(false);
    const containerRef = useRef(null);

    const handleZoomToggle = (e) => {
        e.stopPropagation();

        if (!isZoomed) {
            setIsZoomed(true);

            // Calculate click position relative to the image currently
            const img = document.getElementById(`zoom-img-${(alt || 'img').toString().replace(/\s+/g, '-')}`);
            if (img && containerRef.current) {
                const rect = img.getBoundingClientRect();

                // Get the percentage of where we clicked relative to the visual image
                const clickXPercent = (e.clientX - rect.left) / rect.width;
                const clickYPercent = (e.clientY - rect.top) / rect.height;

                // Wait for the next tick for the image to scale, then set scroll position
                setTimeout(() => {
                    if (containerRef.current) {
                        const scrollW = containerRef.current.scrollWidth;
                        const scrollH = containerRef.current.scrollHeight;
                        const clientW = containerRef.current.clientWidth;
                        const clientH = containerRef.current.clientHeight;

                        // Center the scroll on the clicked point
                        containerRef.current.scrollTo({
                            left: (scrollW * clickXPercent) - (clientW / 2),
                            top: (scrollH * clickYPercent) - (clientH / 2),
                            behavior: 'smooth'
                        });
                    }
                }, 50);
            }
        } else {
            setIsZoomed(false);
        }
    };

    return (
        <div
            ref={containerRef}
            className={`w-full h-full max-h-[90vh] rounded-xl relative shadow-2xl shadow-black ring-1 ring-white/10 flex transition-all duration-300 ${isZoomed ? 'overflow-auto items-start justify-start cursor-zoom-out bg-black/95 scrollbar-default' : 'overflow-hidden items-center justify-center cursor-zoom-in bg-transparent scrollbar-hide'}`}
            onClick={handleZoomToggle}
        >
            <img
                id={`zoom-img-${(alt || 'img').toString().replace(/\s+/g, '-')}`}
                src={src}
                alt={alt}
                className={`transition-transform duration-300 origin-[0_0] ${isZoomed ? 'w-[200%] md:w-[250%] max-w-none h-auto select-none' : 'max-w-full max-h-[90vh] object-contain select-none'}`}
            />

            {/* Guide Icon */}
            {!isZoomed && (
                <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-xs md:text-sm font-bold backdrop-blur-md pointer-events-none flex items-center gap-1.5 shadow-lg opacity-80 animate-pulse border border-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                    클릭하여 원본 확대
                </div>
            )}
        </div>
    );
};

const App = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [selectedPlot, setSelectedPlot] = useState(null);
    const [isPanoOpen, setIsPanoOpen] = useState(false);
    const [expandedPanoImage, setExpandedPanoImage] = useState(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);

        // Escape key listener to close modals sequentially
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setExpandedPanoImage(prevExpanded => {
                    if (prevExpanded) {
                        return null; // Just close the expanded image
                    } else {
                        // If no expanded image, close other modals
                        setIsPanoOpen(false);
                        setModalType(null);
                        return null;
                    }
                });
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const scrollToContact = () => {
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            {/* --- Sticky Header Wrapper --- */}
            <div className="sticky top-0 z-50 w-full">
                {/* --- Top Info Bar --- */}
                <div className="bg-[#5d7c47] text-white py-1.5 px-6 hidden md:block border-b border-white/10">
                    <div className="container mx-auto flex justify-between items-center text-[13px] font-bold tracking-tight">
                        <p>청주 숲세권 프리미엄 타운하우스 "에코 알베로" 51세대 분양 중</p>
                        <div className="flex gap-4 items-center">
                            <span>현장 문의: 010.0000.0000</span>
                        </div>
                    </div>
                </div>

                {/* --- Header --- */}
                <nav className={`w-full transition-all duration-300 ${scrolled
                    ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white'}`}>
                    <div className="container mx-auto px-6 h-20 flex justify-between items-center">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <img src={getAssetPath('eco_albero_logo.jpeg')} alt="Eco Albero Logo" className="h-12 w-auto rounded-lg" />
                            <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>
                            <div className="flex flex-col leading-none hidden sm:flex">
                                <span className="text-[#5d7c47] font-black text-lg tracking-tighter">에코 알베로</span>
                                <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Village</span>
                            </div>
                        </div>

                        <div className="hidden lg:flex items-center gap-10 text-[15px] font-bold text-slate-600">
                            <a href="#plots" className="hover:text-[#5d7c47] transition-colors">부지전경</a>
                            <a href="#community" className="hover:text-[#5d7c47] transition-colors">프리미엄 커뮤니티</a>
                            <a href="#location" className="hover:text-[#5d7c47] transition-colors">입지현황</a>
                            <a href="#gallery" className="hover:text-[#5d7c47] transition-colors">건축예시</a>
                            <a href="#contact" className="hover:text-[#5d7c47] transition-colors">상담예약</a>
                            <a href="/eco_albero_catalog.pdf" download="에코알베로_카달로그.pdf"
                                className="border-2 border-[#5d7c47] text-[#5d7c47] px-6 py-2.5 rounded-md flex items-center gap-2 hover:bg-[#5d7c47] hover:text-white transition-all font-bold">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                카달로그
                            </a>
                            <a href="tel:01000000000"
                                className="bg-[#ff8a00] text-white px-6 py-3 rounded-md flex items-center gap-2 hover:bg-[#e67c00] transition-all shadow-lg shadow-orange-100">
                                <IconPhone /> 010.0000.0000
                            </a>
                        </div>

                        <button className="lg:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="4" x2="20" y1="12" y2="12" />
                                <line x1="4" x2="20" y1="6" y2="6" />
                                <line x1="4" x2="20" y1="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </nav>
            </div>

            {/* --- Interactive Plot Explorer --- */}
            <section id="plots" className="relative min-h-screen flex flex-col items-center justify-center bg-slate-900 py-32 overflow-hidden shadow-2xl">
                {/* Beautiful Background styling */}
                <div className="absolute inset-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-40 scale-105 filter blur-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900"></div>

                {/* Header intro just for plots */}
                <div className="relative z-10 text-center mb-8 px-6 pt-10">
                    <h2 className="text-4xl md:text-5xl font-serif text-white mb-4 tracking-wide font-bold drop-shadow-md">프리미엄 부지 전경</h2>
                    <p className="text-white/90 md:text-lg font-light tracking-wide shadow-black drop-shadow mx-auto max-w-xl">
                        자연과 맞닿은 하이엔드 타운하우스. <br className="md:hidden" />
                        원하시는 부지를 클릭하여 해당 부지의 뷰를 직접 확인하세요.
                    </p>
                </div>

                {/* Ratio-Locked Interactive Container */}
                <div className="relative z-10 flex items-center justify-center p-4 lg:p-12 w-full">
                    <div
                        className="relative w-full max-w-4xl flex items-center justify-center group/map bg-white border-2 border-[#5d7c47]/50 rounded-xl shadow-2xl overflow-hidden"
                        style={{ aspectRatio: '2112/2016' }}
                    >
                        {/* Background Image - Matches the container exactly */}
                        <img
                            src={getAssetPath('site_main_before_polygon.png')}
                            alt="Site Map Background"
                            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                        />

                        {/* High-Precision SVG Interaction Layer - RENDERED ALONE */}
                        <svg
                            viewBox="0 0 2112 2016"
                            className="absolute inset-0 w-full h-full z-10 select-none overflow-visible"
                            preserveAspectRatio="none"
                        >
                            {/* We will replace these circles with <path> elements from Figma */}
                            {PLOTS.map(plot => (
                                <g
                                    key={`poly-${plot.id}`}
                                    className="pointer-events-auto cursor-pointer group/poly"
                                    onClick={() => {
                                        setSelectedPlot(plot);
                                        setIsPanoOpen(true);
                                    }}
                                >
                                    {/* ALWAYS RENDER BOTH FOR DEBUGGING */}
                                    <path
                                        d={plot.path}
                                        className="fill-red-500/50 stroke-red-600 group-hover/poly:fill-[#5d7c47]/60 group-hover/poly:stroke-[#5d7c47] transition-all duration-300"
                                        strokeWidth="4"
                                    />
                                </g>
                            ))}
                        </svg>

                        {/* Visual Marker Labels */}
                        <div className="absolute inset-0 pointer-events-none z-20">
                            {PLOTS.map(plot => (
                                <div
                                    key={`label-${plot.id}`}
                                    className="absolute w-8 h-8 -ml-4 -mt-4 text-[10px] tracking-tighter text-white font-bold rounded-full flex items-center justify-center border border-white/50 shadow-md pointer-events-none backdrop-blur-sm"
                                    style={{
                                        ...getPathCenter(plot.path),
                                        backgroundColor: PHASES[plot.phase].color + 'CC' // Add transparency
                                    }}
                                >
                                    {plot.id}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Hero Section Alternative (moved from top) --- */}
            <section className="relative py-24 flex items-center justify-center overflow-hidden bg-white border-b border-slate-100">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <div
                            className="inline-flex items-center gap-2 bg-[#ff8a00] text-white px-5 py-2 rounded-full mb-8 font-bold text-sm tracking-wide shadow-lg">
                            <IconClock /> 잔여 필지 빠르게 소진 중
                        </div>
                        <h1 className="text-slate-900 text-4xl md:text-6xl font-extrabold leading-[1.2] mb-8">
                            퇴근 후 30분<br />
                            도심의 소음이 숲의 숨소리로
                        </h1>
                        <p className="text-slate-500 text-lg md:text-2xl mb-12 font-medium leading-relaxed">
                            하이닉스·현대백화점 30분, 청남대·대청댐 25분<br />
                            도심의 편리함과 자연의 평온함을 동시에 소유하세요.
                        </p>
                        <div className="flex flex-wrap gap-4 items-center justify-center">
                            <button onClick={scrollToContact}
                                className="bg-[#5d7c47] text-white px-10 py-5 rounded-full font-black text-lg hover:bg-[#4a6339] shadow-lg shadow-green-100 transition-all flex items-center gap-2">
                                지금 분양 문의하기
                            </button>
                            <a href="/eco_albero_catalog.pdf" download="에코알베로_카달로그.pdf"
                                className="bg-white border-2 border-slate-200 text-slate-700 px-10 py-5 rounded-full font-black text-lg hover:bg-slate-50 transition-all inline-block text-center flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5d7c47]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                카달로그 다운로드
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Value Proposition: Premium Community --- */}
            <section id="community" className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <span className="text-[#5d7c47] font-black tracking-[0.2em] text-sm md:text-base mb-4 block">PRESTIGE COMMUNITY</span>
                        <h3 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                            거주하기 편한 <span className="text-blue-600">아파트형</span> 전원주택단지<br />
                            필수시설인 <span className="text-red-600">단지공용시설</span> 완벽 특화
                        </h3>
                        <p className="text-slate-500 md:text-lg font-medium">삶의 질을 중시하며 독특한 Lifestyle을 창조하는 마을</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Community Feature */}
                        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#5d7c47] mb-6 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-3">관리사무동 운영</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">단지관리인 상주를 통해 공원, 재활용 분리수거장 등 체계적인 관리 서비스 제공</p>
                        </div>
                        {/* Convenience Facility */}
                        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#5d7c47] mb-6 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-3">24시간 무인편의점</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">단지 밖을 나가지 않아도 언제든 편리하게 이용할 수 있는 상가 편의점 구축</p>
                        </div>
                        {/* Fitness */}
                        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#5d7c47] mb-6 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-3">주민 커뮤니티시설</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">2층에 조성된 프리미엄 운동시설 및 문화 공간으로 입주민 간 네트워킹 강화</p>
                        </div>
                        {/* Laundry */}
                        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#5d7c47] mb-6 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-3">대형 무인 세탁소</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">집에서 하기 힘든 대형 빨래도 단지 내에서 해결할 수 있는 무인 세탁 시설 공간</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Nature Park Section --- */}
            <section className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="lg:w-1/2 space-y-10 order-2 lg:order-1">
                            <span className="text-[#5d7c47] font-black tracking-[0.2em] text-sm md:text-base">NATURE PARK VILLAGE</span>
                            <h3 className="text-3xl md:text-5xl font-black leading-tight text-slate-900">
                                단지 내 공원 시설<br />
                                1만평 이상의 녹지를 품다
                            </h3>
                            <p className="text-slate-600 text-lg leading-relaxed font-medium">
                                단지 전체 면적도 계약자 분들에게 제공됩니다.<br />
                                자연에 둘러싸여 건강까지 생각하는 프리미엄 힐링 단지를 경험하세요.
                            </p>
                            <div className="space-y-6 pt-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#5d7c47]/10 flex items-center justify-center text-[#5d7c47]">
                                        <IconCheck />
                                    </div>
                                    <span className="text-lg font-bold text-slate-800">단지 내 유실수 공원 제공 (과실수)</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#5d7c47]/10 flex items-center justify-center text-[#5d7c47]">
                                        <IconCheck />
                                    </div>
                                    <span className="text-lg font-bold text-slate-800">시원한 나무 정자가 조성된 단지 쉼터</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#5d7c47]/10 flex items-center justify-center text-[#5d7c47]">
                                        <IconCheck />
                                    </div>
                                    <span className="text-lg font-bold text-slate-800">안전하고 편안한 단지 내 숲길 산책로</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#5d7c47]/10 flex items-center justify-center text-[#5d7c47]">
                                        <IconCheck />
                                    </div>
                                    <span className="text-lg font-bold text-slate-800">동남향, 정남향 설계로 태봉산 조망 확보!</span>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 relative order-1 lg:order-2">
                            <div className="absolute inset-0 bg-[#5d7c47] rounded-[40px] rotate-3 scale-105 opacity-10"></div>
                            <img src={getAssetPath('lifestyle_5060.png')} alt="Park and Nature" className="w-full h-auto rounded-[40px] shadow-2xl relative z-10" />
                            {/* Floating overlay badge */}
                            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl z-20 hidden md:block border border-slate-100">
                                <div className="text-4xl font-black text-[#5d7c47] mb-1">10,000평+</div>
                                <div className="text-slate-500 font-bold">자연 녹지 공간</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Hi-Tech Section --- */}
            <section className="py-24 bg-white text-slate-900 relative flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-60 filter blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-100 rounded-full opacity-60 filter blur-[100px] pointer-events-none"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <span className="text-[#5d7c47] font-black tracking-[0.2em] text-sm md:text-base mb-4 block">HI-TECH PLAN</span>
                    <h3 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                        스마트한 첨단시스템으로<br />
                        생활 편의성을 업그레이드 하다!
                    </h3>
                    <p className="text-slate-500 md:text-lg mb-16 font-medium max-w-2xl mx-auto">전방위 생활지원 SYSTEM, 생활서비스 조경 등 아파트 수준의 특별한 보안과 관리를 제공합니다.</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto">
                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-4 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </div>
                            <h5 className="font-black text-lg text-slate-900">최신 단지내 CCTV</h5>
                            <p className="text-slate-500 text-xs mt-2 leading-relaxed">사각지대 없는 24시간 안전망</p>
                        </div>
                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 mb-4 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            </div>
                            <h5 className="font-black text-lg text-slate-900">무인 경비 & 출동</h5>
                            <p className="text-slate-500 text-xs mt-2 leading-relaxed">안심 전문 출동 경비 시스템</p>
                        </div>
                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </div>
                            <h5 className="font-black text-lg text-slate-900">스마트 출입 차단</h5>
                            <p className="text-slate-500 text-xs mt-2 leading-relaxed">스마트폰 연동 차량통제 게이트</p>
                        </div>
                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-full bg-[#5d7c47]/10 flex items-center justify-center text-[#5d7c47] mb-4 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            </div>
                            <h5 className="font-black text-lg text-slate-900">전용 스마트앱 연동</h5>
                            <p className="text-slate-500 text-xs mt-2 leading-relaxed">세대 조명통제/공용시설예약</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Location Highlights --- */}
            <section id="location" className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="lg:w-1/2 space-y-10">
                            <h4 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
                                청주 중심이 가깝고<br />
                                직주근접이 완벽
                            </h4>
                            <div className="space-y-8">
                                <div className="flex gap-6 items-start">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl shadow-sm flex items-center justify-center text-[#5d7c47] shrink-0">
                                        <IconCheck />
                                    </div>
                                    <div>
                                        <h5 className="text-xl font-black mb-2">하이닉스/현대백화점 30분</h5>
                                        <p className="text-slate-500 font-medium">퇴근 후 30분 만에 자연 속으로. 청주의 핵심 인프라를 지척에서 누립니다.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 items-start">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl shadow-sm flex items-center justify-center text-[#5d7c47] shrink-0">
                                        <IconCheck />
                                    </div>
                                    <div>
                                        <h5 className="text-xl font-black mb-2">단지 내 전용 관리사무소</h5>
                                        <p className="text-slate-500 font-medium">보안과 공동시설 관리를 책임지는 전문 인력이 상주하여 편리합니다.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 items-start">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl shadow-sm flex items-center justify-center text-[#5d7c47] shrink-0">
                                        <IconCheck />
                                    </div>
                                    <div>
                                        <h5 className="text-xl font-black mb-2">청남대·대청댐 명품 생활권</h5>
                                        <p className="text-slate-500 font-medium">대통령의 휴양지 청남대와 대청댐이 인접한 천혜의 자연환경을 매일 누립니다.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 items-start">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl shadow-sm flex items-center justify-center text-[#5d7c47] shrink-0">
                                        <IconCheck />
                                    </div>
                                    <div>
                                        <h5 className="text-xl font-black mb-2">4차 우회도로 인접</h5>
                                        <p className="text-slate-500 font-medium">청주 전역 및 오창, 세종 방면으로의 쾌속 교통망을 갖췄습니다.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <a href="https://naver.me/GBv6kOWz" target="_blank" rel="noopener noreferrer"
                            className="lg:w-1/2 bg-white p-4 rounded-[40px] shadow-2xl relative group overflow-hidden block">
                            <img src={getAssetPath('map.png')}
                                alt="에코알베로 지도 위치" className="w-full rounded-[30px] group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 bg-slate-900/10 group-hover:bg-slate-900/20 transition-all">
                                <div className="bg-[#5d7c47] text-white p-4 rounded-full mb-4 shadow-xl">
                                    <IconMapPin />
                                </div>
                                <h6 className="text-2xl font-black mb-2 text-white drop-shadow-md">에코 알베로 현장</h6>
                                <p className="text-slate-900 font-bold bg-white/90 px-4 py-1 rounded-full text-sm">청주시 남일면 고은리 산35-25</p>
                                <p className="mt-4 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">클릭하여 네이버 지도로 보기</p>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            {/* --- Gallery --- */}
            <section id="gallery" className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <h4 className="text-4xl md:text-5xl font-black">
                            자유로운 맞춤형 설계<br />
                            <span className="text-[#5d7c47]">에코 알베로</span> 건축 예시
                        </h4>
                        <div className="text-left md:text-right">
                            <p className="text-slate-500 font-bold md:text-lg max-w-lg mb-2">
                                사용자의 라이프스타일에 맞춘 맞춤형 자율 설계가 가능합니다. 분양사에서 제공하는 건축 타입별 예시를 확인해보세요.
                            </p>
                            <span className="inline-flex items-center gap-2 text-[#5d7c47] text-sm font-bold bg-[#5d7c47]/10 px-4 py-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                                사진을 클릭하시면 크게 보실 수 있습니다.
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 gap-y-12">
                        {/* A */}
                        <div className="space-y-4 group cursor-pointer" onClick={() => setExpandedPanoImage({ src: getAssetPath('archi_sample_a.webp'), label: 'A타입 모던 프리미엄' })}>
                            <div className="aspect-[4/3] rounded-3xl bg-slate-100 overflow-hidden shadow-md group-hover:shadow-xl group-hover:-translate-y-2 transition-all relative">
                                <img src={getAssetPath('archi_sample_a.webp')}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    alt="Architecture Sample A" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <div className="bg-white/90 text-slate-800 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                                    </div>
                                </div>
                            </div>
                            <h6 className="text-lg font-black text-slate-800 text-center">A타입 모던 프리미엄 외관</h6>
                        </div>
                        {/* B */}
                        <div className="space-y-4 group cursor-pointer lg:translate-y-8" onClick={() => setExpandedPanoImage({ src: getAssetPath('archi_sample_b.webp'), label: 'B타입 자연 친화적 디자인' })}>
                            <div className="aspect-[4/3] rounded-3xl bg-slate-100 overflow-hidden shadow-md group-hover:shadow-xl group-hover:-translate-y-2 transition-all relative">
                                <img src={getAssetPath('archi_sample_b.webp')}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    alt="Architecture Sample B" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <div className="bg-white/90 text-slate-800 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                                    </div>
                                </div>
                            </div>
                            <h6 className="text-lg font-black text-slate-800 text-center">B타입 자연 친화적 디자인</h6>
                        </div>
                        {/* C */}
                        <div className="space-y-4 group cursor-pointer" onClick={() => setExpandedPanoImage({ src: getAssetPath('archi_sample_c.webp'), label: 'C타입 하이엔드 럭셔리 뷰' })}>
                            <div className="aspect-[4/3] rounded-3xl bg-slate-100 overflow-hidden shadow-md group-hover:shadow-xl group-hover:-translate-y-2 transition-all relative">
                                <img src={getAssetPath('archi_sample_c.webp')}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    alt="Architecture Sample C" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <div className="bg-white/90 text-slate-800 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                                    </div>
                                </div>
                            </div>
                            <h6 className="text-lg font-black text-slate-800 text-center">C타입 하이엔드 럭셔리 뷰</h6>
                        </div>
                        {/* D */}
                        <div className="space-y-4 group cursor-pointer lg:translate-y-8" onClick={() => setExpandedPanoImage({ src: getAssetPath('archi_sample_d.webp'), label: 'D타입 프리미엄 단독' })}>
                            <div className="aspect-[4/3] rounded-3xl bg-slate-100 overflow-hidden shadow-md group-hover:shadow-xl group-hover:-translate-y-2 transition-all relative">
                                <img src={getAssetPath('archi_sample_d.webp')}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    alt="Architecture Sample D" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <div className="bg-white/90 text-slate-800 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                                    </div>
                                </div>
                            </div>
                            <h6 className="text-lg font-black text-slate-800 text-center">D타입 최고급 프리미엄 스케일</h6>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Interior Features --- */}
            <section id="interior" className="py-24 bg-white border-t border-slate-100">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <span className="text-yellow-600 font-black tracking-[0.2em] text-sm md:text-base mb-4 block">PREMIUM INTERIOR</span>
                        <h3 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                            기본이 다른 품격,<br />
                            에코 알베로만의 <span className="text-[#5d7c47]">시그니처 인테리어</span>
                        </h3>
                        <p className="text-slate-500 md:text-lg font-medium">최고급 마감재와 트렌디한 공간 설계로 일상의 가치를 높이는 하이엔드 라이프를 선사합니다.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
                        {/* Kitchen */}
                        {/* Kitchen */}
                        <div
                            className="group cursor-pointer rounded-[40px] overflow-hidden bg-slate-900 border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative"
                            onClick={() => setExpandedPanoImage({ src: getAssetPath('interior_kitchen.webp'), label: '럭셔리 다이닝 & 오픈 키친' })}
                        >
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <img src={getAssetPath('interior_kitchen.webp')} alt="Premium Kitchen" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-700 flex items-center justify-center">
                                    <div className="bg-white/90 text-slate-800 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg translate-y-8 group-hover:translate-y-0 duration-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                                    <div className="bg-[#5d7c47] text-white text-xs font-bold px-3 py-1.5 rounded-full w-max mb-4 shadow-md tracking-wider">KITCHEN</div>
                                    <h4 className="text-3xl font-black text-white mb-3">럭셔리 다이닝 & 오픈 키친</h4>
                                    <p className="text-white/90 md:text-lg font-medium leading-relaxed drop-shadow-md">하이엔드 주방 가구 및 효율적인 동선을 고려한 와이드 아일랜드 식탁. 온 가족이 소통하는 품격 있는 다이닝 문화를 제안합니다.</p>
                                </div>
                            </div>
                        </div>

                        {/* Window / Living */}
                        <div
                            className="group cursor-pointer rounded-[40px] overflow-hidden bg-slate-900 border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative lg:mt-16"
                            onClick={() => setExpandedPanoImage({ src: getAssetPath('interior_window.webp'), label: '채광 특화 파노라마 윈도우' })}
                        >
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <img src={getAssetPath('interior_window.webp')} alt="Premium Window" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-700 flex items-center justify-center">
                                    <div className="bg-white/90 text-slate-800 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg translate-y-8 group-hover:translate-y-0 duration-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                                    <div className="bg-blue-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full w-max mb-4 shadow-md tracking-wider">LIVING VIEW</div>
                                    <h4 className="text-3xl font-black text-white mb-3">채광 특화 파노라마 윈도우</h4>
                                    <p className="text-white/90 md:text-lg font-medium leading-relaxed drop-shadow-md">시야를 방해하지 않는 광폭 와이드 통창 설계로 자연 채광을 극대화하고, 사계절 에코 알베로의 아름다운 숲 뷰를 거실 안으로 들입니다.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Contact Form --- */}
            <section id="contact" className="py-24 bg-slate-900 relative overflow-hidden">
                <div
                    className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#5d7c47] rounded-full blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/2">
                </div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="bg-white rounded-[50px] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
                        <div className="lg:w-[45%] bg-[#5d7c47] p-12 md:p-20 text-white space-y-8">
                            <h4 className="text-4xl md:text-6xl font-black leading-tight">
                                지금 바로<br />
                                문의하세요
                            </h4>
                            <p className="text-white/70 text-lg font-medium">
                                원하시는 필지 위치와 건축 상담을<br />
                                전문 분양상담사가 상세히 안내해 드립니다.
                            </p>
                            <div className="pt-8 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                                        <IconPhone />
                                    </div>
                                    <span className="text-2xl font-bold">010.0000.0000</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                                        <IconMapPin />
                                    </div>
                                    <span className="text-xl font-bold">현장: 청주시 남일면 고은리 산35-25</span>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-[55%] p-12 md:p-20 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Name</label>
                                    <input type="text" placeholder="성함"
                                        className="w-full border-b-2 border-slate-100 py-4 outline-none focus:border-[#5d7c47] transition-colors font-bold text-lg" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Phone</label>
                                    <input type="tel" placeholder="연락처"
                                        className="w-full border-b-2 border-slate-100 py-4 outline-none focus:border-[#5d7c47] transition-colors font-bold text-lg" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Interest</label>
                                <div className="flex flex-wrap gap-4 pt-2">
                                    {['방문예약', '분양가문의', '필지문의', '기타'].map((item) => (
                                        <button key={item}
                                            className="px-6 py-3 rounded-full border-2 border-slate-100 font-bold text-slate-500 hover:border-[#5d7c47] hover:text-[#5d7c47] transition-all">
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-8">
                                <button
                                    className="w-full bg-[#5d7c47] text-white py-6 rounded-2xl font-black text-xl hover:bg-[#4a6339] transition-all shadow-xl shadow-green-100">
                                    신청하기
                                </button>
                                <p className="text-center mt-6 text-slate-400 text-sm font-medium">개인정보는 분양 상담을 위해서만 활용됩니다.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Footer --- */}
            <footer className="bg-white py-20 border-t border-slate-100">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                        <div className="flex items-center gap-3">
                            <img src={getAssetPath('eco_albero_logo.jpeg')} alt="Eco Albero Logo" className="h-10 w-auto rounded-md grayscale opacity-80" />
                            <div className="text-[#5d7c47] font-black text-2xl tracking-tighter italic">ECO ALBERO</div>
                        </div>
                        <div className="flex gap-12 text-slate-400 font-bold text-sm">
                            <button onClick={() => setModalType('terms')} className="hover:text-slate-900 transition-colors">이용약관</button>
                            <button onClick={() => setModalType('privacy')} className="hover:text-slate-900 transition-colors">개인정보처리방침</button>
                            <a href="#location" className="hover:text-slate-900 transition-colors">오시는길</a>
                        </div>
                    </div>
                    <div className="mt-12 pt-12 border-t border-slate-50 text-center md:text-left">
                        <p className="text-slate-400 text-sm leading-loose font-medium">
                            에코 알베로 | 분양 : 주식회사 와운 | 주소: 충청북도 청주시 상당구 수암로54번길 8 3동 3층 <br />
                            사업자등록번호: [번호확인 필요] | 대표자: [성함] | 분양문의: 010.0000.0000 <br />
                            본 사이트의 조감도 및 CG는 소비자의 이해를 돕기 위한 것으로 실제와 다를 수 있습니다.
                        </p>
                        <p className="mt-6 text-slate-300 text-xs uppercase tracking-widest">© 2026 ECO ALBERO. ALL RIGHTS RESERVED.</p>
                    </div>
                </div>
            </footer>

            {/* --- Modal --- */}
            {modalType && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setModalType(null)}></div>
                    <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[80vh] overflow-hidden relative z-10 shadow-2xl flex flex-col">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                            <h5 className="text-2xl font-black">
                                {modalType === 'terms' ? '이용약관' : '개인정보처리방침'}
                            </h5>
                            <button onClick={() => setModalType(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        <div className="p-8 overflow-y-auto text-slate-600 leading-relaxed space-y-6 font-medium">
                            {modalType === 'terms' ? (
                                <>
                                    <section className="space-y-3">
                                        <h6 className="text-slate-900 font-bold">제 1 조 (목적)</h6>
                                        <p className="text-sm">본 약관은 에코 알베로 분양 홍보 사이트(이하 "사이트")가 제공하는 서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.</p>
                                    </section>
                                    <section className="space-y-3">
                                        <h6 className="text-slate-900 font-bold">제 2 조 (정보의 한계 및 변경)</h6>
                                        <p className="text-sm">본 사이트에 사용된 조감도, CG, 이미지, 평면도 등은 소비자의 이해를 돕기 위해 제작된 것으로 실제 시공 시 인허가 과정이나 현장 여건에 따라 변경될 수 있습니다.</p>
                                    </section>
                                    <section className="space-y-3">
                                        <h6 className="text-slate-900 font-bold">제 3 조 (저작권의 귀속)</h6>
                                        <p className="text-sm">사이트에 게재된 모든 콘텐츠(이미지, 텍스트, 로고 등)에 대한 저작권은 에코 알베로 및 분양 대행사에 귀속되며, 무단 복제 및 배포를 금합니다.</p>
                                    </section>
                                </>
                            ) : (
                                <>
                                    <section className="space-y-3">
                                        <h6 className="text-slate-900 font-bold">1. 개인정보의 수집 및 이용 목적</h6>
                                        <p className="text-sm">수집된 개인정보는 에코 알베로 분양 상담, 방문 예약 확인, 분양 관련 정보 제공(전화, SMS) 및 마케팅 활용을 위해 사용됩니다.</p>
                                    </section>
                                    <section className="space-y-3">
                                        <h6 className="text-slate-900 font-bold">2. 수집하는 개인정보 항목</h6>
                                        <p className="text-sm">필수항목: 성함, 연락처, 관심분야</p>
                                    </section>
                                    <section className="space-y-3">
                                        <h6 className="text-slate-900 font-bold">3. 개인정보의 보유 및 이용 기간</h6>
                                        <p className="text-sm">개인정보는 분양 종료 시까지 또는 정보 주체의 삭제 요청 시까지 보유하며, 목적 달성 후 지체 없이 파기합니다.</p>
                                    </section>
                                    <section className="space-y-3">
                                        <h6 className="text-slate-900 font-bold">4. 동의 거부 권리</h6>
                                        <p className="text-sm">귀하는 개인정보 수집 및 이용에 동의하지 않을 권리가 있으나, 동의 거부 시 상담 신청 및 서비스 이용이 제한될 수 있습니다.</p>
                                    </section>
                                </>
                            )}
                        </div>
                        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
                            <button onClick={() => setModalType(null)} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all">
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Panorama Modal */}
            {isPanoOpen && selectedPlot && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="relative w-full max-w-6xl h-[80vh] bg-catalog-dark rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row">
                        <button
                            className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-white hover:text-black transition-all"
                            onClick={() => setIsPanoOpen(false)}
                        >
                            <IconX />
                        </button>

                        <div className="w-full md:w-2/3 h-full relative group p-4 md:p-8 space-y-4 flex flex-col bg-black/50">
                            <div className="text-white mb-6 pt-12 md:pt-0 shrink-0">
                                <h3 className="text-2xl font-serif mb-2 text-catalog-gold">부지 전경 (남향)</h3>
                                <p className="text-white/80 text-sm tracking-wide">전부 남향, 해당 부지에서 바라보는 뷰를 보여드립니다.</p>
                            </div>

                            {/* Thumbnails View */}
                            <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
                                <div className="grid grid-cols-3 gap-3 md:gap-6">
                                    {[
                                        { id: 'se', label: '동남향 VIEW', src: getAssetPath('view_southeast.png') },
                                        { id: 's', label: '정남향 VIEW', src: getAssetPath('view_south.png') },
                                        { id: 'sw', label: '남서향 VIEW', src: getAssetPath('view_southwest.png') }
                                    ].map(img => (
                                        <div
                                            key={img.id}
                                            className="aspect-square relative rounded-2xl overflow-hidden cursor-pointer group/thumb border-2 border-white/10 hover:border-catalog-gold transition-all shadow-lg"
                                            onClick={() => setExpandedPanoImage(img)}
                                        >
                                            <div className="absolute inset-0 bg-black/30 group-hover/thumb:bg-transparent transition-colors duration-300 z-10"></div>
                                            <div className="absolute bottom-3 left-3 z-20 bg-black/80 px-3 py-1.5 rounded-lg text-white text-xs md:text-sm font-bold backdrop-blur-md border border-white/20">{img.label}</div>
                                            <img src={img.src} alt={img.label} className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-700" />

                                            {/* Expand Icon */}
                                            <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300 pointer-events-none">
                                                <div className="bg-catalog-gold/90 text-slate-900 p-2 rounded-full shadow-lg">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="text-white/40 text-xs md:text-sm text-center mt-8 font-medium bg-white/5 py-3 rounded-full border border-white/5">
                                    👆 사진을 클릭하시면 전체 화면으로 크게 보실 수 있습니다.
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-1/3 h-full p-8 flex flex-col justify-between bg-slate-900 border-l border-white/5 overflow-y-auto">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-catalog-gold/20 text-catalog-gold border border-catalog-gold/30">
                                        {PHASES[selectedPlot.phase].label}
                                    </span>
                                    <span className="text-white/40 text-xs">부지 {selectedPlot.id}</span>
                                </div>
                                <h2 className="text-3xl font-serif text-white mb-6">프리미엄 부지 {selectedPlot.id}</h2>

                                <div className="space-y-6">
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                                        <div className="text-sm font-bold text-catalog-gold">부지 면적</div>
                                        <div className="text-xl font-light text-white">450 <span className="text-sm text-white/50">m²</span></div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                                        <div className="text-sm font-bold text-catalog-gold">분양가</div>
                                        <div className="text-xl font-bold text-white tracking-widest">문의</div>
                                    </div>

                                    <div className="pt-4 border-t border-white/10">
                                        <h3 className="text-sm font-bold text-white/80 mb-3 uppercase tracking-wider">주요 특징</h3>
                                        <ul className="grid grid-cols-2 gap-3">
                                            {['모든 세대 남향', '파노라마 숲 뷰', '프라이빗 정원', '자연 조망권'].map(feat => (
                                                <li key={feat} className="flex items-center gap-2 text-xs text-white/70">
                                                    <div className="w-1 h-1 rounded-full bg-catalog-gold flex-shrink-0"></div>
                                                    <span>{feat}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full py-4 mt-8 bg-catalog-gold text-catalog-dark font-bold hover:bg-white transition-colors duration-300 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-catalog-gold/20">
                                <IconPhone />
                                상담 신청하기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Lightbox for Expanded Image */}
            {expandedPanoImage && (
                <div
                    className="fixed inset-[0] z-[9999] flex flex-col items-center justify-center bg-black/95 p-2 md:p-6 animate-in fade-in zoom-in-95 duration-200"
                    onClick={(e) => {
                        e.stopPropagation();
                        setExpandedPanoImage(null);
                    }}
                >
                    <button
                        className="absolute top-6 right-6 z-[10000] p-3 bg-white/10 text-white rounded-full hover:bg-white/30 hover:scale-110 transition-all backdrop-blur-md"
                        onClick={(e) => {
                            e.stopPropagation();
                            setExpandedPanoImage(null);
                        }}
                    >
                        <IconX />
                    </button>

                    <div className="relative w-full h-[90vh] md:h-[95vh] flex items-center justify-center group text-center" onClick={(e) => e.stopPropagation()}>
                        <ZoomableImage src={expandedPanoImage.src} alt={expandedPanoImage.label} />
                        <div className="absolute bottom-6 bg-black/80 backdrop-blur-md px-6 py-3 rounded-full text-white font-bold tracking-widest border border-white/10 shadow-lg pointer-events-none transition-opacity z-10">
                            {expandedPanoImage.label}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;