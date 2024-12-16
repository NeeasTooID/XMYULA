/* DI BUAT OLEH XM4ZE
 * GITHUB:
 * https://github.com/XM4ZE/XMYULA-MD
 * Jika kamu menghapus WM ini maka
 * Kamu bersumpah dengan nama tuhanmu
 * Kalau kamu GAY
 */

import yts from "yt-search";
import fetch from 'node-fetch';

const handler = async (m, { conn, command, text, args, usedPrefix }) => {
  if (!text) throw `Gunakan contoh *${usedPrefix + command}* in this shirt`;
  if (text.startsWith('https://')) return m.reply(`Silahkan gunakan \`.ytmp3 atau .yta\` untuk mendapatkan audio`)
  conn.youtubeList = conn.youtubeList ? conn.youtubeList : {};
  await conn.reply(m.chat, wait, m);
  const result = await yts(text);
  const infoText = `
Silahkan pilih salah satu dari list di bawah dengan mereply pesan ini dengan angka yang kamu mau.
  `;

  const limitedVideos = result.videos.slice(0, 10);

  const orderedLinks = limitedVideos.map((link, index) => {
    const sectionNumber = index + 1;
    const { title } = link;
    return `${sectionNumber}. *${title}*`;
  });

  const orderedLinksText = orderedLinks.join("\n\n");
  const fullText = `${infoText}\n\n${orderedLinksText}`;
  const { key } = await conn.reply(m.chat, fullText, m);
  conn.youtubeList[m.sender] = {
    limitedVideos,
    key,
    timeout: setTimeout(() => {
      conn.sendMessage(m.chat, { delete: key });
      delete conn.youtubeList[m.sender];
    }, 60 * 4000),
  };
};

handler.before = async (m, { conn }) => {
  conn.youtubeList = conn.youtubeList ? conn.youtubeList : {};
  if (m.isBaileys || !(m.sender in conn.youtubeList)) return;
  const { limitedVideos, key, timeout } = conn.youtubeList[m.sender];
  if (!m.quoted || m.quoted.id !== key.id || !m.text) return;
  const choice = m.text.trim();
  const inputNumber = Number(choice);
  if (inputNumber >= 1 && inputNumber <= limitedVideos.length) {
    const selectedUrl = limitedVideos[inputNumber - 1].url;

    let yt;
    try {
      const response = await fetch(`https://api.betabotz.eu.org/api/download/ytmp3?url=${selectedUrl}&apikey=${lann}`);
      const data = await response.json();
      yt = data.result;
    } catch (error) {
      console.error('Betabotz request failed:', error);
      try {
        const response = await fetch(`https://api.botcahx.eu.org/api/dowloader/yt?url=${selectedUrl}&apikey=${global.btc}`);
        const data = await response.json();
        yt = data.result;
      } catch (error) {
        console.error('Botcahx request failed:', error);
        delete conn.youtubeList[m.sender];
        return m.reply('Kedua API gagal. Silakan coba lagi nanti.');
      }
    }

    let infoText = `*AUDIO INFORMATION*
- *Title:* ${yt.title}
- *Duration:* ${yt.duration}
- *Author:* ${yt.source}
  
*SENT By*
- ${global.info.namebot}

AUDIO SEDANG DI KIRIM
`;

    var pesan = conn.sendMessage(m.chat, {
      text: infoText,
      contextInfo: {
        forwardingScore: 9999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: global.info.channel,
          serverMessageId: null,
          newsletterName: global.info.namechannel,
        },
        externalAdReply: {
          title: `ANDA MEMILIH NOMOR ${inputNumber}`,
          body: ``,
          thumbnailUrl: yt.thumb,
          sourceUrl: selectedUrl,
          mediaType: 1,
          renderLargerThumbnail: true
        },
      },
    }, {});

    let doc = {
      audio: { url: yt.mp3 },
      mimetype: 'audio/mp4',
      fileName: `${yt.title}`
    };
    await conn.sendMessage(m.chat, doc, {
      quoted: m
    });
    conn.sendMessage(m.chat, { delete: key });
    clearTimeout(timeout);
    delete conn.youtubeList[m.sender];
  } else {
    m.reply("Nomor urutan tidak valid. Silakan pilih nomor yang sesuai dengan daftar di atas.\nAntara 1 sampai " + limitedVideos.length);
  }
};

handler.help = ["youtube"];
handler.tags = ["downloader"];
handler.command = /^(yt|youtube)$/i;
handler.limit = true;
export default handler;


/* DI BUAT OLEH XM4ZE
 * GITHUB:
 * https://github.com/XM4ZE/XMYULA-MD
 * Jika kamu menghapus WM ini maka
 * Kamu bersumpah dengan nama tuhanmu
 * Kalau kamu GAY
 */