#!/usr/bin/env bash
set -euo pipefail

# Re-encode experience-enabler videos to an Edge-safe MP4 profile.
# - Input:  public/assets/experience-enablers/*.mp4
# - Output: public/assets/experience-enablers-reencoded/*.mp4

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
INPUT_DIR="${ROOT_DIR}/public/assets/experience-enablers"
OUTPUT_DIR="${ROOT_DIR}/public/assets/experience-enablers-reencoded"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "Error: ffmpeg not found in PATH."
  exit 1
fi

mkdir -p "${OUTPUT_DIR}"

shopt -s nullglob
inputs=("${INPUT_DIR}"/*.mp4)
shopt -u nullglob

if [ "${#inputs[@]}" -eq 0 ]; then
  echo "No MP4 files found in ${INPUT_DIR}"
  exit 1
fi

echo "Re-encoding ${#inputs[@]} files..."

for input in "${inputs[@]}"; do
  filename="$(basename "${input}")"
  output="${OUTPUT_DIR}/${filename}"

  echo " -> ${filename}"
  ffmpeg -y -hide_banner -loglevel error \
    -i "${input}" \
    -map 0:v:0 -map 0:a:0? \
    -c:v libx264 \
    -preset medium \
    -crf 20 \
    -profile:v high \
    -level 4.1 \
    -pix_fmt yuv420p \
    -movflags +faststart \
    -c:a aac \
    -b:a 128k \
    -ar 48000 \
    -ac 2 \
    "${output}"
done

echo ""
echo "Done."
echo "Output folder: ${OUTPUT_DIR}"
