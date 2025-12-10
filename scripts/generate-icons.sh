#!/bin/bash
# Script to generate PWA icons in all required sizes from the master icon

# Create icons directory if it doesn't exist
mkdir -p public/icons

# Check if we have the master icon
if [ ! -f "public/orbit-icon-master.png" ]; then
    echo "❌ Master icon not found at public/orbit-icon-master.png"
    echo "Please place your 1024x1024 master icon there first."
    exit 1
fi

# Check if ImageMagick or sips is available
if command -v sips &> /dev/null; then
    echo "✅ Using sips (macOS built-in) to generate icons..."
    
    # Array of sizes needed for PWA
    sizes=(72 96 128 144 152 192 384 512)
    
    for size in "${sizes[@]}"
    do
        echo "Generating ${size}x${size} icon..."
        sips -z $size $size public/orbit-icon-master.png --out "public/icons/icon-${size}x${size}.png" > /dev/null 2>&1
    done
    
    # Create apple-touch-icon (180x180 is standard for iOS)
    echo "Generating apple-touch-icon..."
    sips -z 180 180 public/orbit-icon-master.png --out "public/apple-touch-icon.png" > /dev/null 2>&1
    
    # Create favicon
    echo "Generating favicon..."
    sips -z 32 32 public/orbit-icon-master.png --out "public/favicon-32x32.png" > /dev/null 2>&1
    sips -z 16 16 public/orbit-icon-master.png --out "public/favicon-16x16.png" > /dev/null 2>&1
    
    echo "✅ All icons generated successfully!"
    
elif command -v convert &> /dev/null; then
    echo "✅ Using ImageMagick to generate icons..."
    
    # Array of sizes needed for PWA
    sizes=(72 96 128 144 152 192 384 512)
    
    for size in "${sizes[@]}"
    do
        echo "Generating ${size}x${size} icon..."
        convert public/orbit-icon-master.png -resize ${size}x${size} "public/icons/icon-${size}x${size}.png"
    done
    
    # Create apple-touch-icon
    echo "Generating apple-touch-icon..."
    convert public/orbit-icon-master.png -resize 180x180 "public/apple-touch-icon.png"
    
    # Create favicon
    echo "Generating favicon..."
    convert public/orbit-icon-master.png -resize 32x32 "public/favicon-32x32.png"
    convert public/orbit-icon-master.png -resize 16x16 "public/favicon-16x16.png"
    
    echo "✅ All icons generated successfully!"
else
    echo "❌ Neither sips nor ImageMagick found."
    echo "On macOS, sips should be built-in. If it's not working, install ImageMagick:"
    echo "  brew install imagemagick"
    exit 1
fi

echo ""
echo "📱 Icon generation complete!"
echo "Icons created in public/icons/"
echo "Apple touch icon created as public/apple-touch-icon.png"
echo "Favicons created as public/favicon-*.png"
