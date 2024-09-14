module.exports = {
  apps : [{
    name: "ENTERAL_KING_DOM_API",
    namespace:"ENTERAL_KING_DOM_API",
    script: "./main.js",
    env: {
      NODE_ENV: "production",
      APP_DOMAIN: 'market.kingdoms.game',
      TPC: 'https',
      PORT: 3000
    },
  }]
}
