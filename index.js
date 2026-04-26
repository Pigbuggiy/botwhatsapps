const { Client } = require('whatsapp-web.js');
const client = new Client();

client.on('qr', qr => {
  console.log('Сканируй QR:');
  console.log(qr);
});

client.on('message', msg => {
  if (msg.body === '!привет') {
    msg.reply('Привет 👋');
  }
});

client.initialize();