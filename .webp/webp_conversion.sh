#!/usr/bin/env bash

find . -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) -print0 |
while IFS= read -r -d '' file; do
    output="${file%.*}.webp"

    if [[ -f "$output" ]]; then
        echo "Skipping: $output already exists"
        continue
    fi

    echo "Converting: $file -> $output"
    if cwebp -q 90 -quiet "$file" -o "$output"; then
        rm "$file"
    else
        echo "FAILED: $file" >&2
    fi
done