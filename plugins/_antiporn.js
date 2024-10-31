import fetch from 'node-fetch';
import uploadFile from '../lib/uploadFile.js';

let war = global.maxwarn
let handler = m => m
handler.before = async function(m, {
        conn,
        isBotAdmin
}) {
        let chat = db.data.chats[m.chat]
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        if (chat.antiPorn && m.isGroup && isBotAdmin) {
                if (/image/.test(mime)) {
                        let media = await q.download();
                        let url = await uploadFile(media);
                        const xmaze = `Porn`
                        try {
                                let data = await (await fetch(`https://api.betabotz.eu.org/api/tools/nsfw-detect?url=${url}&apikey=${global.lann}`)).json()

                                if (data.result.labelName === xmaze) {
                                        let warn = db.data.users[m.sender].warn
                                        await conn.sendMessage(m.chat, {
                                                delete: {
                                                        remoteJid: m.chat,
                                                        fromMe: false,
                                                        id: m.key.id,
                                                        participant: m.key.participant
                                                }
                                        })
                                        if (warn < war) {
                                                global.db.data.users[m.sender].warn += 1
                                                conn.sendMessage(m.chat, { text: `*Hi @${m.sender.split('@')[0]}*\n\n*Kamu telah mengirim gambar NSFW dan kamu mendapatkan [ 1 ] Peringatan ! ! !*`, contextInfo: { mentionedJid: [m.sender] }}, {})
                                        } else if (warn == war) {
                                                global.db.data.users[m.sender].warn = 0
                                                conn.sendMessage(m.chat, { text: `*Hi @${m.sender.split('@')[0]}*\n\n*Kamu selalu saja mengirimkan gambar NSFW dan sekarang kamu akan di keluarkan.*`, contextInfo: { mentionedJid: [m.sender] }}, {})
                                                await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
                                        }
                                }
                        } catch (e) {
                                console.log(e)
                        }
                }
        }
};

export default handler;