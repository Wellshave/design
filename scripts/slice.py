#!/usr/bin/env python3
"""Slice the extended Groom Guard PRO drive into a scroll-scrub frame sequence.

Usage: python3 scripts/slice.py media/drive-2k.mp4 site/frames [frame_count]
"""
import json
import os
import subprocess
import sys

import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
WIDTH = 1600
QUALITY = 4  # ffmpeg -q:v, lower is better


def duration(path):
    out = subprocess.run(
        [FFMPEG, "-i", path], capture_output=True, text=True
    ).stderr
    for line in out.splitlines():
        if "Duration:" in line:
            hms = line.split("Duration:")[1].split(",")[0].strip()
            h, m, s = hms.split(":")
            return int(h) * 3600 + int(m) * 60 + float(s)
    raise SystemExit(f"kon duur niet lezen uit {path}")


def main():
    src = sys.argv[1]
    dst = sys.argv[2]
    count = int(sys.argv[3]) if len(sys.argv) > 3 else 150

    dur = duration(src)
    fps = count / dur
    os.makedirs(dst, exist_ok=True)
    for old in os.listdir(dst):
        if old.endswith((".jpg", ".json")):
            os.remove(os.path.join(dst, old))

    subprocess.run([
        FFMPEG, "-y", "-i", src,
        "-vf", f"fps={fps:.6f},scale={WIDTH}:-2:flags=lanczos",
        "-q:v", str(QUALITY),
        os.path.join(dst, "f_%04d.jpg"),
    ], check=True, capture_output=True)

    files = sorted(f for f in os.listdir(dst) if f.endswith(".jpg"))
    with open(os.path.join(dst, "manifest.json"), "w") as fh:
        json.dump({"source": os.path.basename(src), "duration": round(dur, 3),
                   "count": len(files), "frames": files}, fh, indent=1)

    total = sum(os.path.getsize(os.path.join(dst, f)) for f in files)
    print(f"{len(files)} frames · {dur:.1f}s bron · {total/1e6:.1f} MB")


if __name__ == "__main__":
    main()
