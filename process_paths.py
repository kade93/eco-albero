import re

svg_text = """
<path d="M535.593 651.678L501.593 585.178L562.593 550.678L609.593 646.678L535.593 651.678Z" stroke="black"/>
<path d="M636.593 638.178L582.593 541.178L636.593 508.678L689.093 612.178L636.593 638.178Z" stroke="black"/>
<path d="M713.093 600.678L662.093 498.678L731.093 462.678L772.593 541.178L713.093 600.678Z" stroke="black"/>
<path d="M799.093 531.178L755.593 450.678L824.093 414.678L867.593 493.178L799.093 531.178Z" stroke="black"/>
<path d="M887.093 476.178L845.093 403.178L917.093 359.678L935.093 456.178L887.093 476.178Z" stroke="black"/>
<path d="M478.093 246.178L426.593 149.178L478.093 122.678L528.093 216.678L478.093 246.178Z" stroke="black"/>
<path d="M551.593 205.678L499.093 110.678L562.093 76.6785L608.093 172.678L551.593 205.678Z" stroke="black"/>
<path d="M631.593 163.178L580.593 69.1785L642.593 36.1785L688.093 131.178L631.593 163.178Z" stroke="black"/>
<path d="M708.593 122.678L663.593 26.6785L708.593 0.678467L764.093 92.6785L708.593 122.678Z" stroke="black"/>
<path d="M178.593 293.178L188.593 277.178L249.093 244.178L303.593 338.178L173.593 403.178L153.093 356.178L178.593 293.178Z" stroke="black"/>
<path d="M324.093 326.678L272.593 230.178L328.593 200.678L380.593 298.678L324.093 326.678Z" stroke="black"/>
<path d="M400.093 288.178L350.593 192.178L400.093 162.178L451.093 254.178L400.093 288.178Z" stroke="black"/>
<path d="M125.093 547.178L133.593 592.678L266.593 531.678L207.093 425.678L166.093 448.178L125.093 547.178Z" stroke="black"/>
<path d="M239.593 448.178L286.093 520.678L347.093 482.178L303.093 406.178L239.593 448.178Z" stroke="black"/>
<path d="M357.093 386.178L402.093 462.678L448.593 438.678L402.093 357.678L357.093 386.178Z" stroke="black"/>
<path d="M426.093 346.678L464.593 425.678L519.593 397.678L475.593 319.678L426.093 346.678Z" stroke="black"/>
<path d="M494.093 307.178L539.093 386.178L590.093 357.678L539.093 280.178L494.093 307.178Z" stroke="black"/>
<path d="M656.593 449.178L616.093 369.678L669.593 344.678L707.093 425.678L656.593 449.178Z" stroke="black"/>
<path d="M730.593 412.678L686.093 332.178L730.593 304.178L776.593 383.678L730.593 412.678Z" stroke="black"/>
<path d="M800.593 369.678L758.593 294.178L810.093 266.178L855.093 344.678L800.593 369.678Z" stroke="black"/>
<path d="M603.593 344.678L559.093 266.178L616.093 244.178L656.593 323.678L603.593 344.678Z" stroke="black"/>
<path d="M676.093 308.178L638.593 232.678L686.093 205.178L730.593 283.178L676.093 308.178Z" stroke="black"/>
<path d="M746.093 266.178L707.093 193.678L758.593 164.678L800.593 244.178L746.093 266.178Z" stroke="black"/>
<path d="M371.593 754.678L329.093 674.678L404.593 635.178L449.593 720.178L410.593 764.678L371.593 754.678Z" stroke="black"/>
<path d="M449.593 702.678L410.593 627.178L481.093 591.678L519.093 665.178L449.593 702.678Z" stroke="black"/>
<path d="M449.593 555.178L410.593 480.178L454.093 453.678L497.593 529.178L449.593 555.178Z" stroke="black"/>
<path d="M519.093 516.178L481.093 443.178L524.593 416.678L563.593 492.178L519.093 516.178Z" stroke="black"/>
<path d="M590.093 480.178L547.593 404.178L594.593 375.678L635.593 453.678L590.093 480.178Z" stroke="black"/>
<path d="M405.593 576.178L363.593 494.178L299.093 526.678L343.593 611.178L405.593 576.178Z" stroke="black"/>
<path d="M322.593 620.678L280.093 538.678L213.593 570.178L259.093 649.678L322.593 620.678Z" stroke="black"/>
<path d="M240.593 661.678L196.093 576.178L137.593 620.678L175.093 694.178L240.593 661.678Z" stroke="black"/>
<path d="M291.093 694.178L190.093 748.178L291.093 817.178L322.593 758.678L291.093 694.178Z" stroke="black"/>
<path d="M336.593 780.678L272.093 873.178L329.593 908.178L385.593 827.678L336.593 780.678Z" stroke="black"/>
<path d="M396.093 840.678L343.593 917.678L417.093 959.678L454.593 908.178L396.093 840.678Z" stroke="black"/>
<path d="M180.593 1016.18L112.593 1122.18L8.59314 1040.18V942.178H126.593L138.593 980.178L180.593 1016.18Z" stroke="black"/>
<path d="M126.593 862.178V922.178H8.59314V862.178H126.593Z" stroke="black"/>
<path d="M129.093 770.678L126.593 842.178H8.59314V770.678H129.093Z" stroke="black"/>
<path d="M102.093 676.178L126.593 751.178H8.59314L0.59314 721.178L102.093 676.178Z" stroke="black"/>
<path d="M276.093 832.678L193.093 975.178L168.593 952.678L180.593 764.178L276.093 832.678Z" stroke="black"/>
<path d="M337.093 1221.18L457.593 1257.68L466.593 1225.68L437.093 1165.68L392.093 1129.18L337.093 1221.18Z" stroke="black"/>
<path d="M378.093 1121.18L322.093 1221.18L255.593 1196.18L322.093 1087.18L378.093 1121.18Z" stroke="black"/>
<path d="M305.593 1081.68L243.093 1191.68L191.093 1165.68L255.593 1049.18L305.593 1081.68Z" stroke="black"/>
<path d="M243.093 1041.18L173.593 1154.18L126.093 1129.18L191.093 1010.18L243.093 1041.18Z" stroke="black"/>
<path d="M484.093 1060.18L450.093 1106.68L365.093 1056.18L399.093 1001.68L484.093 1060.18Z" stroke="black"/>
<path d="M399.093 968.678L349.593 1049.18L288.093 1010.18L337.093 931.678L399.093 968.678Z" stroke="black"/>
<path d="M322.093 923.178L276.093 1001.68L217.593 968.678L266.093 890.678L322.093 923.178Z" stroke="black"/>
"""

paths = re.findall(r'd="([^"]+)"', svg_text)

def get_center(path_str):
    points = re.findall(r'([-+]?\d*\.\d+|\d+)', path_str)
    pts = [float(p) for p in points]
    xs = pts[0::2]
    ys = pts[1::2]
    if not xs or not ys: return 0, 0
    return sum(xs)/len(xs), sum(ys)/len(ys)

view_w = 936
view_h = 1259

# Manual mapping logic based on systematic observation
# 0-4: Section 9 (Red) 9-1 to 9-5
# 5-8: Section 8 (Lime) 8-1 to 8-4
# 9-11: Section 7 (Brown) 7-1 to 7-3
# 12-16: Section 6 (Cyan) 6-1 to 6-5
# 17-19: Section 5 (Pink) 5-1 to 5-3
# 20-22: Section 5 (Pink) 5-4 to 5-6
# 23-27: Section 4 (Blue) 4-1 to 4-5
# 28-33: Section 2 (Orange) 2-1 to 2-6
# 34-37: Section 3 (Green) 3-4 down to 3-1 (actually 38, 37, 36, 35 in SVG likely)
# Wait, let's re-verify 12-16: 12 is (180, 508), 13 is (293, 464)...
# Actually let's just use my last logic but verify 3-1 to 3-4.

mapping = []
for i in range(5): mapping.append({'id': f'9-{i+1}', 'phase': '9', 'idx': i})
for i in range(4): mapping.append({'id': f'8-{i+1}', 'phase': '8', 'idx': i+5})
for i in range(3): mapping.append({'id': f'7-{i+1}', 'phase': '7', 'idx': i+9})
for i in range(5): mapping.append({'id': f'6-{i+1}', 'phase': '6', 'idx': i+12})
for i in range(6): mapping.append({'id': f'5-{i+1}', 'phase': '5', 'idx': i+17})
for i in range(5): mapping.append({'id': f'4-{i+1}', 'phase': '4', 'idx': i+23})
for i in range(6): mapping.append({'id': f'2-{i+1}', 'phase': '2', 'idx': i+28})

# Section 3: y order 1016, 862, 770, 676 maps to 3-4, 3-3, 3-2, 3-1
mapping.append({'id': '3-4', 'phase': '3', 'idx': 34})
mapping.append({'id': '3-3', 'phase': '3', 'idx': 35})
mapping.append({'id': '3-2', 'phase': '3', 'idx': 36})
mapping.append({'id': '3-1', 'phase': '3', 'idx': 37})

# Section 1: Purple
mapping.append({'id': '1-5', 'phase': '1', 'idx': 38})
mapping.append({'id': '1-1', 'phase': '1', 'idx': 39})
mapping.append({'id': '1-2', 'phase': '1', 'idx': 40})
mapping.append({'id': '1-3', 'phase': '1', 'idx': 41})
mapping.append({'id': '1-4', 'phase': '1', 'idx': 42})
mapping.append({'id': '1-8', 'phase': '1', 'idx': 43})
mapping.append({'id': '1-7', 'phase': '1', 'idx': 44})
mapping.append({'id': '1-6', 'phase': '1', 'idx': 45})

mapping.sort(key=lambda x: (int(x['id'].split('-')[0]), int(x['id'].split('-')[1])))

print("const PLOTS = [")
for m in mapping:
    path_str = paths[m['idx']]
    cx, cy = get_center(path_str)
    x_pct = round((cx / view_w) * 100, 1)
    y_pct = round((cy / view_h) * 100, 1)
    print(f"    {{ id: '{m['id']}', x: {x_pct}, y: {y_pct}, phase: '{m['phase']}', path: '{path_str}' }},")
print("];")
