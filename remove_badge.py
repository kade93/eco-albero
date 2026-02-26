from PIL import Image, ImageFilter, ImageDraw
import os

def mask_golden_label(img_path):
    img = Image.open(img_path)
    
    # Take a very large patch from the right side to ensure total coverage
    patch_w, patch_h = 1000, 400
    # Coordinates for source patch on the right
    src_x = 1100
    src_y = 0
    
    patch = img.crop((src_x, src_y, src_x + patch_w, src_y + patch_h))
    patch = patch.transpose(Image.FLIP_LEFT_RIGHT)
    
    # We will paste it at (0, 0)
    target_x = -50
    target_y = -50
    
    # Create a soft mask for blending, but make the solid white part very large
    mask = Image.new('L', patch.size, 0)
    draw = ImageDraw.Draw(mask)
    
    # Make the inner solid rectangle cover all the way up to x=800, y=300 in the target
    # Since pasting at -50, -50, the mask solid part should go up to 850, 350
    draw.rectangle([0, 0, 850, 350], fill=255)
    
    # Apply blur so the edges blend seamlessly with the forest, but the top-left remains 100% solid
    mask = mask.filter(ImageFilter.GaussianBlur(30))
    
    img.paste(patch, (target_x, target_y), mask)
    img.save(img_path)
    print("Fixed image saved!")

if __name__ == "__main__":
    mask_golden_label('/Users/kade93/workspaces/eco-albero/public/site_main_before_polygon.png')
