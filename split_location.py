import os
from PIL import Image

Image.MAX_IMAGE_PIXELS = None

def split_and_optimize(input_path, output_left, output_right, max_dim=2560):
    try:
        print(f"Processing {input_path}...")
        img = Image.open(input_path)
        
        # Convert to RGB if it has alpha channel
        if img.mode in ('RGBA', 'P'):
            img = img.convert('RGB')
            
        width, height = img.size
        mid = width // 2
        
        left_img = img.crop((0, 0, mid, height))
        right_img = img.crop((mid, 0, width, height))
        
        # Optimize dimensions
        def resize_if_needed(image):
            w, h = image.size
            if max(w, h) > max_dim:
                ratio = max_dim / max(w, h)
                new_size = (int(w * ratio), int(h * ratio))
                return image.resize(new_size, Image.Resampling.LANCZOS)
            return image
            
        left_img = resize_if_needed(left_img)
        right_img = resize_if_needed(right_img)
        
        # Save as webp
        left_img.save(output_left, 'WEBP', quality=85)
        right_img.save(output_right, 'WEBP', quality=85)
        print(f"Successfully split into {output_left} and {output_right}")
        
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

if __name__ == "__main__":
    split_and_optimize(
        "reference_catalog/location.jpg",
        "public/location_left.webp",
        "public/location_right.webp"
    )
