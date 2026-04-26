const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');

async function startBot() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState('auth');

    const sock = makeWASocket({
      auth: state
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
      const { qr, connection } = update;

      if (qr) {
        console.log('QR:');
        qrcode.generate(qr, { small: true });
      }

      if (connection === 'open') {
        console.log('Бот подключен ✅');
      }
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
      const msg = messages[0];
      if (!msg.message) return;
      if (msg.key.fromMe) return;

      const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        '';

      if (text === '!привет') {
        await sock.sendMessage(msg.key.remoteJid, { text: 'Привет 👋' });
      }
    });

  } catch (err) {
    console.error('ОШИБКА:', err);
  }
}

startBot();
