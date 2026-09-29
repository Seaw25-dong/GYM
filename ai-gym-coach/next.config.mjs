/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  ...(process.env.GYM_ANDROID_EXPORT === "1" ? {
    output: "export",
    trailingSlash: true,
    images: { unoptimized: true },
  } : {}),
};

export default nextConfig;
