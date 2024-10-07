import fetch from 'node-fetch';

async function downloadTikTok(link, m) {
  try {
    const response = await fetch(`https://api.botcahx.eu.org/api/dowloader/tiktok?url=${link}&apikey=${btc}`);
    const data = await response.json();
    await conn.sendFile(m.chat, data.result.video, null, 'Tiktok Download', m);
  } catch (error) {
    console.error(error);
  }
}

async function downloadInstagram(link, m) {
  try {
    const response = await fetch(`https://api.botcahx.eu.org/api/dowloader/igdowloader?url=${link}&apikey=${btc}`);
    const data = await response.json();

    const limit = 3;
    const promises = data.result.slice(0, limit).map(image => {
      return conn.sendFile(m.chat, image.url, null, `*Instagram Downloader*`, m);
    });

    await Promise.all(promises);

  } catch (error) {
    console.error(error);
  }
}

async function downloadFacebook(link, m) {
  try {
    const response = await fetch(`https://api.botcahx.eu.org/api/dowloader/fbdown3?url=${link}&apikey=${btc}`);
    const data = await response.json();
    const urls = data.result.url.urls;

    if (Array.isArray(urls)) {
      for (let url of urls) {
        if (url.sd) {
          await conn.sendFile(m.chat, url.sd, 'fb.mp4', `*Facebook Downloader*`, m);
          break;
        }
      }
    }

  } catch (error) {
    console.error(error);
  }
}

export async function before(m, { isPrems }) {
  let chat = global.db.data.chats[m.chat];

  if (!m.text && m.fromMe) {
    return;
  }

  if (m.text.startsWith('=>') || m.text.startsWith('>') || m.text.startsWith('.') || m.text.startsWith('#') || m.text.startsWith('!') || m.text.startsWith('/') || m.text.startsWith('\/')) {
    return;
  }

  if (chat.isBanned) {
    return;
  }

  let text = m.text.replace(/\n+/g, ' ');

  const tiktokRegex = /^(?:https?:\/\/)?(?:www\.|vt\.|vm\.|t\.)?(?:tiktok\.com\/)(?:\S+)?$/i;
  const instagramRegex = /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/)(?:tv\/|p\/|reel\/)(?:\S+)?$/i;
  const facebookRegex = /^(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/i;

  if (text.match(tiktokRegex)) {
    await downloadTikTok(text.match(tiktokRegex)[0], m);
  } else if (text.match(instagramRegex)) {
    await downloadInstagram(text.match(instagramRegex)[0], m);
  } else if (text.match(facebookRegex)) {
    await downloadFacebook(text.match(facebookRegex)[0], m);
  }

  return !0;
}