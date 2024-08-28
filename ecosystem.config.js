module.exports = {
    apps : [{
      name: "GINZE_DAO_API",
      namespace:"GINZE DAO",
      script: "./main.js",
      env: {
        NODE_ENV: "production",
        APP_DOMAIN: 'dev.gizedao.com',
        TPC: 'https',
        PORT: 3000
      },
    }]
  }
