module.exports = {
  apps: [
    {
      name: "Hello World",
      script: "index.js",
      instance: 0,
      autorestart: true,
      exec_mode: "cluster",
      watch: true,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};

// module.exports = {
//   apps: [
//     {
//       name: "app",
//       script: "./server.js",
//       env: {
//         NODE_ENV: "development",
//       },
//       env_production: {
//         NODE_ENV: "production",
//       },
//     },
//     {
//       name: "worker",
//       script: "worker.js",
//     },
//   ],
// };
