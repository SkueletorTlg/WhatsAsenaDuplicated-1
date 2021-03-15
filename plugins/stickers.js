/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/

const Asena = require('../events');
const {MessageType, Mimetype} = require('@adiwajshing/baileys');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const {execFile} = require('child_process');
const cwebp = require('cwebp-bin');

const TRM = "Animasyonlu stickeri videoya çevirir."
const Language = require('../language');
const Lang = Language.getString('sticker');

Asena.addCommand({pattern: 'sticker', fromMe: true, desc: Lang.STICKER_DESC}, (async (message, match) => {    

    if (message.reply_message === false) return await message.client.sendMessage(message.jid,Lang.NEED_REPLY, MessageType.text);
    var downloading = await message.client.sendMessage(message.jid,Lang.DOWNLOADING,MessageType.text);
    var location = await message.client.downloadAndSaveMediaMessage({
        key: {
            remoteJid: message.reply_message.jid,
            id: message.reply_message.id
        },
        message: message.reply_message.data.quotedMessage
    });

    if (message.reply_message.video === false && message.reply_message.image) {
        execFile(cwebp, [location, '-o', 'output.webp'], async err => {
            if (err) {
                throw err;
            }
        
            await message.sendMessage(fs.readFileSync('./output.webp'), MessageType.sticker);
        });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})
    }

    ffmpeg(location)
        .outputOptions(["-y", "-vcodec libwebp", "-lossless 1", "-qscale 1", "-preset default", "-loop 0", "-an", "-vsync 0", "-s 512x512"])
        .save('sticker.webp')
        .on('end', async () => {
            await message.sendMessage(fs.readFileSync('sticker.webp'), MessageType.sticker);
        });
    return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})
}));

Asena.addCommand({pattern: 'mp4sticker', fromMe: true, desc: TRM}, (async (message, match) => {    

    if (message.reply_message === false) return await message.client.sendMessage(message.jid,Lang.NEED_REPLY, MessageType.text);
    var downloading = await message.client.sendMessage(message.jid,Lang.DOWNLOADING,MessageType.text);
    var location = await message.client.downloadAndSaveMediaMessage({
        key: {
            remoteJid: message.reply_message.jid,
            id: message.reply_message.id
        },
        message: message.reply_message.data.quotedMessage
    });

    execFile(cwebp, [location, '-o', 'output.mp4'], async err => {
        if (err) {
            throw err;
        }
        
        await message.sendMessage(fs.readFileSync('./output.mp4'), MessageType.video {mimetype: Mimetype.mpeg, caption: 'Made for Founder'});
    });
    return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})
}));
