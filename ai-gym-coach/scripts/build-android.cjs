const { spawnSync } = require("node:child_process");

const result = spawnSync(process.execPath, [require.resolve("next/dist/bin/next"), "build", "--webpack"], {
  stdio: "inherit",
  env: { ...process.env, GYM_ANDROID_EXPORT: "1" },
});

process.exit(result.status ?? 1);
