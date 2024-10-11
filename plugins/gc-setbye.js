let handler = async (m, { conn, text }) => {
  if (text) {
    global.db.data.chats[m.chat].sBye = text
    m.reply('Bye berhasil diatur\n@user (Mention)')
  } else throw 'Teksnya mana?'
}
handler.help = ['setbye <teks>']
handler.tags = ['group','adminry',]
handler.command = /^setbye$/i
handler.group = true
handler.admin = true

export default handler