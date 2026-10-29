// VM (p40493438): aiskillhub.info main site, moved off Vercel. nginx proxies aiskillhub.info + www here.
module.exports = {
  apps: [{
    name: "ai-skills-hub",
    cwd: __dirname,
    script: "node_modules/next/dist/bin/next",
    args: "start -H 127.0.0.1 -p 3990",
    env: { NODE_ENV: "production" },
    max_memory_restart: "600M",
    autorestart: true,
  }],
};
