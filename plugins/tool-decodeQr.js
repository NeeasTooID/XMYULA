import fetch from 'node-fetch';
import uploadFile from '../lib/uploadFile.js';

export async function handler(m, { conn, usedPrefix, command }) {
  try {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || q.mediaType || '';

    if (/^image/.test(mime) && !/webp/.test(mime)) {
      const img = await q.download();
      const out = await uploadFile(img);
      const api = await fetch(`https://api.betabotz.eu.org/api/tools/decode-qr?url=${out}&apikey=${lann}`);
      const image = await api.json();
      const result = image.result;
      await m.reply(result);
    } else {
      await m.reply(`Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim.`);
    }
  } catch (e) {
    console.error(e);
    await m.reply(`Identifikasi gagal. Silakan coba lagi.`);
  }
}

handler.help = ['decodeqr', 'readqr'];
handler.command = ['decodeqr', 'readqr'];
handler.tags = ['tools'];
handler.limit = true;

export default handler;