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
    '1': { color: '#af94c4', label: '1차' },
    '2': { color: '#f49644', label: '2차' },
    '3': { color: '#22a985', label: '3차' },
    '4': { color: '#567eb9', label: '4차' },
    '5': { color: '#f6748c', label: '5차' },
    '6': { color: '#33becb', label: '6차' },
    '7': { color: '#9b6b6a', label: '7차' },
    '8': { color: '#79db70', label: '8차' },
    '9': { color: '#ea4335', label: '9차' },
};

// --- Plot Data (Extracted from 2112x2016 source) ---
const PLOTS = [
    { id: '9-1', x: 65.41, y: 65.43, phase: '9', status: 'available', area: 723.4, path: 'M1368 1353.5L1334 1287L1395 1252.5L1442 1348.5L1368 1353.5Z' },
    { id: '9-2', x: 69.54, y: 63.96, phase: '9', status: 'sold', area: 816.4, path: 'M1469 1340L1415 1243L1469 1210.5L1521.5 1314L1469 1340Z' },
    { id: '9-3', x: 73.43, y: 61.64, phase: '9', status: 'available', area: 821.1, path: 'M1545.5 1302.5L1494.5 1200.5L1563.5 1164.5L1605 1243L1545.5 1302.5Z' },
    { id: '9-4', x: 77.72, y: 58.83, phase: '9', status: 'available', area: 792.6, path: 'M1631.5 1233L1588 1152.5L1656.5 1116.5L1700 1195L1631.5 1233Z' },
    { id: '9-5', x: 81.76, y: 56.35, phase: '9', status: 'sold', area: 696.0, path: 'M1719.5 1178L1677.5 1105L1749.5 1061.5L1767.5 1158L1719.5 1178Z' },
    { id: '8-1', x: 62.04, y: 44.54, phase: '8', status: 'available', area: 750.8, path: 'M1310.5 948L1259 851L1310.5 824.5L1360.5 918.5L1310.5 948Z' },
    { id: '8-2', x: 65.67, y: 42.47, phase: '8', status: 'sold', area: 836.7, path: 'M1384 907.5L1331.5 812.5L1394.5 778.5L1440.5 874.5L1384 907.5Z' },
    { id: '8-3', x: 69.47, y: 40.4, phase: '8', status: 'available', area: 831.9, path: 'M1464 865L1413 771L1475 738L1520.5 833L1464 865Z' },
    { id: '8-4', x: 73.06, y: 38.44, phase: '8', status: 'available', area: 816.4, path: 'M1541 824.5L1496 728.5L1541 702.5L1596.5 794.5L1541 824.5Z' },
    { id: '7-1', x: 49.05, y: 50.44, phase: '7', status: 'available', area: 1346.8, path: 'M1011 995L1021 979L1081.5 946L1136 1040L1006 1105L985.5 1058L1011 995Z' },
    { id: '7-2', x: 54.85, y: 48.53, phase: '7', status: 'available', area: 750.8, path: 'M1156.5 1028.5L1105 932L1161 902.5L1213 1000.5L1156.5 1028.5Z' },
    { id: '7-3', x: 58.37, y: 46.57, phase: '7', status: 'available', area: 749.6, path: 'M1232.5 990L1183 894L1232.5 864L1283.5 956L1232.5 990Z' },
    { id: '6-1', x: 47.49, y: 60.38, phase: '6', status: 'sold', area: 1265.7, path: 'M957.5 1249L966 1294.5L1099 1233.5L1039.5 1127.5L998.5 1150L957.5 1249Z' },
    { id: '6-2', x: 52.82, y: 57.68, phase: '6', status: 'available', area: 662.6, path: 'M1072 1150L1118.5 1222.5L1179.5 1184L1135.5 1108L1072 1150Z' },
    { id: '6-3', x: 58.04, y: 54.97, phase: '6', status: 'available', area: 589.9, path: 'M1189.5 1088L1234.5 1164.5L1281 1140.5L1234.5 1059.5L1189.5 1088Z' },
    { id: '6-4', x: 61.31, y: 53.03, phase: '6', status: 'available', area: 595.9, path: 'M1258.5 1048.5L1297 1127.5L1352 1099.5L1308 1021.5L1258.5 1048.5Z' },
    { id: '6-5', x: 64.57, y: 51.07, phase: '6', status: 'available', area: 597.1, path: 'M1326.5 1009L1371.5 1088L1422.5 1059.5L1371.5 982L1326.5 1009Z' },
    { id: '5-1', x: 70.72, y: 55.03, phase: '5', status: 'available', area: 591.2, path: 'M1489 1151L1448.5 1071.5L1502 1046.5L1539.5 1127.5L1489 1151Z' },
    { id: '5-2', x: 74.02, y: 53.12, phase: '5', status: 'available', area: 591.2, path: 'M1563 1114.5L1518.5 1034L1563 1006L1609 1085.5L1563 1114.5Z' },
    { id: '5-3', x: 77.53, y: 51.13, phase: '5', status: 'available', area: 582.8, path: 'M1633 1071.5L1591 996L1642.5 968L1687.5 1046.5L1633 1071.5Z' },
    { id: '5-4', x: 68.19, y: 49.93, phase: '5', status: 'available', area: 594.7, path: 'M1436 1046.5L1391.5 968L1448.5 946L1489 1025.5L1436 1046.5Z' },
    { id: '5-5', x: 71.68, y: 48.08, phase: '5', status: 'available', area: 594.7, path: 'M1508.5 1010L1471 934.5L1518.5 907L1563 985L1508.5 1010Z' },
    { id: '5-6', x: 75.0, y: 46.07, phase: '5', status: 'available', area: 588.8, path: 'M1578.5 968L1539.5 895.5L1591 866.5L1633 946L1578.5 968Z' },
    { id: '4-1', x: 57.86, y: 70.4, phase: '4', status: 'management', area: 647.2, path: 'M1204 1456.5L1161.5 1376.5L1237 1337L1282 1422L1243 1466.5L1204 1456.5Z' },
    { id: '4-2', x: 61.29, y: 67.45, phase: '4', status: 'available', area: 572.1, path: 'M1282 1404.5L1243 1329L1313.5 1293.5L1351.5 1367L1282 1404.5Z' },
    { id: '4-3', x: 60.83, y: 60.34, phase: '4', status: 'available', area: 585.2, path: 'M1282 1257L1243 1182L1286.5 1155.5L1330 1231L1282 1257Z' },
    { id: '4-4', x: 64.11, y: 58.47, phase: '4', status: 'available', area: 591.2, path: 'M1351.5 1218L1313.5 1145L1357 1118.5L1396 1194L1351.5 1218Z' },
    { id: '4-5', x: 67.42, y: 56.58, phase: '4', status: 'available', area: 592.3, path: 'M1422.5 1182L1380 1106L1427 1077.5L1468 1155.5L1422.5 1182Z' },
    { id: '2-1', x: 56.62, y: 62.44, phase: '2', status: 'available', area: 736.5, path: 'M1238 1278L1196 1196L1131.5 1228.5L1176 1313L1238 1278Z' },
    { id: '2-2', x: 52.65, y: 64.57, phase: '2', status: 'sold', area: 759.1, path: 'M1155 1322.5L1112.5 1240.5L1046 1272L1091.5 1351.5L1155 1322.5Z' },
    { id: '2-3', x: 48.79, y: 66.7, phase: '2', status: 'sold', area: 717.5, path: 'M1073 1363.5L1028.5 1278L970 1322.5L1007.5 1396L1073 1363.5Z' },
    { id: '2-4', x: 52.54, y: 71.64, phase: '2', status: 'available', area: 809.2, path: 'M1123.5 1396L1022.5 1450L1123.5 1519L1155 1460.5L1123.5 1396Z' },
    { id: '2-5', x: 55.14, y: 76.19, phase: '2', status: 'available', area: 756.7, path: 'M1169 1482.5L1104.5 1575L1162 1610L1218 1529.5L1169 1482.5Z' },
    { id: '2-6', x: 58.42, y: 79.13, phase: '2', status: 'available', area: 729.4, path: 'M1228.5 1542.5L1176 1619.5L1249.5 1661.5L1287 1610L1228.5 1542.5Z' },
    { id: '3-4', x: 50.72, y: 79.72, phase: '3', status: 'sold', area: 1529.6, path: 'M1013 1718L945 1824L841 1742V1644H959L971 1682L1013 1718Z' },
    { id: '3-3', x: 65.45, y: 55.62, phase: '3', status: 'available', area: 743.3, path: 'M959 1564V1624H841V1564H959Z' },
    { id: '3-2', x: 44.07, y: 74.22, phase: '3', status: 'sold', area: 727.0, path: 'M961.5 1472.5L959 1544H841V1472.5H961.5Z' },
    { id: '3-1', x: 52.42, y: 57.03, phase: '3', status: 'available', area: 783.6, path: 'M934.5 1378L959 1453H841L833 1423L934.5 1378Z' },
    { id: '3-5', x: 49.78, y: 78.04, phase: '3', status: 'available', area: 1022.6, path: 'M1108.5 1534.5L1025.5 1677L1001 1654.5L1013 1466L1108.5 1534.5Z' },
    { id: '1-1', x: 58.57, y: 94.51, phase: '1', status: 'available', area: 819.4, path: 'M1169.5 1923L1290 1959.5L1299 1927.5L1269.5 1867.5L1224.5 1831L1169.5 1923Z' },
    { id: '1-2', x: 55.09, y: 91.83, phase: '1', status: 'sold', area: 772.7, path: 'M1210.5 1823L1154.5 1923L1088 1898L1154.5 1789L1210.5 1823Z' },
    { id: '1-3', x: 51.73, y: 90.07, phase: '1', status: 'available', area: 734.1, path: 'M1138 1783.5L1075.5 1893.5L1023.5 1867.5L1088 1751L1138 1783.5Z' },
    { id: '1-4', x: 48.66, y: 88.14, phase: '1', status: 'available', area: 767.5, path: 'M1075.5 1743L1006 1856L958.5 1831L1023.5 1712L1075.5 1743Z' },
    { id: '1-7', x: 60.08, y: 87.24, phase: '1', status: 'available', area: 646.3, path: 'M1316.5 1762L1282.5 1808.5L1197.5 1758L1231.5 1703.5L1316.5 1762Z' },
    { id: '1-6', x: 56.2, y: 83.71, phase: '1', status: 'available', area: 634.8, path: 'M1231.5 1670.5L1182 1751L1120.5 1712L1169.5 1633.5L1231.5 1670.5Z' },
    { id: '1-5', x: 52.71, y: 81.51, phase: '1', status: 'available', area: 638.2, path: 'M1154.5 1625L1108.5 1703.5L1050 1670.5L1098.5 1592.5L1154.5 1625Z' },
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

    // Dragging state references
    const isDragging = useRef(false);
    const startX = useRef(0);
    const startY = useRef(0);
    const scrollLeft = useRef(0);
    const scrollTop = useRef(0);
    const dragDistance = useRef(0);

    const handleMouseDown = (e) => {
        if (!isZoomed) return;
        isDragging.current = true;
        dragDistance.current = 0;
        startX.current = e.pageX - containerRef.current.offsetLeft;
        startY.current = e.pageY - containerRef.current.offsetTop;
        scrollLeft.current = containerRef.current.scrollLeft;
        scrollTop.current = containerRef.current.scrollTop;
    };

    const handleMouseLeave = () => {
        isDragging.current = false;
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current || !isZoomed) return;
        e.preventDefault();

        const x = e.pageX - containerRef.current.offsetLeft;
        const y = e.pageY - containerRef.current.offsetTop;

        const walkX = (x - startX.current) * 1.5;
        const walkY = (y - startY.current) * 1.5;

        // Track how far we've dragged to prevent click triggers when dropping
        dragDistance.current += Math.abs(x - startX.current) + Math.abs(y - startY.current);

        containerRef.current.scrollLeft = scrollLeft.current - walkX;
        containerRef.current.scrollTop = scrollTop.current - walkY;
    };

    const handleZoomToggle = (e) => {
        e.stopPropagation();

        // Prevent zooming out if the user was just dragging
        if (dragDistance.current > 20) {
            dragDistance.current = 0;
            return;
        }

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
            dragDistance.current = 0; // reset
        }
    };

    return (
        <div
            ref={containerRef}
            className={`w-full h-full max-h-[90vh] rounded-xl relative shadow-2xl shadow-black ring-1 ring-white/10 flex transition-all duration-300 ${isZoomed ? 'overflow-auto items-start justify-start cursor-grab active:cursor-grabbing bg-black/95 scrollbar-hide' : 'overflow-hidden items-center justify-center cursor-zoom-in bg-transparent scrollbar-hide'}`}
            onClick={handleZoomToggle}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
        >
            <img
                id={`zoom-img-${(alt || 'img').toString().replace(/\s+/g, '-')}`}
                src={src}
                alt={alt}
                draggable={false}
                className={`transition-transform duration-300 origin-[0_0] ${isZoomed ? 'w-[200%] md:w-[250%] max-w-none h-auto select-none pointer-events-none' : 'max-w-full max-h-[90vh] object-contain select-none'}`}
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

const NaverMap = ({ center, address, label }) => {
    const clientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_NAVER_MAP_CLIENT_SECRET;

    const level = 15;
    const width = 800;
    const height = 600;

    const markerParams = encodeURIComponent(`type:d|size:mid|pos:${center.replace(',', ' ')}|color:green`);
    const staticMapUrl = `https://maps.apigw.ntruss.com/map-static/v2/raster?w=${width}&h=${height}&center=${center}&level=${level}&X-NCP-APIGW-API-KEY-ID=${clientId}&X-NCP-APIGW-API-KEY=${clientSecret}&markers=${markerParams}`;

    const searchUrl = `https://map.naver.com/p/search/${encodeURIComponent(address)}`;

    return (
        <a
            className="block w-full h-full z-0 overflow-hidden relative cursor-pointer bg-slate-100 group shadow-inner"
            href={searchUrl}
            target="_blank"
            rel="noreferrer"
        >
            <img
                src={staticMapUrl}
                alt={`${label} 네이버 지도`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                    console.error("Static map load failed even with Server Secret key.");
                    e.target.src = `https://via.placeholder.com/800x600?text=API+Key+or+Domain+Error`;
                }}
            />
        </a>
    );
};

const App = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [selectedPlot, setSelectedPlot] = useState(null);
    const [isPanoOpen, setIsPanoOpen] = useState(false);
    const [expandedPanoImage, setExpandedPanoImage] = useState(null);

    const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '', interest: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const [isHighlightingPlots, setIsHighlightingPlots] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setExpandedPanoImage(prevExpanded => {
                    if (prevExpanded) {
                        return null;
                    } else {
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

    const calculateMappedArea = (plot) => {
        if (!plot || !plot.area) return '0.0';
        return plot.area.toFixed(1);
    };

    const scrollToContact = () => {
        const el = document.getElementById('contact-directions');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();

        const showToast = (type, text) => {
            setToastMessage({ type, text });
            setTimeout(() => setToastMessage(null), 3500);
        };

        // 1. 필수값 체크: 이름은 필수
        if (!formData.name.trim()) {
            showToast('error', '성함을 입력해주세요.');
            return;
        }

        // 2. 필수값 체크: 연락처나 이메일 중 하나는 필수
        if (!formData.phone.trim() && !formData.email.trim()) {
            showToast('error', '연락처 또는 이메일 중 하나는 반드시 입력해주세요.');
            return;
        }

        // 3. 연락처 정규식 검사 (숫자 및 하이픈 허용, 최소 9자리 이상)
        if (formData.phone.trim()) {
            const phoneRegex = /^[0-9-]{9,15}$/;
            if (!phoneRegex.test(formData.phone)) {
                showToast('error', '올바른 연락처 형식이 아닙니다. (예: 010-1234-5678)');
                return;
            }
        }

        // 4. 이메일 정규식 검사 (이메일이 입력된 경우에만)
        if (formData.email.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showToast('error', '올바른 이메일 형식이 아닙니다.');
                return;
            }
        }

        setIsSubmitting(true);

        const payload = {
            name: formData.name,
            phone: formData.phone || '미입력',
            email: formData.email || '미입력',
            interest: formData.interest || '미선택',
            message: formData.message || '남긴 메시지 없음',
        };

        try {
            const scriptUrl = "https://script.google.com/macros/s/AKfycbyk0_8jvzpCG6nh89gA-ovXOx88WxG4WqsN9Tpceo5YwMc-OA9cTD9Q6d3VIaWfjmMA/exec";

            await fetch(scriptUrl, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "text/plain",
                },
                body: JSON.stringify(payload)
            });

            showToast('success', '상담 신청이 완료되었습니다. 남겨주신 정보로 빠른 시일 내에 연락드리겠습니다.');
            setFormData({ name: '', phone: '', email: '', message: '', interest: '' });

            if (modalType === 'contact') {
                setTimeout(() => setModalType(null), 2500);
            }

        } catch (error) {
            console.error(error);
            showToast('error', '전송에 실패했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            {/* --- Top Info Bar (Not sticky) --- */}
            <div className="bg-[#122219] text-[#D4AF37] py-1.5 px-6 hidden md:block border-b border-white/5 relative z-50" data-nosnippet>
                <div className="container mx-auto flex justify-between items-center text-[12px] md:text-[13px] font-medium tracking-wide">
                    <p className="flex items-center gap-2">
                        <span className="bg-[#D4AF37] text-[#122219] px-2 py-0.5 rounded text-[10px] md:text-[11px] font-black tracking-widest leading-none mt-[1px]">NOTICE</span>
                        <span className="font-medium tracking-wide text-[#F9F9F7]">청주 최초 관리형 전원주택 단지, 단 46세대 프라이빗 분양 중</span>
                    </p>
                    <div className="flex gap-4 items-center opacity-90 text-[#F9F9F7]">
                        <span>분양 문의: <strong className="text-[#D4AF37] font-black">043-250-1120</strong></span>
                        <span className="opacity-30">|</span>
                        <span>이메일: <strong className="text-[#F9F9F7]">ecoalbero@naver.com</strong></span>
                    </div>
                </div>
            </div>

            {/* --- Sticky Header Wrapper --- */}
            <div className="sticky top-0 z-40 w-full shadow-md">
                {/* --- Header --- */}
                <nav data-nosnippet className={`w-full transition-all duration-300 ${scrolled
                    ? 'bg-[#1A2F23]/95 backdrop-blur-md shadow-lg border-b border-[#D4AF37]/20 relative' : 'bg-[#1A2F23] relative'}`}>

                    <div className="container mx-auto px-6 h-14 md:h-16 flex justify-between items-center relative z-10">
                        <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <img src={getAssetPath('eco_albero_logo.jpeg')} alt="Eco Albero Logo" className="h-8 md:h-10 w-auto rounded-md" />
                            <div className="h-4 md:h-5 w-[1px] bg-white/20 mx-0.5 md:mx-1 hidden sm:block"></div>
                            <div className="flex flex-col leading-none hidden sm:flex">
                                <span className="text-white font-black text-sm md:text-base tracking-tighter">에코알베로</span>
                                <span className="text-[#D4AF37] text-[8px] md:text-[9px] uppercase tracking-widest font-bold">Village</span>
                            </div>
                        </div>

                        <div className="hidden lg:flex items-center gap-3 xl:gap-8 text-[12px] xl:text-[14px] font-bold text-[#F9F9F7]/80">
                            <a href="#plots" className="hover:text-[#D4AF37] transition-colors whitespace-nowrap">부지현장</a>
                            <a href="#community" className="hover:text-[#D4AF37] transition-colors whitespace-nowrap">프리미엄 커뮤니티</a>
                            <a href="#location" className="hover:text-[#D4AF37] transition-colors whitespace-nowrap">입지환경</a>
                            <a href="#design-interior" className="hover:text-[#D4AF37] transition-colors whitespace-nowrap">맞춤형 설계</a>
                            <a href="#contact-directions" className="hover:text-[#D4AF37] transition-colors whitespace-nowrap">오시는 길</a>

                            <a href="tel:0432501120"
                                className="border border-[#D4AF37]/50 text-[#F9F9F7] px-4 py-1.5 md:py-2 rounded-full flex items-center gap-1 xl:gap-2 hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-[#1A2F23] transition-all whitespace-nowrap font-medium ml-2 shadow-sm shadow-[#D4AF37]/10">
                                <span className='text-[11px] xl:text-xs opacity-70 border-r border-white/20 pr-2 xl:pr-3 mr-1 xl:mr-2'>분양/상담</span>
                                <span className='flex items-center gap-1.5 leading-none text-sm xl:text-base font-bold'>
                                    <IconPhone className='w-3.5 h-3.5 xl:w-4 xl:h-4' /> 043-250-1120
                                </span>
                            </a>
                        </div>

                        <button className="lg:hidden p-2 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="4" x2="20" y1="12" y2="12" />
                                <line x1="4" x2="20" y1="6" y2="6" />
                                <line x1="4" x2="20" y1="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </nav>
                {/* --- Mobile Dropdown Menu --- */}
                {isMenuOpen && (
                    <div className="lg:hidden bg-white border-b border-slate-100 shadow-xl overflow-hidden px-6 py-4 flex flex-col gap-4 absolute top-full left-0 w-full z-40 transition-all origin-top">
                        <a href="#plots" className="text-slate-600 font-bold hover:text-[#064e3b] py-2" onClick={() => setIsMenuOpen(false)}>부지현장</a>
                        <a href="#location" className="text-slate-600 font-bold hover:text-[#064e3b] py-2" onClick={() => setIsMenuOpen(false)}>입지환경</a>
                        <a href="#design-interior" className="text-slate-600 font-bold hover:text-[#064e3b] py-2" onClick={() => setIsMenuOpen(false)}>맞춤형 설계</a>
                        <a href="#contact-directions" className="text-slate-600 font-bold hover:text-[#064e3b] py-2" onClick={() => setIsMenuOpen(false)}>오시는 길</a>
                        <button onClick={() => { scrollToContact(); setIsMenuOpen(false); }} className="bg-[#064e3b] text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#14532d] mt-2 w-full text-center">
                            문의하기
                        </button>
                    </div>
                )}
            </div>

            {/* --- Hero Section (Nature Background with smooth fade & overlap) --- */}
            <section className="relative min-h-[70vh] md:min-h-[85vh] flex flex-col items-center justify-center overflow-visible z-20 bg-[#1A2F23] pt-16 md:pt-24 transition-colors duration-1000">
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center -z-10 transition-all duration-1000"
                    style={{ backgroundImage: `url(${getAssetPath('nature_view_day.png')})`, backgroundPosition: 'center 75%' }}
                >
                    {/* Seamless fade to white background of the next section */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-white/90"></div>
                </div>

                <div className="container mx-auto px-6 relative flex flex-col items-center mt-[-2vh] text-white pb-24 md:pb-28">
                    <span className="text-[#FDE68A] font-bold tracking-[0.2em] text-xs md:text-sm mb-4 md:mb-5 drop-shadow-md bg-black/30 backdrop-blur-sm px-4 md:px-5 py-1.5 md:py-2 rounded-full border border-white/20 shadow-lg">
                        PREMIUM TOWNHOUSE VILLAGE
                    </span>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-sans break-keep leading-[1.2] mb-3 text-center drop-shadow-lg text-white">
                        퇴근 후 30분
                    </h2>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-sans break-keep leading-[1.2] mb-6 text-center drop-shadow-lg text-white">
                        도심의 소음이 숲의 숨소리로
                    </h2>

                    <p className="text-white/90 text-base md:text-lg font-medium leading-relaxed text-center mb-8 max-w-xl drop-shadow-md">
                        하이닉스·현대백화점 30분, 청남대 25분<br />
                        도심의 편리함과 자연의 평온함을 동시에 소유하세요
                    </p>
                </div>

                {/* Overlapping Info Card at bottom */}
                <div className="absolute bottom-0 translate-y-1/2 left-0 right-0 w-full px-4 md:px-6">
                    <div className="container mx-auto max-w-4xl">
                        {/* On mobile: grid cols 2. On desktop: flex row. */}
                        <div className="bg-white rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.06)] p-5 md:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 divide-x-0 md:divide-x divide-slate-100 border border-slate-100 relative bg-white/95 backdrop-blur-md">
                            <div className="flex flex-col items-center text-center px-2 md:px-4 w-full">
                                <span className="w-10 h-10 bg-[#F9F9F7] rounded-full flex items-center justify-center mb-2 text-[#1A2F23]">
                                    <IconCheck className="w-4 h-4" />
                                </span>
                                <span className="font-bold text-slate-900 text-[13px] md:text-sm mb-0.5">총 46필지</span>
                                <span className="text-[11px] md:text-xs text-slate-500 font-medium">단독 필지화</span>
                            </div>
                            <div className="flex flex-col items-center text-center px-2 md:px-4 w-full">
                                <span className="w-10 h-10 bg-[#F9F9F7] rounded-full flex items-center justify-center mb-2 text-[#1A2F23]">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                                </span>
                                <span className="font-bold text-slate-900 text-[13px] md:text-sm mb-0.5">남향 중심배치</span>
                                <span className="text-[11px] md:text-xs text-slate-500 font-medium">채광 우수 설계</span>
                            </div>
                            <div className="flex flex-col items-center text-center px-2 md:px-4 w-full pt-4 md:pt-0 border-t border-slate-100 md:border-t-0">
                                <span className="w-10 h-10 bg-[#F9F9F7] rounded-full flex items-center justify-center mb-2 text-[#1A2F23]">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect></svg>
                                </span>
                                <span className="font-bold text-slate-900 text-[13px] md:text-sm mb-0.5">자연 녹지</span>
                                <span className="text-[11px] md:text-xs text-slate-500 font-medium">10,000평+</span>
                            </div>
                            <div className="flex flex-col items-center text-center px-2 md:px-4 w-full pt-4 md:pt-0 border-t border-slate-100 md:border-t-0">
                                <span className="w-10 h-10 bg-[#F9F9F7] rounded-full flex items-center justify-center mb-2 text-[#1A2F23]">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                                </span>
                                <span className="font-bold text-slate-900 text-[13px] md:text-sm mb-0.5">직주근접</span>
                                <span className="text-[11px] md:text-xs text-slate-500 font-medium">프리미엄</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Interactive Plot Explorer (Horizontal Layout) --- */}
            <section id="plots" className="relative pt-24 md:pt-28 pb-12 lg:pb-16 flex items-center justify-center overflow-hidden bg-white z-10 border-b border-black/5">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#1A2F23]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="container mx-auto px-6 relative z-10 w-full max-w-[1400px]">
                    <div className="flex flex-col xl:flex-row items-center gap-10 xl:gap-14">
                        {/* --- Left Column: Copy & Actions --- */}
                        <div className="w-full xl:w-[45%] text-center xl:text-left flex flex-col justify-center order-2 xl:order-1">
                            <div className="inline-flex items-center gap-2 bg-amber-50 text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-1 rounded-full mb-4 md:mb-5 font-bold text-xs tracking-wide w-max mx-auto xl:mx-0 shadow-sm">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D4AF37]"></span>
                                </span>
                                단 46필지, 선택은 이미 시작되었습니다
                            </div>

                            <div className="mb-4 md:mb-6">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-[54px] text-slate-900 font-bold font-sans break-keep leading-[1.25] relative z-20">
                                    단 하나의 배치,
                                </h1>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-[54px] text-[#1A2F23] font-bold font-sans break-keep leading-[1.25] xl:mt-3 w-full xl:w-[130%] relative z-20 whitespace-normal sm:whitespace-nowrap">
                                    당신의 위치를 선택하세요
                                </h1>
                            </div>

                            <p className="text-slate-500 text-sm md:text-base mb-8 font-medium leading-relaxed max-w-xl mx-auto xl:mx-0">
                                <strong className="text-slate-800 tracking-wide text-base">숲세권 프리미엄 타운하우스, 에코알베로</strong><br />
                                단지 곳곳에 펼쳐지는 놀라운 전망과 녹지 공간을 확인해보세요. 원하시는 필지를 클릭하시면 실제 현장에 선 듯한 파노라마 뷰가 펼쳐집니다.
                            </p>

                            {/* Desktop Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center xl:justify-start">
                                <button onClick={() => {
                                    const plotsEl = document.getElementById('plots');
                                    if (plotsEl) {
                                        plotsEl.scrollIntoView({ behavior: 'smooth' });
                                        setIsHighlightingPlots(true);
                                        setTimeout(() => setIsHighlightingPlots(false), 2500);
                                    }
                                }}
                                    className="w-full sm:w-auto bg-[#1A2F23] text-white px-5 py-3 rounded-full font-bold text-sm hover:bg-[#0f1b14] shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-2">
                                    <IconMapPin className="w-4 h-4" /> 필지별 조망 확인하기
                                </button>
                                <button onClick={scrollToContact}
                                    className="w-full sm:w-auto bg-white border border-slate-200 text-slate-600 px-5 py-3 rounded-full font-bold text-sm hover:border-[#1A2F23] hover:text-[#1A2F23] transition-all flex items-center justify-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                    분양 상담 신청
                                </button>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-3 text-center xl:text-left">※ 모바일 기기에서도 동일하게 필지 뷰를 확인할 수 있습니다</p>
                        </div>

                        {/* --- Right Column: Interactive Plot Map --- */}
                        <div className="w-full xl:w-[55%] relative flex flex-col order-1 xl:order-2">
                            
                            {/* Mobile Promo Banner (Hidden on desktop) */}
                            <div className="md:hidden bg-[#1A2F23]/5 border border-[#D4AF37]/40 rounded-[14px] p-3 mb-4 flex flex-col gap-1.5 shadow-sm">
                                <div className="flex items-center gap-1.5 text-[#1A2F23]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#10b981]" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    <span className="text-[12px] font-black tracking-tight drop-shadow-sm">46필지 한정, 일부 필지 선택 진행 중</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[#1A2F23]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#10b981]" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    <span className="text-[12px] font-black tracking-tight drop-shadow-sm">좋은 위치는 먼저 선택됩니다</span>
                                </div>
                            </div>

                            {/* Interactive Container */}
                            <div className={`relative w-full rounded-[30px] border-8 shadow-2xl overflow-hidden bg-slate-100 group transition-all duration-500 ${isHighlightingPlots ? 'border-[#D4AF37] ring-4 ring-[#D4AF37]/40 scale-[1.01]' : 'border-slate-50'}`}>
                                <div className="absolute inset-0 pointer-events-none z-30 ring-1 ring-inset ring-black/10 rounded-[22px]"></div>

                                {isHighlightingPlots && (
                                    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none bg-black/10 backdrop-blur-[1px]">
                                        <div className="bg-[#D4AF37] text-slate-900 px-6 py-4 rounded-3xl shadow-2xl flex flex-col items-center animate-bounce border-4 border-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                                            <span className="font-black text-lg md:text-xl tracking-tight">원하시는 필지를 클릭해보세요!</span>
                                        </div>
                                    </div>
                                )}

                                {/* Promo Overlay on Left Empty Space (Desktop Only) */}
                                <div className="hidden md:block absolute top-6 left-6 z-40 pointer-events-none animate-in fade-in slide-in-from-left-4 duration-700">
                                    <div className="bg-white/85 backdrop-blur-md px-3 md:px-4 py-2.5 rounded-xl shadow-md border border-[#D4AF37]/30 flex flex-col gap-1.5 w-max">
                                        <div className="flex items-center gap-1.5 text-[#1A2F23]">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[#10b981]" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            <span className="text-[10px] md:text-xs font-black tracking-tight drop-shadow-sm">46필지 한정, 일부 필지 선택 진행 중</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[#1A2F23]">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[#10b981]" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            <span className="text-[10px] md:text-xs font-black tracking-tight drop-shadow-sm">좋은 위치는 먼저 선택됩니다</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '2112/2016' }}>
                                    {/* Map Zoom Wrapper */}
                                    <div className="absolute inset-0 w-full h-full origin-[62%_100%] scale-[1.3] md:scale-[1.35] transition-transform duration-[2000ms] ease-out group-hover:scale-[1.35] md:group-hover:scale-[1.4]">
                                        {/* Base Map Image */}
                                        <img
                                            src={getAssetPath('site_main_before_polygon.png')}
                                            alt="Master Plan Map"
                                            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                                        />
                                        <div className="absolute inset-0 bg-black/5 pointer-events-none group-hover:bg-transparent transition-colors duration-700"></div>

                                        {/* High-Precision SVG Interaction Layer */}
                                        <svg viewBox="0 0 2112 2016" className="absolute inset-0 w-full h-full z-10 select-none overflow-visible" preserveAspectRatio="none">
                                            {PLOTS.map(plot => (
                                                <g key={`poly-${plot.id}`} className={`pointer-events-auto group/poly ${plot.status === 'available' ? 'cursor-pointer' : 'cursor-default'}`}
                                                    onClick={() => {
                                                        if (plot.status === 'available') {
                                                            setSelectedPlot(plot); setIsPanoOpen(true);
                                                        }
                                                    }} >
                                                    <path d={plot.path}
                                                        className={`transition-all duration-300 ${plot.status === 'sold' ? 'fill-transparent stroke-transparent pointer-events-none' :
                                                            'fill-[#D4AF37]/10 stroke-[#D4AF37]/60 group-hover/poly:fill-[#D4AF37]/30 hover:stroke-[#D4AF37]'}
                                                        ${isHighlightingPlots && plot.status === 'available' ? 'animate-pulse fill-[#D4AF37]/40 stroke-[#D4AF37]' : ''}`}
                                                        strokeWidth="4" />
                                                </g>
                                            ))}
                                        </svg>

                                        {/* Visual Marker Labels */}
                                        <div className="absolute inset-0 pointer-events-none z-20">
                                            {PLOTS.map(plot => {
                                                if (plot.status === 'sold') {
                                                    return (
                                                        <div key={`label-${plot.id}`} className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 drop-shadow-md" style={getPathCenter(plot.path)}>
                                                            <div className="bg-gradient-to-r from-[#831843] to-[#e11d48] pl-[4px] pr-[7px] md:pl-[5px] md:pr-[9px] py-[1.5px] flex items-center justify-center border-l border-l-[#D4AF37]"
                                                                style={{ clipPath: 'polygon(0 0, 100% 0, 85% 50%, 100% 100%, 0 100%)', minHeight: '9px' }}>
                                                                <span className="text-white text-[4.5px] md:text-[5.5px] font-black tracking-widest whitespace-nowrap drop-shadow-sm ml-[1px] relative bottom-[0.2px]">분양완료</span>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return (
                                                    <div key={`label-${plot.id}`}
                                                        className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center shadow-md pointer-events-none backdrop-blur-[2px]
                                                            ${plot.status === 'management'
                                                                ? 'px-[5px] md:px-[6px] py-[2px] rounded-[5px] bg-[#F9F9F7E6] border border-[#1A2F23]/20'
                                                                : 'w-[15px] h-[15px] md:w-[19px] md:h-[19px] rounded-full text-[5.5px] md:text-[6.5px] text-slate-900 font-bold bg-white/95 border-[1px] border-slate-900 leading-none pt-[0.5px] tracking-tight'}`}
                                                        style={getPathCenter(plot.path)}>
                                                        {plot.status === 'management' ? (
                                                            <div className="flex items-center justify-center gap-[2.5px] mt-[0.5px]">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[8px] h-[8px] md:w-[10px] md:h-[10px] text-[#1A2F23] -mt-[1px]">
                                                                    <path fillRule="evenodd" d="M3 2.25a.75.75 0 01.75-.75h16.5a.75.75 0 01.75.75v18a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75v-18zM6 6a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 016 6zm0 3.75a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM8.25 12a.75.75 0 00-.75.75v1.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75v-1.5a.75.75 0 00-.75-.75h-1.5zm-2.25 5.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM12 6a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 0112 6zm0 3.75a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                                                                </svg>
                                                                <span className="text-[5.5px] md:text-[6.5px] font-black tracking-tight text-[#1A2F23]">사무동</span>
                                                            </div>
                                                        ) : plot.id}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* View Prompt Moved Outside */}
                            <div className="mt-4 flex justify-end w-full animate-in fade-in">
                                <div className="bg-white text-slate-800 px-5 py-3 rounded-full border border-slate-200 shadow-sm flex items-center gap-2 w-max">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] shadow-sm animate-pulse"></span>
                                    <span className="text-[12px] md:text-[14px] font-bold tracking-wide">원하시는 필지를 클릭하여 실제 뷰를 확인하세요</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Value Proposition: Premium Community --- */}
            <section id="community" className="py-16 lg:py-24 bg-[#F9F9F7] border-b border-black/5 overflow-hidden">
                <div className="container mx-auto px-6 max-w-[1280px]">

                    {/* Top Centered Title Block */}
                    <div className="text-center max-w-4xl mx-auto mb-12 lg:mb-16">
                        <span className="text-catalog-gold font-black tracking-[0.2em] text-xs md:text-sm mb-3 block">PRESTIGE COMMUNITY</span>
                        <div className="mb-4 space-y-2">
                            <h3 className="text-3xl md:text-4xl text-slate-900 font-bold font-sans break-keep leading-tight">거주하기 편한 아파트형 단지공용 시설</h3>
                            <h3 className="text-3xl md:text-4xl text-[#1A2F23] font-bold font-sans break-keep leading-tight">프리미엄 커뮤니티 완벽 특화</h3>
                        </div>
                        <p className="text-slate-500 text-base md:text-lg font-medium break-keep">삶의 질을 중시하며 독특한 Lifestyle을 창조하는 마을</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">

                        {/* Left Column: 4 Vertical Cards */}
                        <div className="w-full lg:w-5/12 xl:w-4/12 order-2 lg:order-1 flex flex-col justify-center pb-2 shrink-0">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-5 relative z-10 h-full min-h-[400px]">
                                {/* Community Feature 1 */}
                                <div className="p-5 md:p-6 lg:p-7 bg-white rounded-[1.5rem] border border-black/5 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-center h-full">
                                    <div className="flex items-center gap-4 mb-3 lg:mb-4">
                                        <div className="w-12 h-12 bg-[#1A2F23]/5 rounded-xl flex items-center justify-center text-[#1A2F23] group-hover:bg-[#1A2F23] group-hover:text-[#D4AF37] transition-colors shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                        </div>
                                        <h4 className="text-base md:text-[17px] font-bold text-slate-900 break-keep">관리사무동 운영</h4>
                                    </div>
                                    <p className="text-slate-500 text-[13px] leading-relaxed break-keep ml-1 lg:ml-0">단지관리인 상주를 통해 체계적인 서비스 제공</p>
                                </div>
                                {/* Convenience Facility 2 */}
                                <div className="p-5 md:p-6 lg:p-7 bg-white rounded-[1.5rem] border border-black/5 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-center h-full">
                                    <div className="flex items-center gap-4 mb-3 lg:mb-4">
                                        <div className="w-12 h-12 bg-[#1A2F23]/5 rounded-xl flex items-center justify-center text-[#1A2F23] group-hover:bg-[#1A2F23] group-hover:text-[#D4AF37] transition-colors shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                        </div>
                                        <h4 className="text-base md:text-[17px] font-bold text-slate-900 break-keep">24시간 무인편의점</h4>
                                    </div>
                                    <p className="text-slate-500 text-[13px] leading-relaxed break-keep ml-1 lg:ml-0">단지 안에서 언제든 이용 가능한 상가 편의점</p>
                                </div>
                                {/* Fitness 3 */}
                                <div className="p-5 md:p-6 lg:p-7 bg-white rounded-[1.5rem] border border-black/5 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-center h-full">
                                    <div className="flex items-center gap-4 mb-3 lg:mb-4">
                                        <div className="w-12 h-12 bg-[#1A2F23]/5 rounded-xl flex items-center justify-center text-[#1A2F23] group-hover:bg-[#1A2F23] group-hover:text-[#D4AF37] transition-colors shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                        </div>
                                        <h4 className="text-base md:text-[17px] font-bold text-slate-900 break-keep">주민 커뮤니티시설</h4>
                                    </div>
                                    <p className="text-slate-500 text-[13px] leading-relaxed break-keep ml-1 lg:ml-0">프리미엄 운동시설 및 문화 여가 공간 조성</p>
                                </div>
                                {/* Laundry 4 */}
                                <div className="p-5 md:p-6 lg:p-7 bg-white rounded-[1.5rem] border border-black/5 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-center h-full">
                                    <div className="flex items-center gap-4 mb-3 lg:mb-4">
                                        <div className="w-12 h-12 bg-[#1A2F23]/5 rounded-xl flex items-center justify-center text-[#1A2F23] group-hover:bg-[#1A2F23] group-hover:text-[#D4AF37] transition-colors shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                        </div>
                                        <h4 className="text-base md:text-[17px] font-bold text-slate-900 break-keep">무인 세탁소</h4>
                                    </div>
                                    <p className="text-slate-500 text-[13px] leading-relaxed break-keep ml-1 lg:ml-0">가정에서 하기 힘든 대형 빨래까지 해결 가능</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Visual Gallery (Uniform Dual Portraits) */}
                        <div className="w-full lg:w-7/12 xl:w-8/12 relative order-1 lg:order-2 pb-2">
                            {/* Decorative background circle */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#D4AF37]/10 rounded-full blur-[80px] z-0 pointer-events-none"></div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full h-full relative z-10 min-h-[500px] lg:min-h-0">
                                {/* Left Uniform Image */}
                                <div className="w-full h-full relative rounded-3xl overflow-hidden group min-h-[300px] sm:min-h-0 isolate">
                                    <img src={getAssetPath('community_lounge.png')} alt="하이엔드 커뮤니티" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 -z-10" />

                                    {/* Subtle Overlay Gradient */}
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent -z-10 pointer-events-none transition-opacity group-hover:opacity-90"></div>

                                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 lg:p-10 flex flex-col justify-end pointer-events-none">
                                        <div className="text-[#D4AF37]/90 font-bold font-sans text-[11px] md:text-xs tracking-[0.2em] mb-2 md:mb-3 uppercase ml-0.5">High-end Community</div>
                                        <div className="text-white text-lg md:text-xl lg:text-2xl font-bold font-sans leading-[1.3] tracking-tight break-keep drop-shadow-md">
                                            단지의 품격을 높이는<br />최신식 다목적 커뮤니티
                                        </div>
                                        <p className="text-[#D4AF37] text-[11px] md:text-xs font-bold mt-3 opacity-90 drop-shadow-md">* 커뮤니티시설은 착공 예정입니다</p>
                                    </div>
                                </div>

                                {/* Right Uniform Image */}
                                <div className="w-full h-full relative rounded-3xl overflow-hidden group min-h-[300px] sm:min-h-0 isolate">
                                    <img src={getAssetPath('smart_convenience.png')} alt="스마트 무인 시설" className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 -z-10" />

                                    {/* Subtle Overlay Gradient */}
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent -z-10 pointer-events-none transition-opacity group-hover:opacity-90"></div>

                                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 lg:p-10 flex flex-col justify-end pointer-events-none">
                                        <div className="text-[#D4AF37]/90 font-bold font-sans text-[11px] md:text-xs tracking-[0.2em] mb-2 md:mb-3 uppercase ml-0.5">Smart Facilities</div>
                                        <div className="text-white text-lg md:text-xl lg:text-2xl font-bold font-sans leading-[1.3] tracking-tight break-keep drop-shadow-md">
                                            생활의 여유를 더하는<br />편리한 24시 무인 시설
                                        </div>
                                        <p className="text-[#D4AF37] text-[11px] md:text-xs font-bold mt-3 opacity-90 drop-shadow-md">* 커뮤니티시설은 착공 예정입니다.</p>
                                    </div>
                                </div>
                            </div>

                            {/* 커뮤니티 안내 문구 */}
                            <div className="mt-5 text-center lg:text-right px-2">
                                <p className="text-[#1A2F23]/60 text-[12px] md:text-sm font-bold tracking-tight">※ 일부 시설은 단지 조성과 함께 순차적으로 완성됩니다.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* --- Nature Park Section --- */}
            <section className="py-16 lg:py-20 bg-white relative overflow-hidden">
                <div className="container mx-auto px-6 max-w-[1280px]">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
                        <div className="w-full lg:w-1/2 space-y-8 order-2 lg:order-1 relative z-10 pl-0 lg:pl-10">
                            <span className="text-[#7F7F7F] font-black tracking-[0.2em] text-xs md:text-sm">NATURE PARK VILLAGE</span>
                            <div className="mb-5 space-y-2">
                                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-[#2c2c2c] break-keep leading-tight">단지 안에서 누리는</h3>
                                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-[#055B49] break-keep leading-tight">10,000평 녹지 라이프</h3>
                            </div>
                            <p className="text-[#595959] text-base leading-relaxed font-medium mb-8">
                                단지 내 넉넉한 녹지와 산책 공간이 조성되어<br />
                                일상 속에서 자연을 가까이 누릴 수 있습니다.
                            </p>
                            <div className="space-y-4 pt-1">
                                <div className="flex items-center gap-4 border-b border-black/5 pb-4">
                                    <div className="w-6 h-6 rounded-full bg-[#f2e2ca] flex items-center justify-center text-[#d08a28] shrink-0">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                    <span className="text-[17px] font-bold text-[#2c2c2c]">단지 내 산책로 및 자연형 보행 동선 구성</span>
                                </div>
                                <div className="flex items-center gap-4 border-b border-black/5 pb-4">
                                    <div className="w-6 h-6 rounded-full bg-[#f2e2ca] flex items-center justify-center text-[#d08a28] shrink-0">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                    <span className="text-[17px] font-bold text-[#2c2c2c]">나무 그늘과 쉼 공간이 있는 휴식형 녹지</span>
                                </div>
                                <div className="flex items-center gap-4 border-b border-black/5 pb-4">
                                    <div className="w-6 h-6 rounded-full bg-[#f2e2ca] flex items-center justify-center text-[#d08a28] shrink-0">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                    <span className="text-[17px] font-bold text-[#2c2c2c]">안전하고 편안한 단지 내 숲길 산책로</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full bg-[#f2e2ca] flex items-center justify-center text-[#d08a28] shrink-0">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                    <span className="text-[17px] font-bold text-[#2c2c2c]">동남향, 정남향 중심 배치로 채광과 개방감 확보</span>
                                </div>
                            </div>

                            <div className="pt-10 flex justify-center lg:justify-start w-full">
                                <button onClick={scrollToContact}
                                    className="bg-gradient-to-r from-[#DBA644] to-[#C08A27] text-white px-10 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all w-full md:w-auto whitespace-nowrap shadow-md">
                                    지금 분양 문의하기
                                </button>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 relative order-1 lg:order-2">
                            {/* 10,000평 Floating Badge */}
                            <div className="absolute bottom-6 lg:bottom-16 left-4 lg:-left-10 z-30 bg-white/95 backdrop-blur-sm px-6 lg:px-8 py-4 lg:py-5 rounded-3xl shadow-2xl border border-white flex flex-col items-center shrink-0">
                                <div className="text-[28px] lg:text-[34px] font-black text-[#055B49] leading-none mb-1">10,000평+</div>
                                <div className="text-[#7F7F7F] font-bold text-xs lg:text-sm tracking-wide">자연 녹지 공간</div>
                            </div>
                            {/* Premium Masonry Gallery matching the design reference exactly */}
                            <div className="grid grid-cols-2 gap-4 lg:gap-5 relative z-10 w-full h-full pb-10">
                                {/* Left column: Vertical image lowered relative to right side */}
                                <div className="mt-16 sm:mt-24 h-full relative">
                                    <div className="relative rounded-3xl overflow-hidden shadow-2xl group w-full pt-[130%]">
                                        <img src={getAssetPath('lifestyle_3040.png')} alt="여유로운 주말 아침" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 md:p-6 pointer-events-none">
                                            <p className="text-white font-black text-sm md:text-base tracking-wide drop-shadow-md">여유로운 주말 아침</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right column: Two horizontal/square images stacked */}
                                <div className="space-y-4 lg:space-y-5">
                                    <div className="relative rounded-3xl overflow-hidden shadow-2xl group w-full pt-[90%]">
                                        <img src={getAssetPath('lifestyle_party.png')} alt="프라이빗 가든 파티" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 md:p-6 pointer-events-none">
                                            <p className="text-white font-black text-sm md:text-base tracking-wide drop-shadow-md">프라이빗 가든 파티</p>
                                        </div>
                                    </div>
                                    <div className="relative rounded-3xl overflow-hidden shadow-2xl group w-full pt-[90%]">
                                        <img src={getAssetPath('lifestyle_5060.png')} alt="자연과 함께하는 힐링" className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 md:p-6 pointer-events-none">
                                            <p className="text-white font-black text-sm md:text-base tracking-wide drop-shadow-md">자연과 함께하는 힐링</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative background shadow/glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#f5dfbc]/20 rounded-full blur-[100px] z-0 pointer-events-none"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Hi-Tech Section --- */}
            <section className="py-16 lg:py-20 bg-[#F9F9F7] text-slate-900 relative flex flex-col items-center justify-center overflow-hidden border-t border-black/5">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-60 filter blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1A2F23]/10 rounded-full opacity-60 filter blur-[100px] pointer-events-none"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <span className="text-[#1A2F23] font-black tracking-[0.2em] text-xs md:text-sm mb-3 block">SMART LIVING SYSTEM</span>
                    <div className="mb-5 space-y-2">
                        <h3 className="text-3xl md:text-4xl font-bold font-sans break-keep">전원생활의 불편함을 줄이는</h3>
                        <h3 className="text-3xl md:text-4xl font-bold font-sans break-keep text-[#1A2F23]">스마트 단지 관리 시스템</h3>
                    </div>
                    <p className="text-slate-500 text-sm md:text-base mb-12 font-medium max-w-4xl mx-auto">전원생활에서도 불편함 없이 생활할 수 있도록 보안과 생활 편의 시스템을 단지에 적용합니다.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-6xl mx-auto">

                        {/* Card 1: Solid Dark Green */}
                        <div className="bg-[#1A2F23] rounded-[1.5rem] p-6 md:p-8 shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center text-center group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 z-0"></div>
                            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white mb-5 shadow-sm group-hover:bg-[#D4AF37] group-hover:scale-110 transition-all duration-300 z-10 relative">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </div>
                            <h5 className="font-black text-lg text-white z-10 relative">단지 내 CCTV 운영</h5>
                            <p className="text-white/70 text-[13px] mt-2 leading-relaxed font-medium z-10 relative">사각지대 없는 24시간 안전 관리</p>
                        </div>

                        {/* Card 2: Pure White */}
                        <div className="bg-white rounded-[1.5rem] p-6 md:p-8 border border-black/5 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center text-center group">
                            <div className="w-14 h-14 rounded-full bg-[#F9F9F7] border border-black/5 flex items-center justify-center text-[#1A2F23] mb-5 shadow-sm group-hover:bg-[#1A2F23] group-hover:text-white group-hover:scale-110 transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            </div>
                            <h5 className="font-black text-lg text-slate-900">무인 경비 & 출동</h5>
                            <p className="text-slate-500 text-[13px] mt-2 leading-relaxed font-medium">외부 침입 대응 가능한 안전 환경</p>
                        </div>

                        {/* Card 3: Gold Border/Highlight */}
                        <div className="bg-[#F9F9F7] rounded-[1.5rem] p-6 md:p-8 border border-[#D4AF37]/30 shadow-lg shadow-[#D4AF37]/5 hover:shadow-2xl hover:shadow-[#D4AF37]/10 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center text-center group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent z-0"></div>
                            <div className="w-16 h-16 rounded-full bg-white border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] mb-4 shadow-sm group-hover:bg-[#D4AF37] group-hover:text-white group-hover:scale-110 transition-all duration-300 z-10 relative">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </div>
                            <h5 className="font-black text-lg text-slate-900 z-10 relative">스마트 출입 통제</h5>
                            <p className="text-slate-600 text-[13px] mt-2 leading-relaxed font-medium z-10 relative">입주민 중심의 안전한 출입 관리</p>
                        </div>

                        {/* Card 4: Dark Gradient with Gold Accent */}
                        <div className="bg-gradient-to-br from-[#1A2F23] to-[#0A120E] rounded-[1.5rem] p-6 md:p-8 shadow-xl border border-[#1A2F23] hover:border-[#D4AF37]/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center text-center group relative overflow-hidden">
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 z-0 pointer-events-none"></div>
                            <div className="w-14 h-14 rounded-full bg-[#1A2F23] border border-white/10 flex items-center justify-center text-[#D4AF37] mb-5 shadow-inner group-hover:bg-white group-hover:text-[#1A2F23] group-hover:border-white group-hover:scale-110 transition-all duration-300 z-10 relative">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            </div>
                            <h5 className="font-black text-lg text-white z-10 relative">전용 스마트앱 연동</h5>
                            <p className="text-[#D4AF37]/90 text-[13px] mt-2 leading-relaxed font-medium z-10 relative">조명·보안·시설 이용 통합 관리</p>
                        </div>

                    </div>
                </div>
            </section>

            {/* --- Location & Development (Combined) --- */}
            <section id="location" className="py-20 lg:py-28 bg-[#F9F9F7]">
                <div className="container mx-auto px-6 max-w-[1280px]">
                    <div className="flex flex-col xl:flex-row gap-16 xl:gap-24 items-center">

                        {/* Left Content (Text & List) */}
                        <div className="w-full xl:w-5/12">
                            <div className="mb-10 lg:mb-12">
                                <span className="text-[#1A2F23] font-black tracking-[0.2em] text-xs md:text-sm mb-4 block">PREMIUM LOCATION & VISION</span>
                                <h3 className="text-[26px] leading-[1.35] md:text-[38px] lg:text-[44px] font-black font-sans text-slate-900 break-keep mb-5 lg:mb-6 tracking-tight sm:whitespace-nowrap relative z-10 sm:w-max w-full">
                                    에코알베로의 미래 가치,<br />도로망 확장으로 완성됩니다
                                </h3>
                                <p className="text-slate-600 font-medium text-[15px] md:text-base leading-[1.7] break-keep">
                                    광역 교통망 확장으로 입지 가치가 지속 상승하며, 청주 중심을 누리는 30분 프리미엄 생활권입니다. 도심의 인프라와 자연의 쾌적함을 모두 누릴 수 있는 가장 현실적인 전원 입지를 자랑합니다.
                                </p>
                            </div>

                            <div className="space-y-6 md:space-y-7">
                                {/* Item 1 */}
                                <div className="flex gap-4 md:gap-5 items-start">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl shadow-sm border border-black/5 flex items-center justify-center text-[#1A2F23] shrink-0 mt-0.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="text-lg md:text-xl font-bold mb-1 text-slate-900">도로 확장 수혜</h5>
                                        <p className="text-slate-500 font-medium text-sm md:text-base break-keep leading-tight">교통 접근성 향상으로 토지 가치 상승 기대</p>
                                    </div>
                                </div>
                                {/* Item 2 */}
                                <div className="flex gap-4 md:gap-5 items-start">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl shadow-sm border border-black/5 flex items-center justify-center text-[#1A2F23] shrink-0 mt-0.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="text-lg md:text-xl font-bold mb-1 text-slate-900">프리미엄 핵심 생활권 30분</h5>
                                        <p className="text-slate-500 font-medium text-sm md:text-base break-keep leading-tight">청주의 핵심 인프라를 빠르게 연결하는 입지</p>
                                    </div>
                                </div>
                                {/* Item 3 */}
                                <div className="flex gap-4 md:gap-5 items-start">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl shadow-sm border border-black/5 flex items-center justify-center text-[#1A2F23] shrink-0 mt-0.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="text-lg md:text-xl font-bold mb-1 text-slate-900">단지 내 생활 인프라 완성</h5>
                                        <p className="text-slate-500 font-medium text-sm md:text-base break-keep leading-tight">24시간 편의시설과 관리 시스템으로 완성된 생활</p>
                                    </div>
                                </div>
                                {/* Item 4 */}
                                <div className="flex gap-4 md:gap-5 items-start">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl shadow-sm border border-black/5 flex items-center justify-center text-[#1A2F23] shrink-0 mt-0.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="text-lg md:text-xl font-bold mb-1 text-slate-900">교육 인프라 인접</h5>
                                        <p className="text-slate-500 font-medium text-sm md:text-base break-keep leading-tight">초등학교 차량 6분 거리, 안정적인 교육 환경</p>
                                    </div>
                                </div>
                                {/* Item 5 */}
                                <div className="flex gap-4 md:gap-5 items-start">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl shadow-sm border border-black/5 flex items-center justify-center text-[#1A2F23] shrink-0 mt-0.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="text-lg md:text-xl font-bold mb-1 text-slate-900">사통팔달 교통망</h5>
                                        <p className="text-slate-500 font-medium text-sm md:text-base break-keep leading-tight">청주·세종·대전을 연결하는 중심 입지</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content: 2 Interactive Map Catalogs */}
                        <div className="w-full xl:w-7/12 flex flex-col md:flex-row xl:flex-col gap-6 lg:gap-8">

                            {/* Map 1: Location */}
                            <div className="w-full relative group rounded-[1.5rem] md:rounded-[2rem] bg-white p-2 shadow-xl hover:shadow-2xl border border-black/5 cursor-pointer overflow-hidden transition-all duration-300" onClick={() => setExpandedPanoImage({ src: getAssetPath('location_left.webp'), label: '에코알베로 광역 입지 안내도' })}>
                                <div className="relative overflow-hidden rounded-[1rem] md:rounded-[1.5rem] aspect-video">
                                    <img src={getAssetPath('location_left.webp')} alt="광역 입지 안내도" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 bg-white" />
                                    <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent p-6 flex flex-col items-center justify-end text-center opacity-90 group-hover:opacity-100 transition-opacity">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="text-white/80 font-bold tracking-widest text-[10px] md:text-xs">PREMIUM LOCATION</div>
                                            <div className="flex items-center gap-2 text-white font-black text-sm md:text-base">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                                                광역 입지 안내도 크게 보기
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Map 2: Development info */}
                            <div className="w-full relative group rounded-[1.5rem] md:rounded-[2rem] bg-white p-2 shadow-xl hover:shadow-2xl border border-black/5 cursor-pointer overflow-hidden transition-all duration-300" onClick={() => setExpandedPanoImage({ src: getAssetPath('location_right.webp'), label: '주변 개발 및 신설 도로망 정보' })}>
                                <div className="relative overflow-hidden rounded-[1rem] md:rounded-[1.5rem] aspect-video animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                                    <img src={getAssetPath('location_right.webp')} alt="가치 개발 및 신설 도로망 정보" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 bg-white" />
                                    <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent p-6 flex flex-col items-center justify-end text-center opacity-90 group-hover:opacity-100 transition-opacity">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="text-white/80 font-bold tracking-widest text-[10px] md:text-xs">DEVELOPMENT VISION</div>
                                            <div className="flex items-center gap-2 text-white font-black text-sm md:text-base">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                                                호재 및 신설 도로망 크게 보기
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </section>

            {/* --- Custom Design & Signature Interior (Combined) --- */}
            <section id="design-interior" className="py-20 lg:py-28 bg-[#F9F9F7]">
                <div className="container mx-auto px-6 max-w-[1280px]">

                    {/* Header */}
                    <div className="text-center mb-12 md:mb-16">
                        <span className="text-[#D4AF37] font-black tracking-[0.2em] text-[11px] md:text-xs mb-4 block uppercase flex items-center justify-center gap-2">
                            PREMIUM INTERIOR
                        </span>
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-black font-sans text-slate-900 leading-[1.3] tracking-tight mb-4">
                            선택을 완성하는 <span className="bg-gradient-to-r from-[#D4AF37] to-[#B58B22] text-transparent bg-clip-text">프리미엄 인테리어</span>
                        </h3>
                        <p className="text-slate-600 font-bold text-sm md:text-base max-w-xl mx-auto break-keep leading-relaxed mb-6">
                            타입 선택 후 라이프스타일에 맞춘<br />
                            맞춤형 인테리어 설계 제공
                        </p>
                        <p className="text-slate-500 font-semibold text-[13px] md:text-sm bg-white inline-block px-5 py-2 rounded-full border border-[#D4AF37]/20 shadow-sm text-[#8a6f23]">
                            👆 분양 타입별 설계와 인테리어 예시를 확인해보세요
                        </p>
                    </div>

                    {/* 4 Architecture Types (Row) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6 mb-12">
                        {/* Type A */}
                        <div className="group cursor-pointer flex flex-col items-start bg-white p-4 md:p-5 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-black/5" onClick={() => setExpandedPanoImage({ src: getAssetPath('archi_sample_a.webp'), label: 'A TYPE' })}>
                            <div className="w-full aspect-[4/3] rounded-2xl bg-slate-50 overflow-hidden relative mb-5">
                                <img src={getAssetPath('archi_sample_a.webp')} className="w-full h-full object-cover object-top" alt="A타입" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <div className="bg-white/95 text-slate-800 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg scale-95 group-hover:scale-100 duration-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="text-[#1A2F23] font-black text-xs tracking-widest mb-1.5">A TYPE</div>
                            <h6 className="text-[17px] font-black text-slate-900 tracking-tight pb-2">모던 프리미엄 외관</h6>
                            <p className="text-slate-500 text-[13px] font-medium leading-[1.6] break-keep">
                                <span className="text-slate-400 mr-1">·</span>균형 잡힌 구조와 세련된 디자인<br />
                                <span className="text-slate-400 mr-1">·</span>실용성과 미감을 모두 고려한 공간
                            </p>
                        </div>

                        {/* Type B */}
                        <div className="group cursor-pointer flex flex-col items-start bg-white p-4 md:p-5 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-black/5" onClick={() => setExpandedPanoImage({ src: getAssetPath('archi_sample_b.webp'), label: 'B TYPE' })}>
                            <div className="w-full aspect-[4/3] rounded-2xl bg-slate-50 overflow-hidden relative mb-5">
                                <img src={getAssetPath('archi_sample_b.webp')} className="w-full h-full object-cover object-top" alt="B타입" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <div className="bg-white/95 text-slate-800 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg scale-95 group-hover:scale-100 duration-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="text-[#1A2F23] font-black text-xs tracking-widest mb-1.5">B TYPE</div>
                            <h6 className="text-[17px] font-black text-slate-900 tracking-tight pb-2">자연 친화형 설계</h6>
                            <p className="text-slate-500 text-[13px] font-medium leading-[1.6] break-keep">
                                <span className="text-slate-400 mr-1">·</span>자연 채광과 환기를 고려한 구조<br />
                                <span className="text-slate-400 mr-1">·</span>숲과 어우러지는 편안한 주거 환경
                            </p>
                        </div>

                        {/* Type C */}
                        <div className="group cursor-pointer flex flex-col items-start bg-white p-4 md:p-5 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-black/5" onClick={() => setExpandedPanoImage({ src: getAssetPath('archi_sample_c.webp'), label: 'C TYPE' })}>
                            <div className="w-full aspect-[4/3] rounded-2xl bg-slate-50 overflow-hidden relative mb-5">
                                <img src={getAssetPath('archi_sample_c.webp')} className="w-full h-full object-cover object-top" alt="C타입" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <div className="bg-white/95 text-slate-800 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg scale-95 group-hover:scale-100 duration-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="text-[#1A2F23] font-black text-xs tracking-widest mb-1.5">C TYPE</div>
                            <h6 className="text-[17px] font-black text-slate-900 tracking-tight pb-2">하이엔드 테라스형</h6>
                            <p className="text-slate-500 text-[13px] font-medium leading-[1.6] break-keep">
                                <span className="text-slate-400 mr-1">·</span>개방감 높은 설계와 프라이빗 테라스<br />
                                <span className="text-slate-400 mr-1">·</span>자연과 연결된 프리미엄 라이프
                            </p>
                        </div>

                        {/* Type D */}
                        <div className="group cursor-pointer flex flex-col items-start bg-white p-4 md:p-5 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-black/5" onClick={() => setExpandedPanoImage({ src: getAssetPath('archi_sample_d.webp'), label: 'D TYPE' })}>
                            <div className="w-full aspect-[4/3] rounded-2xl bg-slate-50 overflow-hidden relative mb-5">
                                <img src={getAssetPath('archi_sample_d.webp')} className="w-full h-full object-cover object-top" alt="D타입" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <div className="bg-white/95 text-slate-800 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg scale-95 group-hover:scale-100 duration-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="text-[#1A2F23] font-black text-xs tracking-widest mb-1.5">D TYPE</div>
                            <h6 className="text-[17px] font-black text-slate-900 tracking-tight pb-2">프리미엄 최고급 설계</h6>
                            <p className="text-slate-500 text-[13px] font-medium leading-[1.6] break-keep">
                                <span className="text-slate-400 mr-1">·</span>고급 마감과 완성도 높은 공간 구성<br />
                                <span className="text-slate-400 mr-1">·</span>차별화된 주거 가치 실현
                            </p>
                        </div>
                    </div>

                    {/* Connecting Connective Text */}
                    <div className="text-center mb-12 relative max-w-4xl mx-auto">
                        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent -z-10"></div>
                        <p className="inline-block text-[#9a7b21] font-black text-[13px] md:text-[15px] bg-[#F9F9F7] px-8 py-2.5 rounded-full border border-[#D4AF37]/30 shadow-sm tracking-wide">
                            타입 선택 후 라이프스타일에 맞춘 맞춤형 인테리어 설계 제공
                        </p>
                    </div>

                    <div className="text-center mb-10 w-full flex flex-col items-center justify-center bg-white py-12 px-6 rounded-[2rem] shadow-sm border border-slate-100 max-w-5xl mx-auto relative overflow-hidden">
                        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
                        <h4 className="text-[26px] md:text-3xl lg:text-4xl font-black font-sans text-slate-900 mb-4 tracking-tight">
                            원하는 공간과 스타일을 <span className="text-[#D4AF37]">선택</span>하세요
                        </h4>
                        <p className="text-slate-600 font-bold text-[15px] md:text-lg break-keep mb-5 leading-relaxed">
                            <span className="text-[#b9952e]">최고급 마감재</span>와 <span className="text-[#b9952e]">트렌디한 공간 설계</span>로<br />
                            일상의 가치를 높이는 하이엔드 라이프를 선사합니다.
                        </p>
                        <div className="bg-[#F9F9F7] px-6 py-3 rounded-full border border-slate-200 shadow-sm">
                            <p className="text-slate-700 font-black text-[13.5px] md:text-[15px] break-keep flex items-center justify-center gap-2">
                                <span className="text-[#D4AF37] text-lg leading-none">※</span> 전문 분양상담사가 1:1 맞춤 설계를 안내해드립니다
                            </p>
                        </div>
                    </div>

                    {/* 2 Interior Highlights (Kitchen / Window) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
                        {/* Kitchen Highlight */}
                        <div className="group cursor-pointer rounded-[2rem] overflow-hidden bg-slate-900 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative" onClick={() => setExpandedPanoImage({ src: getAssetPath('interior_kitchen.webp'), label: '럭셔리 다이닝 & 오픈 키친' })}>
                            <div className="relative aspect-[4/3] md:aspect-[16/11] lg:aspect-[16/10] overflow-hidden">
                                <img src={getAssetPath('interior_kitchen.webp')} alt="Premium Kitchen" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
                                    <div className="bg-white/95 text-slate-800 p-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-2xl scale-95 group-hover:scale-100 duration-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full pointer-events-none">
                                    <div className="bg-[#1A2F23]/95 backdrop-blur-sm shadow-md text-white text-[10px] md:text-[11px] font-bold px-3 py-1.5 rounded-full w-max mb-3 tracking-widest uppercase">KITCHEN</div>
                                    <h4 className="text-2xl md:text-[26px] font-black font-sans text-white mb-2.5 leading-tight drop-shadow-lg tracking-tight">럭셔리 다이닝 & 오픈 키친</h4>
                                    <p className="text-white/90 font-medium text-xs md:text-sm leading-relaxed drop-shadow-md break-keep">
                                        넓은 동선 설계로 개방감 극대화<br />가족 중심의 소통형 주방 공간
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Window Highlight */}
                        <div className="group cursor-pointer rounded-[2rem] overflow-hidden bg-slate-900 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative" onClick={() => setExpandedPanoImage({ src: getAssetPath('interior_window.webp'), label: '채광 특화 파노라마 윈도우' })}>
                            <div className="relative aspect-[4/3] md:aspect-[16/11] lg:aspect-[16/10] overflow-hidden">
                                <img src={getAssetPath('interior_window.webp')} alt="Premium Window" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
                                    <div className="bg-white/95 text-slate-800 p-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-2xl scale-95 group-hover:scale-100 duration-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full pointer-events-none">
                                    <div className="bg-[#D4AF37]/90 backdrop-blur-sm shadow-md text-slate-900 text-[10px] md:text-[11px] font-bold px-3 py-1.5 rounded-full w-max mb-3 tracking-widest uppercase">LIVING</div>
                                    <h4 className="text-2xl md:text-[26px] font-black font-sans text-white mb-2.5 leading-tight drop-shadow-lg tracking-tight">채광 특화 파노라마 윈도우</h4>
                                    <p className="text-white/90 font-medium text-xs md:text-sm leading-relaxed drop-shadow-md break-keep">
                                        대형 창 구조로 자연 채광 극대화<br />자연을 실내로 들이는 거실 설계
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
            {/* --- Contact & Directions (Consolidated) --- */}
            <section id="contact-directions" className="py-12 md:py-20 bg-[#F9F9F7] relative overflow-hidden text-center flex items-center min-h-[100vh]">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1A2F23] rounded-full blur-[150px] opacity-10 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-[1100px] flex flex-col items-center">
                    <div className="bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col lg:flex-row relative text-left w-full border border-slate-100">
                        {/* Left Side: Map & Contact Info */}
                        <div className="lg:w-[45%] bg-[#1A2F23] p-5 sm:p-7 lg:p-10 flex flex-col relative z-30 lg:min-h-full rounded-t-[32px] sm:rounded-t-[40px] lg:rounded-l-[40px] lg:rounded-tr-none">
                            {/* Map Moved UP (Takes up visual focus immediately) */}
                            <div className="w-full h-[180px] lg:h-[240px] rounded-2xl lg:rounded-[1.5rem] overflow-hidden border border-white/10 relative cursor-pointer mb-5 shadow-xl shrink-0">
                                <div className="absolute inset-0 bg-black/10 transition-colors pointer-events-none z-10"></div>
                                <NaverMap
                                    label="에코알베로"
                                    address="충북 청주시 상당구 남일면 고은리 산 35-2번지 일원"
                                    center="127.5255,36.5638"
                                />
                                <div className="absolute bottom-2 left-2 flex gap-1.5 w-full pr-4 z-20">
                                    <a href="https://map.naver.com/v5/search/충북 청주시 상당구 남일면 고은리 산 35-2" target="_blank" rel="noopener noreferrer" className="bg-white text-slate-900 text-[10px] sm:text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-slate-100 transition-colors shadow-lg">
                                        <div className="w-4 h-4 bg-[#03C75A] text-white rounded-[5px] flex items-center justify-center font-black leading-none text-[10px] pb-[1px]">N</div>
                                        네이버 지도
                                    </a>
                                    <a href="https://map.kakao.com/link/search/충북 청주시 상당구 남일면 고은리 산 35-2" target="_blank" rel="noopener noreferrer" className="bg-[#1A2F23]/80 backdrop-blur-md text-white border border-white/20 text-[10px] sm:text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-[#1A2F23] transition-colors shadow-lg">
                                        카카오맵
                                    </a>
                                </div>
                            </div>

                            {/* Title & Info Below Map */}
                            <div className="flex flex-col flex-1 justify-between">
                                <div>
                                    <h3 className="text-[28px] lg:text-[34px] font-black tracking-tight leading-tight mb-5 text-white">
                                        지금 바로 문의하세요
                                    </h3>

                                    <div className="flex flex-col gap-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 lg:w-9 lg:h-9 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full flex items-center justify-center border border-[#D4AF37]/30 shrink-0">
                                                <IconPhone className="w-4 h-4 lg:w-4.5 lg:h-4.5" />
                                            </div>
                                            <span className="text-lg lg:text-xl font-bold tracking-tight text-white">043-250-1120</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 lg:w-9 lg:h-9 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full flex items-center justify-center border border-[#D4AF37]/30 shrink-0 mt-0.5 lg:mt-0">
                                                <IconMapPin className="w-4 h-4 lg:w-4.5 lg:h-4.5" />
                                            </div>
                                            <span className="text-sm lg:text-[15px] font-bold tracking-wide text-white leading-snug lg:pt-1">
                                                충북 청주시 상당구 남일면 고은리 산 35-2 일원
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-5 border-t border-white/10 w-full flex items-center justify-between">
                                    <span className="text-[#A3B8B0] text-xs font-bold tracking-widest hidden sm:inline-block">ECOALBERO</span>
                                    <a href="https://blog.naver.com/ecoalbero" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#fff] hover:text-[#D4AF37] transition-colors text-xs lg:text-[13px] font-bold group bg-white/5 px-4 py-2 rounded-xl border border-white/10 shrink-0">
                                        <div className="bg-[#03C75A] p-1 rounded-md">
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-white"><path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z" /></svg>
                                        </div>
                                        공식 네이버 블로그
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Form */}
                        <form onSubmit={handleEmailSubmit} className="lg:w-[55%] p-5 sm:p-7 lg:p-10 flex flex-col justify-center bg-white h-full relative z-20">
                            <div className="space-y-4 lg:space-y-6 flex flex-col h-full justify-center">
                                {/* Name, Phone, Email in 3 columns for desktop, stack on mobile */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
                                    <div className="space-y-1 relative">
                                        <input type="text" placeholder="성함 *"
                                            value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full border-b-2 border-slate-100 pb-2.5 outline-none focus:border-[#1A2F23] font-bold text-sm lg:text-[15px] px-1 placeholder:font-semibold placeholder:text-slate-400 bg-transparent text-[#1A2F23] transition-colors" />
                                    </div>
                                    <div className="space-y-1 relative">
                                        <input type="tel" placeholder="연락처 *"
                                            value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full border-b-2 border-slate-100 pb-2.5 outline-none focus:border-[#1A2F23] font-bold text-sm lg:text-[15px] px-1 placeholder:font-semibold placeholder:text-slate-400 bg-transparent text-[#1A2F23] transition-colors" />
                                    </div>
                                    <div className="space-y-1 relative">
                                        <input type="email" placeholder="이메일"
                                            value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full border-b-2 border-slate-100 pb-2.5 outline-none focus:border-[#1A2F23] font-bold text-sm lg:text-[15px] px-1 placeholder:font-semibold placeholder:text-slate-400 bg-transparent text-[#1A2F23] transition-colors" />
                                    </div>
                                </div>

                                <div className="space-y-2 lg:space-y-3 pt-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">상담 항목</label>
                                    <div className="flex flex-wrap gap-2 lg:gap-2.5">
                                        {['방문 상담', '기업 상담', '필지 문의', '분양 문의', '기타'].map((item) => (
                                            <button key={item} type="button"
                                                onClick={() => setFormData({ ...formData, interest: item })}
                                                className={`px-3 lg:px-4 py-2 lg:py-2.5 text-[12px] lg:text-[13px] rounded-xl border-2 font-bold transition-all whitespace-nowrap ${formData.interest === item ? 'border-[#1A2F23] text-[#1A2F23] bg-[#1A2F23]/5 shadow-sm' : 'border-slate-100 text-slate-500 hover:border-slate-300 hover:text-slate-800 bg-white'}`}>
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2 pt-1 relative">
                                    <textarea placeholder="선택 사항이나 궁금하신 점을 작성해주세요."
                                        value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        rows="2"
                                        className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-[#1A2F23] font-medium text-[12px] resize-none bg-slate-50 focus:bg-white placeholder:text-slate-400" />
                                </div>

                                <div className="pt-2">
                                    <button type="submit" disabled={isSubmitting}
                                        className="w-full flex items-center justify-center bg-gradient-to-r from-[#1A2F23] to-[#2C4A3A] text-white rounded-xl font-black text-[14px] hover:from-[#13241A] hover:to-[#22392C] disabled:opacity-80 transition-all shadow-md shadow-[#1A2F23]/20 h-[44px]">
                                        {isSubmitting ? (
                                            <div className="absolute inset-0 flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span className="text-[11px]">안전하게 전송 중입니다...</span>
                                            </div>
                                        ) : (
                                            '상담 신청하기'
                                        )}
                                    </button>
                                    <p className="text-center mt-2.5 text-slate-400 text-[9px] font-bold w-full uppercase tracking-wider">가입 시 개인정보 수집 및 이용에 동의하는 것으로 간주합니다.</p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
            {/* --- Footer --- */}
            <footer className="bg-white py-20 border-t border-slate-100">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                        <div className="flex items-center gap-3">
                            <img src={getAssetPath('eco_albero_logo.jpeg')} alt="Eco Albero Logo" className="h-10 w-auto rounded-md grayscale opacity-80" />
                            <div className="text-[#1A2F23] font-black text-2xl tracking-[0.1em]">ECOALBERO</div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-slate-400 font-bold text-sm">
                            <button onClick={() => setModalType('terms')} className="hover:text-slate-900 transition-colors">이용약관</button>
                            <button onClick={() => setModalType('privacy')} className="hover:text-slate-900 transition-colors">개인정보처리방침</button>
                            <a href="#contact-directions" className="hover:text-slate-900 transition-colors">오시는길</a>
                            <a href="https://blog.naver.com/ecoalbero" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors flex items-center gap-1">
                                공식 블로그
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            </a>
                        </div>
                    </div>
                    <div className="mt-12 pt-12 border-t border-slate-50 text-center md:text-left space-y-4">
                        <p className="text-slate-400 text-sm leading-relaxed font-medium">
                            <span className="font-bold text-slate-500">시행사</span> : 주식회사 와운 &nbsp;|&nbsp; <span className="font-bold text-slate-500">시공사</span> : <a href="http://www.igong.co.kr/" target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 underline">(주)이공건축</a><br />
                            <span className="font-bold text-slate-500">사무실</span> : 충북 청주시 상당구 수암로54번길 8 3층 주식회사 와운 &nbsp;|&nbsp; <span className="font-bold text-slate-500">현장위치</span> : 충북 청주시 상당구 남일면 고은리 산 35-2번지 일원 (현장사무소 & 견본주택)<br />
                            <span className="font-bold text-slate-500">분양문의</span> : 043-250-1120 &nbsp;|&nbsp; ecoalbero@naver.com
                        </p>
                        <p className="text-slate-400 text-sm leading-relaxed font-medium">
                            ※ 본 사이트의 조감도 및 CG는 소비자의 이해를 돕기 위한 것으로 실제 시공 시 인허가 과정이나 현장 여건에 따라 변경될 수 있습니다.
                        </p>
                        <p className="mt-6 text-slate-300 text-xs uppercase tracking-widest">© 2026 ECOALBERO. ALL RIGHTS RESERVED.</p>
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
                                        <p className="text-sm">본 약관은 에코알베로 분양 홍보 사이트(이하 "사이트")가 제공하는 서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.</p>
                                    </section>
                                    <section className="space-y-3">
                                        <h6 className="text-slate-900 font-bold">제 2 조 (정보의 한계 및 변경)</h6>
                                        <p className="text-sm">본 사이트에 사용된 조감도, CG, 이미지, 평면도 등은 소비자의 이해를 돕기 위해 제작된 것으로 실제 시공 시 인허가 과정이나 현장 여건에 따라 변경될 수 있습니다.</p>
                                    </section>
                                    <section className="space-y-3">
                                        <h6 className="text-slate-900 font-bold">제 3 조 (저작권의 귀속)</h6>
                                        <p className="text-sm">사이트에 게재된 모든 콘텐츠(이미지, 텍스트, 로고 등)에 대한 저작권은 에코알베로 및 분양 대행사에 귀속되며, 무단 복제 및 배포를 금합니다.</p>
                                    </section>
                                </>
                            ) : (
                                <>
                                    <section className="space-y-3">
                                        <h6 className="text-slate-900 font-bold">1. 개인정보의 수집 및 이용 목적</h6>
                                        <p className="text-sm">수집된 개인정보는 에코알베로 분양 상담, 방문 예약 확인, 분양 관련 정보 제공(전화, SMS) 및 마케팅 활용을 위해 사용됩니다.</p>
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
                                    ].map((img, index) => (
                                        <div
                                            key={index}
                                            className="relative aspect-video rounded-xl overflow-hidden group/thumb cursor-pointer hover:ring-2 hover:ring-catalog-gold transition-all"
                                            onClick={() => setExpandedPanoImage(img)}
                                        >
                                            <img src={img.src} alt={img.label} className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-700" />
                                            <div className="absolute inset-0 bg-black/30 group-hover/thumb:bg-transparent transition-colors duration-300 z-10"></div>
                                            <div className="absolute bottom-3 left-3 z-20 bg-black/80 px-3 py-1.5 rounded-lg text-white text-xs md:text-sm font-bold backdrop-blur-md border border-white/20">{img.label}</div>

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
                                <h2 className="text-3xl font-serif text-white mb-6">{selectedPlot.id} 필지</h2>

                                <div className="space-y-6">
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                                        <div className="text-sm font-bold text-catalog-gold">분양 면적</div>
                                        <div className="text-xl font-light text-white">{calculateMappedArea(selectedPlot)} <span className="text-sm text-white/50">m²</span></div>
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

                            <div className="mt-8 space-y-3">
                                <button
                                    onClick={() => {
                                        setIsPanoOpen(false);
                                        setTimeout(() => scrollToContact(), 100);
                                    }}
                                    className="w-full py-4 bg-catalog-gold text-catalog-dark font-bold hover:bg-white transition-colors duration-300 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-catalog-gold/20"
                                >
                                    <IconCheck />
                                    상담 신청하기
                                </button>
                                <a
                                    href="tel:043-250-1120"
                                    className="w-full py-4 bg-white/5 border border-white/20 text-white font-bold hover:bg-white/10 transition-colors duration-300 rounded-xl flex items-center justify-center gap-2"
                                >
                                    <IconPhone />
                                    전화로 바로 문의
                                </a>
                            </div>
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

            {/* Custom Toast Notification */}
            {toastMessage && (
                <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-4 rounded-full shadow-2xl z-[10000] flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 font-bold tracking-wide text-sm md:text-base ${toastMessage.type === 'error' ? 'bg-rose-500 text-white' : 'bg-[#059669] text-white'
                    }`}>
                    {toastMessage.type === 'error' ? (
                        <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    ) : (
                        <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    )}
                    {toastMessage.text}
                </div>
            )}
        </div>
    );
};

export default App;