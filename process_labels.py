
import re

def get_center(path_str):
    """Calculate centroid of a path."""
    points = re.findall(r'([-+]?\d*\.\d+|\d+)', path_str)
    pts = [float(p) for p in points]
    xs = pts[0::2]
    ys = pts[1::2]
    if not xs or not ys: return 0, 0
    return sum(xs)/len(xs), sum(ys)/len(ys)

def process_vector_labels(file_path):
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Extract paths from vector_polygon.txt
    # This file has fill="white", likely the text background boxes
    path_tags = re.findall(r'<path[^>]*>', content)
    label_locs = []
    
    # Source dimensions from vector_polygon.txt (0 0 846 1147)
    src_w, src_h = 846, 1147
    # Target dimensions (App)
    tgt_w, tgt_h = 2112, 2016
    
    for tag in path_tags:
        match = re.search(r'd="([^"]+)"', tag)
        if match:
            d = match.group(1)
            cx, cy = get_center(d)
            
            # Transform coordinates to 2112x2016 space
            # Note: We need to check if 846x1147 aligns with 2112x2016 linearly
            # or if it needs stretching. Assuming simple stretch for now.
            
            tx = (cx / src_w) * tgt_w
            ty = (cy / src_h) * tgt_h
            
            # Determine x, y percentages for CSS
            x_pct = (tx / tgt_w) * 100
            y_pct = (ty / tgt_h) * 100
            
            label_locs.append({'x': x_pct, 'y': y_pct})
            
    print(f"Extracted {len(label_locs)} label locations.")
    
    # Print formatted for easy copy-paste to PLOTS update logic if needed,
    # or just raw data to map.
    # Since we need to match them to IDs (1-1...9-5), we assume they are in the same order
    # as the PLOTS array (which came from polygon.txt).
    # Let's hope order is consistent: 9-x, 8-x, 7-x ... 1-x
    
    print("const LABEL_COORDS = [")
    for loc in label_locs:
        print(f"    {{ x: {loc['x']:.2f}, y: {loc['y']:.2f} }},")
    print("];")

if __name__ == "__main__":
    process_vector_labels('/Users/kade93/workspaces/eco-albero/vector_polygon.txt')
