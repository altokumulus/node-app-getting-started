'use strict'
const http = require('http')
const Bot = require('messenger-bot')

let bot = new Bot({
  token: 'EAAXA84xheSUBANKFq79gYJ4Ue9WHsiZAVWxmVM2ACiZCv7B4qk7qQAALXgYl7xgTxBJP6pSBAVcXeCjZAE2xr8kaWaPfhZCd8A8hI2OfxBgRqzLHiZBOiMVat5V65BggUYGwPYwEFGigHMvmDWQFVphPFwlvSxPZB5bT0tQpsP2PK4nkOuqWbm',
  verify: 'test_my_token'
})

bot.on('error', (err) => {
  console.log(err.message)
})

bot.on('message', (payload, reply) => {
  let text = payload.message.text

  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) throw err

    reply({ text }, (err) => {
      if (err) throw err

      console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
    })
  })
})

http.createServer(bot.middleware()).listen(3000)
