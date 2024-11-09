import fetch from "node-fetch";

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*Masukan Url Teraboxnya*`
    await m.reply(wait)
    try {
        let data = await (await fetch(`https://api.botcahx.eu.org/api/download/terabox?url=${text}&apikey=${btc}`)).json()
        
        if (!data.result || data.result.length === 0) {
            throw 'No files found in the response'
        }

        let msg = `乂 *T E R A B O X   D O W N L O A D E R*\n\n`
        msg += `Found ${data.result.length} file(s):\n\n`
        
        for (let file of data.result) {
            if (!file.files || !file.files[0]) continue
            let fdata = file.files[0]
            msg += ` ◦ *Name :* ${file.name}\n`
            msg += ` ◦ *Size :* ${formatSize(fdata.size)}\n`
            msg += ` ◦ *Created :* ${formatDate(file.created)}\n\n`
        }
       
        await conn.sendMessage(m.chat, {
            text: msg + `\n\nProcessing ${data.result.length} file(s)` 
            })
        

        const total = data.result.length
        for (let i = 0; i < data.result.length; i++) {
            const file = data.result[i]
            if (!file.files || !file.files[0]) continue
            
            let fdata = file.files[0]
            try {
                let response = await fetch(fdata.url)
                let buffer = await response.buffer()
               
                let queue = `*Antrian:* ${i + 1}-${total}\n`               
                await conn.sendFile(m.chat, buffer, file.name, queue, m)
                
                if (i === data.result.length - 1) {
                    await conn.reply(m.chat, '*Permintaan telah berhasil di download*', m)
                }
                
                if (i < data.result.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 5000))
                }
            } catch (eror) {
                await conn.reply(m.chat, `Failed to process file: ${file.name}`, m)
            }
        }
    } catch (error) {
        throw eror
    }
}

handler.help = ['teraboxdl'].map(v => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^(teraboxdl|terabox)$/i
handler.premium = true
handler.nsfw = true

export default handler;

function formatSize(size) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let i = 0
    while (size >= 1024 && i < units.length - 1) {
        size /= 1024
        i++
    }
    return `${size.toFixed(2)} ${units[i]}`
}

function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}