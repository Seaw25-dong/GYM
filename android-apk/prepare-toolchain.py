#!/usr/bin/env python3
from pathlib import Path
import hashlib, io, os, urllib.request, zipfile
root = Path(os.environ.get('GYM_ANDROID_TOOLCHAIN', str(Path(__file__).resolve().parent/'toolchain')))
root.mkdir(parents=True, exist_ok=True)
ARTIFACTS = [('https://dl.google.com/android/repository/platform-35_r02.zip', '0988cacad01b38a18a47bac14a0695f246bc76c1b06c0eeb8eb0dc825ab0c8e0', 'android.jar'), ('https://dl.google.com/android/repository/platform-34-ext12_r01.zip', 'b8349ff89d0bc40d26c712dcc5eb36ee60f40e203d7589bd4599b9237e98329a', 'android-resources.jar'), ('https://dl.google.com/dl/android/maven2/com/android/tools/r8/8.7.18/r8-8.7.18.jar', '58366f77067207c39a17d469de7b05701d2877212a9c55201bcb0af43e59e903', 'r8.jar')]
for url, expected, target in ARTIFACTS:
    print('Downloading', target, flush=True)
    with urllib.request.urlopen(url, timeout=120) as response:
        data = response.read()
    if hashlib.sha256(data).hexdigest() != expected:
        raise SystemExit('Checksum mismatch: ' + target)
    if url.endswith('.zip'):
        with zipfile.ZipFile(io.BytesIO(data)) as archive:
            name = next(name for name in archive.namelist() if name.endswith('/android.jar'))
            data = archive.read(name)
    (root/target).write_bytes(data)
print('Android toolchain ready:', root)
