#!/usr/bin/env python3
from pathlib import Path
import subprocess, shutil, zipfile, secrets, os
root=Path(__file__).resolve().parent
src=root/'android'; build=root/'build'
tools=Path(os.environ.get('GYM_ANDROID_TOOLCHAIN', str(root/'toolchain')))
signing=Path(os.environ.get('GYM_ANDROID_SIGNING', str(root/'signing')))
web=Path(os.environ.get('GYM_WEB_EXPORT', str(root.parent/'ai-gym-coach'/'out')))
if not (web/'index.html').is_file():
 raise SystemExit('Build the web export first; see README.md')
if build.exists():
 shutil.rmtree(build)
for directory in (build,signing,build/'classes',build/'dex',root/'dist'):
 directory.mkdir(parents=True,exist_ok=True)
os.chmod(signing,0o700)
assets=build/'assets'/'web'
shutil.copytree(web,assets)
def run(*args):
 subprocess.run([str(a) for a in args],check=True)
run('aapt2','compile','--dir',src/'res','-o',build/'resources.zip')
run('aapt2','link','-o',build/'unsigned.apk','--manifest',src/'AndroidManifest.xml','-I',tools/'android-resources.jar','-A',build/'assets','--min-sdk-version','24','--target-sdk-version','35','--auto-add-overlay',build/'resources.zip')
java=Path(os.environ['JAVA_HOME'])/'bin' if os.environ.get('JAVA_HOME') else Path(shutil.which('javac')).resolve().parent
run(java/'javac','--release','8','-classpath',tools/'android.jar','-d',build/'classes',*src.glob('src/**/*.java'))
classes=sorted((build/'classes').rglob('*.class'))
run(java/'java','-cp',tools/'r8.jar','com.android.tools.r8.D8','--min-api','24','--lib',tools/'android.jar','--output',build/'dex',*classes)
with zipfile.ZipFile(build/'unsigned.apk','a',compression=zipfile.ZIP_DEFLATED) as z:
 for dex in (build/'dex').glob('*.dex'): z.write(dex,dex.name)
run('zipalign','-f','4',build/'unsigned.apk',build/'aligned.apk')
password=signing/'password.txt'; keystore=signing/'gym-release.jks'
if not password.exists():
 password.write_text(secrets.token_urlsafe(32)); os.chmod(password,0o600)
if not keystore.exists():
 run(java/'keytool','-genkeypair','-keystore',keystore,'-storepass:file',password,'-keypass:file',password,'-alias','gym','-keyalg','RSA','-keysize','2048','-validity','10000','-dname','CN=AI Gym Coach, O=Personal, C=VN')
 os.chmod(keystore,0o600)
apk=root/'dist'/'AI-Gym-Coach-1.0.1.apk'
run('apksigner','sign','--ks',keystore,'--ks-key-alias','gym','--ks-pass','file:'+str(password),'--out',apk,build/'aligned.apk')
run('apksigner','verify','--verbose',apk)
run('zipalign','-c','4',apk)
print('APK:',apk, 'bytes:',apk.stat().st_size)
