
import re

def get_center(path_str):
    """Calculate the center (centroid) of a polygon path manually."""
    # Extract all numbers from the path string
    points = re.findall(r'([-+]?\d*\.\d+|\d+)', path_str)
    # Convert to floats
    pts = [float(p) for p in points]
    
    # Separate x and y coordinates
    # SVG path commands like M, L don't consume numbers, so we just take every pair
    # However, we need to be careful about commands.
    # Simple approach: assume M x y L x y ... format where numbers are just coords.
    xs = pts[0::2]
    ys = pts[1::2]
    
    if not xs or not ys:
        return 0, 0
    
    # Calculate geometric center (centroid)
    center_x = sum(xs) / len(xs)
    center_y = sum(ys) / len(ys)
    
    return center_x, center_y

def process_polygon_file(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    # Extract all path d attributes
    # Looking for <path d="..." stroke="black"/> pattern mainly, as those are the plot outlines
    # The filled white paths are likely the base shapes, but the stroked ones are the outlines we want.
    # Based on the user's snippet, relevant paths have 'stroke="black"'
    
    # Regex to find paths with stroke="black"
    # It might vary, so let's look for d="..." then check if the tag contains stroke="black"
    
    # Better approach: Find all <path ... /> tags, then parse each to see if it's a target path
    path_tags = re.findall(r'<path[^>]*>', content)
    
    target_paths = []
    
    for tag in path_tags:
        if 'stroke="black"' in tag:
            match = re.search(r'd="([^"]+)"', tag)
            if match:
                target_paths.append(match.group(1))
    
    print(f"Found {len(target_paths)} target paths.")
    
    # Now we need to map these paths to IDs.
    # We will use the centroid to sort and map them.
    # Let's clean up the list first.
    
    # Define mapping strategy
    # Plots are generally organized in blocks.
    # We can try to cluster them or just sort them generally if we know the order in the file matches the ID order.
    # If the file order is random, we MUST use coordinates.
    
    # Let's inspect the coordinates of the first few to guess the order.
    # Section 9 is usually top-right or specific area.
    
    plot_data = []
    for path in target_paths:
        cx, cy = get_center(path)
        plot_data.append({'path': path, 'cx': cx, 'cy': cy})

    # Sort logic: 
    # This is tricky without knowing the exact layout logic.
    # But usually, they are grouped by section (1, 2, ... 9).
    # Let's try to group them by spatial proximity.
    
    # Defined Clusters (approximate centers based on previous data/visuals if possible, 
    # but here we'll try to find natural groups)
    
    # Let's just output them with their coordinates first to analyze, 
    # OR apply the mapping from previous knowledge:
    # 9-1 to 9-5 (5 plots)
    # 8-1 to 8-4 (4 plots)
    # 7-1 to 7-3 (3 plots)
    # 6-1 to 6-5 (5 plots)
    # 5-1 to 5-6 (6 plots)
    # 4-1 to 4-5 (5 plots)
    # 3-1 to 3-4 (4 plots) - Wait, previous file had 4 plots for section 3.
    # 2-1 to 2-6 (6 plots)
    # 1-1 to 1-8 (8 plots)
    
    # Total: 5+4+3+5+6+5+4+6+8 = 46 plots.
    
    if len(target_paths) != 46:
        print(f"Warning: Expected 46 plots, found {len(target_paths)}. Mapping might be misaligned.")
    
    # We will sort by Y first (Top to Bottom), then X (Left to Right) to try and assign IDs sequentially?
    # Or maybe sections are distinct enough.
    
    # Let's assume the order in the file MIGHT be relevant, OR we sort spatially.
    # Previous manual mapping strategy in `process_paths.py` (lines 66-74) suggested:
    # 0-4: 9-x
    # 5-8: 8-x
    # ...
    # Let's try to verify this hypothesis with the new file.
    
    # Let's sort the plot_data based on the order they appear in the file (which is effectively preserved in the list)
    # and assign IDs based on the assumed block order from the previous `process_paths.py` which seemed to match the user's provided snippet order.
    
    # Defined sequence of counts for each phase
    phase_counts = [
        ('9', 5),
        ('8', 4),
        ('7', 3),
        ('6', 5),
        ('5', 6),
        ('4', 5),
        ('2', 6), # Note: 2 comes before 3 in the file structure observed previously? Or was it visual?
                  # In the file snippet you gave earlier:
                  # 9-x (lines 4-8), 8-x (lines 9-12), 7-x (lines 13-15), 6-x (lines 16-20), 5-x (lines 21-26), 4-x (lines 27-31), 2-x (lines 32-37), 3-x (38-41), 1-x (42-49)
        ('3', 4),
        ('1', 8)
    ]
    
    # Let's re-verify the snippet order from `process_paths.py` (Step 155):
    # It followed exactly that order. So we will assume the file `polygon.txt` has the strokes in that order.
    
    final_plots = []
    current_idx = 0
    
    view_w = 2112 # New ViewBox Width
    view_h = 2016 # New ViewBox Height
    
    for phase, count in phase_counts:
        # Get the chunk of plots for this phase
        chunk = plot_data[current_idx : current_idx + count]
        
        # Sort within the phase?
        # Usually numbered visually.
        # e.g. 1-1 to 1-8. 
        # Let's assume for now we just map them 1..n based on file order, 
        # but user mentioned "3-1 to 3-5 problems", implying specific ID mapping matters.
        # Step 184 correction for 3-x: "Re-ordered based on y-coordinate (Top to Bottom)"
        # 3-1 (Top) ... 3-4 (Bottom)
        
        # For Section 1: "1-1 is ... 1-2 is ..."
        
        # Let's try a generic sort for all:
        # Most numbering logic:
        # Top-Left to Bottom-Right? Or specific path flow?
        # Let's keep file order by default, but applying the specific Fix for 3-x derived earlier.
        
        # Assign IDs
        for i, p in enumerate(chunk):
            p['id'] = f"{phase}-{i+1}"
            p['phase'] = phase
            
            # Calculate % coordinates for placement
            p['x_pct'] = round((p['cx'] / view_w) * 100, 2)
            p['y_pct'] = round((p['cy'] / view_h) * 100, 2)
            
            final_plots.append(p)
            
        current_idx += count

    # Output JS format
    print("const PLOTS = [")
    for p in final_plots:
        print(f"    {{ id: '{p['id']}', x: {p['x_pct']}, y: {p['y_pct']}, phase: '{p['phase']}', path: '{p['path']}' }},")
    print("];")

if __name__ == "__main__":
    process_polygon_file('/Users/kade93/workspaces/eco-albero/polygon.txt')
