import fetch from 'node-fetch';
import uploadFile from '../lib/uploadFile.js';

export const handler = async (m, { conn, text, command, usedPrefix }) => {
  if (!text) {
    throw `Balas media dengan teks\nContoh: ${usedPrefix + command} apa ini?`;
  }

  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || q.mediaType || '';
  let media, urlAPI;

  await m.reply('Sabar...');

  try {
    if (/image/g.test(mime) && !/webp/g.test(mime)) {
      const buffer = await q.download();
      media = await uploadFile(buffer);
      urlAPI = `https://api.betabotz.eu.org/api/search/bard-img?url=${media}&text=${text}&apikey=${lann}`;
    } else if (/video/g.test(mime)) {
      if (q.seconds > 60) {
        throw 'Durasi video maksimum 60 detik!';
      }
      const buffer = await q.download();
      media = await uploadFile(buffer);
      urlAPI = `https://api.betabotz.eu.org/api/search/bard-video?url=${media}&text=${text}&apikey=${lann}`;
    } else if (/audio/g.test(mime)) {
      const buffer = await q.download();
      media = await uploadFile(buffer);
      urlAPI = `https://api.betabotz.eu.org/api/search/bard-audio?url=${media}&text=${text}&apikey=${lann}`;
    } else {
      throw `Balas gambar/video/audio dengan perintah ${usedPrefix + command} pertanyaan Anda`;
    }

    const json = await (await fetch(urlAPI)).json();

    if (json.status && json.result) {
      conn.sendMessage(m.chat, { text: json.result }, { quoted: m });
    } else {
      throw 'Gagal mendapatkan respons dari Bard';
    }
  } catch (err) {
    console.error(err);
    throw `${eror}\n\nDetail: ${err.message}`;
  }
};

handler.help = ['bard'];
handler.tags = ['ai'];
handler.command = /^(bardimg|bardimage|bardvideo|bardaudio)$/i;
handler.limit = true;

export default handler;