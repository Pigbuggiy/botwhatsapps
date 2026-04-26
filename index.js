const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth');

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    // ❗ Игнорируем свои сообщения
    if (msg.key.fromMe) return;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      '';

    // 🔹 Команда
    if (text === '!привет') {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Привет 👋' });
    }
  });
}

startBot();
