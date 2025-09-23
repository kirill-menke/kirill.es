#!/usr/bin/env bash

# Convert images (JPG, PNG, HEIC) to WebP format with resize and delete options
# Usage: ./convert_to_webp.sh [options]

# Default values
DIR="."
QUALITY="85"
MAX_WIDTH="2560"  # QHD screen width
DELETE_ORIGINAL=false
CONVERTED=0
FAILED=0
RESIZED=0

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Help function
show_help() {
    echo "Image to WebP Converter with Resize"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -d, --dir PATH        Directory containing images (default: current)"
    echo "  -q, --quality NUM     WebP quality 1-100 (default: 85)"
    echo "  -w, --width NUM       Max width in pixels (default: 2560 for QHD)"
    echo "  -r, --delete          Delete original files after conversion"
    echo "  -h, --help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                           # Convert with defaults"
    echo "  $0 -d /path/to/images -q 90 # Custom dir and quality"
    echo "  $0 -w 1920 -r               # Resize to 1920px and delete originals"
    exit 0
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -d|--dir)
            DIR="$2"
            shift 2
            ;;
        -q|--quality)
            QUALITY="$2"
            shift 2
            ;;
        -w|--width)
            MAX_WIDTH="$2"
            shift 2
            ;;
        -r|--delete)
            DELETE_ORIGINAL=true
            shift
            ;;
        -h|--help)
            show_help
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Use -h or --help for usage information"
            exit 1
            ;;
    esac
done

echo "==================================="
echo "Image to WebP Converter"
echo "==================================="
echo "Directory: $DIR"
echo "WebP quality: $QUALITY%"
echo "Max width: ${MAX_WIDTH}px (QHD)"
echo "Delete originals: $DELETE_ORIGINAL"
echo "==================================="

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo -e "${RED}Error: ImageMagick is not installed${NC}"
    echo "Install with: sudo apt-get install imagemagick (Ubuntu/Debian)"
    echo "           : brew install imagemagick (macOS)"
    exit 1
fi

# Check if directory exists
if [ ! -d "$DIR" ]; then
    echo -e "${RED}Error: Directory '$DIR' not found${NC}"
    exit 1
fi

# Safety check for deletion
if [ "$DELETE_ORIGINAL" = true ]; then
    echo -e "${YELLOW}WARNING: Original files will be deleted after conversion!${NC}"
    read -p "Continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 0
    fi
fi

# Find and convert all image files
find "$DIR" -maxdepth 1 \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.heic" \) | while read -r file; do
    # Get filename without extension
    filename=$(basename "$file")
    name="${filename%.*}"
    output="$DIR/${name}.webp"
    
    # Skip if WebP already exists
    if [ -f "$output" ]; then
        echo -e "${YELLOW}Skipping: $filename (WebP already exists)${NC}"
        continue
    fi
    
    # Get image dimensions
    width=$(identify -format "%w" "$file" 2>/dev/null)
    height=$(identify -format "%h" "$file" 2>/dev/null)
    
    # Prepare resize option
    resize_option=""
    resize_info=""
    
    if [ -n "$width" ] && [ "$width" -gt "$MAX_WIDTH" ]; then
        resize_option="-resize ${MAX_WIDTH}x"
        new_width=$MAX_WIDTH
        new_height=$((height * MAX_WIDTH / width))
        resize_info="${BLUE}[${width}x${height} → ${new_width}x${new_height}]${NC} "
        RESIZED=$((RESIZED + 1))
    fi
    
    # Convert to WebP with optional resize
    if [ -n "$resize_info" ]; then
        echo -en "Converting: $filename ${BLUE}${resize_info}${NC}... "
    else
        echo -n "Converting: $filename ... "
    fi
    
    convert "$file" $resize_option -quality "$QUALITY" -strip "$output" 2>/dev/null;

    # Get file sizes for comparison
    original_size=$(du -h "$file" | cut -f1)
    new_size=$(du -h "$output" | cut -f1)
    echo -e "${GREEN}✓${NC} ($original_size → $new_size)"
    ((CONVERTED++))
    
    # Delete original if requested
    if [ "$DELETE_ORIGINAL" = true ]; then
        rm "$file"
    fi

done

# Summary
echo "==================================="
echo -e "${GREEN}Converted: $CONVERTED files${NC}"
if [ $RESIZED -gt 0 ]; then
    echo -e "${BLUE}Resized: $RESIZED files${NC}"
fi
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}Failed: $FAILED files${NC}"
fi
if [ "$DELETE_ORIGINAL" = true ] && [ $CONVERTED -gt 0 ]; then
    echo -e "${YELLOW}Deleted: $CONVERTED original files${NC}"
fi

# Note for HEIC files
if find "$DIR" -maxdepth 1 -iname "*.heic" | grep -q .; then
    echo ""
    echo -e "${YELLOW}Note: HEIC conversion requires ImageMagick with HEIC support${NC}"
    echo "If HEIC files failed, install: sudo apt-get install libheif-examples"
fi