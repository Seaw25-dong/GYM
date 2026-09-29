package vn.aigym.coach;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.webkit.*;
import android.view.WindowInsets;
import java.io.*;
import java.util.*;

public final class MainActivity extends Activity {
    private static final String HOST = "gym-tau-black.vercel.app";
    private static final String START = "https://" + HOST + "/";
    private WebView web;
    private ValueCallback<Uri[]> fileCallback;
    private boolean errorShown;

    @Override public void onCreate(Bundle saved) {
        super.onCreate(saved);
        web = new WebView(this);
        web.setBackgroundColor(Color.rgb(9,9,11));
        setContentView(web);
        web.setOnApplyWindowInsetsListener((view, insets) -> {
            if (Build.VERSION.SDK_INT >= 30) {
                android.graphics.Insets edges = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout() | WindowInsets.Type.ime());
                view.setPadding(edges.left, edges.top, edges.right, edges.bottom);
            } else {
                view.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(), insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            }
            return insets.consumeSystemWindowInsets();
        });
        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(web, true);
        web.setWebViewClient(new WebViewClient() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (!isLocal(uri)) return null;
                return localResource(uri.getPath(), request.getRequestHeaders().get("Range"));
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (isLocal(uri)) return false;
                if (request.isForMainFrame() && ("https".equals(uri.getScheme()) || "http".equals(uri.getScheme()) || "mailto".equals(uri.getScheme()))) {
                    try { startActivity(new Intent(Intent.ACTION_VIEW, uri)); } catch (ActivityNotFoundException ignored) {}
                }
                return true;
            }
            @Override public void onPageFinished(WebView view, String url) {
                errorShown = false;
                CookieManager.getInstance().flush();
            }
            @Override public void onReceivedError(WebView view, WebResourceRequest req, WebResourceError error) {
                if (req.isForMainFrame() && !errorShown) {
                    errorShown = true;
                    new AlertDialog.Builder(MainActivity.this).setTitle("Không tải được trang")
                      .setMessage("Vui lòng thử lại.")
                      .setPositiveButton("Thử lại", (dialog, which) -> web.loadUrl(START))
                      .setNegativeButton("Đóng", null).show();
                }
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = callback;
                Intent picker = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                picker.addCategory(Intent.CATEGORY_OPENABLE);
                picker.setType("image/*");
                try { startActivityForResult(picker, 10); }
                catch (ActivityNotFoundException error) { fileCallback.onReceiveValue(null); fileCallback = null; }
                return true;
            }
        });
        if (saved == null || web.restoreState(saved) == null) {
            Uri deepLink = getIntent().getData();
            web.loadUrl(isLocal(deepLink) ? deepLink.toString() : START);
        }
    }
    private static boolean isLocal(Uri uri) {
        return uri != null && "https".equals(uri.getScheme()) && HOST.equals(uri.getHost()) && (uri.getPort() == -1 || uri.getPort() == 443);
    }
    private WebResourceResponse localResource(String rawPath, String range) {
        String path = rawPath == null ? "" : rawPath;
        if (path.contains("..") || path.indexOf('\\') >= 0 || path.indexOf('\0') >= 0) return missing();
        while (path.startsWith("/")) path = path.substring(1);
        if (path.isEmpty() || path.endsWith("/")) path += "index.html";
        String[] candidates = {path, path + "/index.html", path + ".html"};
        for (String candidate : candidates) {
            try {
                InputStream stream = getAssets().open("web/" + candidate);
                String mime = mime(candidate);
                Map<String,String> headers = new HashMap<>();
                headers.put("Cache-Control", "no-cache");
                headers.put("X-Content-Type-Options", "nosniff");
                if (candidate.endsWith(".mp4") && range != null && range.matches("bytes=[0-9]+-[0-9]*")) {
                    long length = stream.available();
                    String[] bounds = range.substring(6).split("-", -1);
                    long start = Long.parseLong(bounds[0]);
                    long end = bounds[1].isEmpty() ? length - 1 : Math.min(Long.parseLong(bounds[1]), length - 1);
                    if (start >= length || end < start) { stream.close(); return missing(); }
                    long skipped = 0;
                    while (skipped < start) { long n = stream.skip(start - skipped); if (n <= 0) break; skipped += n; }
                    final long limit = end - start + 1;
                    headers.put("Accept-Ranges", "bytes");
                    headers.put("Content-Range", "bytes " + start + "-" + end + "/" + length);
                    headers.put("Content-Length", Long.toString(limit));
                    InputStream bounded = new FilterInputStream(stream) {
                        long remaining = limit;
                        @Override public int read() throws IOException { if (remaining <= 0) return -1; int b = in.read(); if (b != -1) remaining--; return b; }
                        @Override public int read(byte[] b, int off, int len) throws IOException { if (remaining <= 0) return -1; int n = in.read(b, off, (int)Math.min(len,remaining)); if (n > 0) remaining -= n; return n; }
                    };
                    return new WebResourceResponse(mime, null, 206, "Partial Content", headers, bounded);
                }
                return new WebResourceResponse(mime, mime.startsWith("text/") || mime.equals("application/javascript") ? "UTF-8" : null, 200, "OK", headers, stream);
            } catch (IOException ignored) {}
        }
        return missing();
    }
    private static WebResourceResponse missing() {
        return new WebResourceResponse("text/plain", "UTF-8", 404, "Not Found", Collections.emptyMap(), new ByteArrayInputStream(new byte[0]));
    }
    private static String mime(String path) {
        if (path.endsWith(".html")) return "text/html";
        if (path.endsWith(".js")) return "application/javascript";
        if (path.endsWith(".css")) return "text/css";
        if (path.endsWith(".txt")) return "text/plain";
        if (path.endsWith(".json")) return "application/json";
        if (path.endsWith(".svg")) return "image/svg+xml";
        if (path.endsWith(".ico")) return "image/x-icon";
        if (path.endsWith(".woff2")) return "font/woff2";
        if (path.endsWith(".woff")) return "font/woff";
        if (path.endsWith(".mp4")) return "video/mp4";
        String type = MimeTypeMap.getSingleton().getMimeTypeFromExtension(MimeTypeMap.getFileExtensionFromUrl(path));
        return type == null ? "application/octet-stream" : type;
    }
    @Override protected void onActivityResult(int req, int result, Intent data) {
        super.onActivityResult(req,result,data);
        if (req == 10 && fileCallback != null) {
            Uri uri = data == null ? null : data.getData();
            fileCallback.onReceiveValue(result == RESULT_OK && uri != null ? new Uri[]{uri} : null);
            fileCallback = null;
        }
    }
    @Override protected void onSaveInstanceState(Bundle out) { web.saveState(out); super.onSaveInstanceState(out); }
    @Override protected void onPause() { web.onPause(); CookieManager.getInstance().flush(); super.onPause(); }
    @Override protected void onResume() { super.onResume(); if (web != null) web.onResume(); }
    @Override public void onBackPressed() { if (web.canGoBack()) web.goBack(); else super.onBackPressed(); }
    @Override protected void onDestroy() { if (fileCallback != null) fileCallback.onReceiveValue(null); web.destroy(); super.onDestroy(); }
}
