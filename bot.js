const TelegramBot = require('node-telegram-bot-api');
const { getCryptoPrices } = require("crypto-price-fetcher");
const keep_alive = require('./keep_alive');
require("dotenv").config();

const { currencyToCrypto, cryptoToCurrency } = require("convert-currency_crypto")
const { prefix } = require('./config.json')
const bot = new TelegramBot(process.env.token, {polling: true});


bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  
if (msg.text.toString().toLowerCase().indexOf(prefix+'cur2cry') === 0) {

  (async () => {

    let args = msg.text.trim().split(/ +/g)
  let currency = args[1]
  let crypto = args[2]
  let amount = args[3]
  if (args.length !== 4) {
    bot.sendMessage(chatId, 'Please use the correct syntax: $cur2crypto {currency_name} {crypto_fullname} {amount}')
    return;
  }

    try {const conversion = await currencyToCrypto({
        amount: amount,
        currency: currency,
        gateway: crypto
    });

    
    const result = conversion.result;
    bot.sendMessage(chatId, `${result} ${crypto}`)
  } catch (error) {
    console.log(error)
    bot.sendMessage(chatId, 'Please use the correct syntax: $cur2crypto {currency_name} {crypto_fullname} {amount}')
  }
    
    
  })()

}

if (msg.text.toString().toLowerCase().indexOf(prefix+'cry2cur') === 0) {

  (async () => {

    let args = msg.text.trim().split(/ +/g)
  let currency = args[2]
  let crypto = args[1]
  let amount = args[3]
  if (args.length !== 4) {
    bot.sendMessage(chatId, 'Please use the correct syntax: $cry2cur {crypto_fullname} {currency_name} {amount}')
    return;
  }

    try {const conversion = await cryptoToCurrency({
      amount: amount,
      currency: currency,
      gateway: crypto
    });

    
    const result = conversion.result;
    bot.sendMessage(chatId, `${result} ${currency}`)
  } catch (error) {
    bot.sendMessage(chatId, 'Please use the correct syntax: $cry2cur {crypto_fullname} {currency_name} {amount}')
  }
    
    
  })()

}

if (msg.text.toString().toLowerCase().indexOf(prefix+'help') === 0) {
  bot.sendMessage(chatId, `
Prefix: ${prefix}
Commands:
cur2cry, cry2cur, price, help
`)
}

if (msg.text.toString().toLowerCase().indexOf(prefix+'price') === 0) {
  let args = msg.text.trim().split(' ');
const crypto = args[1].toUpperCase()
if (args.length !== 2) {
  bot.sendMessage(chatId, `Please use the correct syntax: $price {crypto_symbol}`)
  return;
}
const symbols = [`${crypto}USDT`];

async function getCryptoInfo() {
  try {
    const prices = await getCryptoPrices(symbols);
    Object.entries(prices).forEach(([symbol, data]) => {
      bot.sendMessage(msg.chat.id, `
♦ According to the current price change of the following coin/token.

The Information is Given Below 👇🏻

Current Price: $${data.lastPrice}
Price Change Percent (7d): ${data.priceChangePercent}%
High Price: $${data.highPrice}
Low Price: $${data.lowPrice}
`);
    });
  } catch (error) {
    bot.sendMessage(msg.chat.id, 'Please use a correct crypto symbol.');
  }
}

getCryptoInfo();
 
}

if (msg.text.toString().toLowerCase().indexOf('/start') === 0) {
bot.sendMessage(chatId, `Welcome To Crypto Bot!
This Bot Can Provide Prices Of Any Coin. It Can Also Convert Crypto To Fiat And Fiat To Crypto.
Use ${prefix}help to see all the commands of this bot.`)
}



});


console.log('Listening for commands.')