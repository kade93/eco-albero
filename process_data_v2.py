
import re

def get_center(path_str):
    points = re.findall(r'([-+]?\d*\.\d+|\d+)', path_str)
    pts = [float(p) for p in points]
    xs = pts[0::2]
    ys = pts[1::2]
    if not xs or not ys: return 0, 0
    return sum(xs)/len(xs), sum(ys)/len(ys)

def analyze_paths_robust(file_path):
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Split content by '<path' to handle potential parsing issues
    fragments = content.split('<path')
    
    target_paths = []
    
    for frag in fragments[1:]: # Skip first empty chunk
        # Reconstruct tag start
        tag_content = '<path' + frag.split('>')[0] + '>'
        
        if 'stroke="black"' in tag_content:
            match = re.search(r'd="([^"]+)"', tag_content)
            if match:
                target_paths.append(match.group(1))
    
    print(f"Robust Scan Found: {len(target_paths)} paths")
    
    data = []
    view_w, view_h = 2112, 2016
    
    for i, path in enumerate(target_paths):
        cx, cy = get_center(path)
        x_pct = (cx / view_w) * 100
        y_pct = (cy / view_h) * 100
        data.append({'idx': i, 'x': x_pct, 'y': y_pct, 'path': path})
        
    print(f"{'IDX':<5} | {'X (%)':<10} | {'Y (%)':<10}")
    print("-" * 30)
    for p in data:
        print(f"{p['idx']:<5} | {p['x']:<10.2f} | {p['y']:<10.2f}")

if __name__ == "__main__":
    analyze_paths_robust('/Users/kade93/workspaces/eco-albero/polygon.txt')
