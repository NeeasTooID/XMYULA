import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw 'Input Query'
    try {
    let { result } = await( await fetch(`https://api.betabotz.eu.org/api/search/pinterest?text1=${text}&apikey=${lann}`)).json()
    
    let push = [];
        for (let x of result.sort(() => Math.random() - 0.5))
        push.push(['Get results from: ' + text, global.wm, '', x, []])
		await conn.sendButtonSlide(m.chat, `Take *7 images* from *${result.length} results*`, '', push, m)
        	} catch (e) {
		console.log(e)
		throw `Pencarian Tidak Di Temukan!!!`
	}
   
}
handler.help = ['pinterest <search>']
handler.tags = ['downloader', 'search']
handler.command = /^pin(terest)?$/i
handler.limit = true
handler.register = true

export default handler