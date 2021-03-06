const Asena = require('../events');
const {MessageType, MessageOptions, Mimetype} = require('@adiwajshing/baileys');
const axios = require('axios');
const { requestLyricsFor, requestAuthorFor, requestTitleFor, requestIconFor } = require("solenolyrics");
const solenolyrics= require("solenolyrics"); 
const Sea = require('search-engine-client');
const TinyURL = require('tinyurl');
const fs = require('fs');
const Language = require('../language');
const Lang = Language.getString('instagram')
const { errorMessage, infoMessage } = require('../helpers')

const De = "Uzun linkleri kısaltır."

Asena.addCommand({pattern: 'short ?(.*)', fromMe: true, desc: De}, (async (message, match) => {

    if (match[1] === '') return await message.client.sendMessage(message.jid,'```Link Girmelisin!```', MessageType.text);

    TinyURL.shorten(`${match[1]}`, async(res, err) => {
      if (err)
        await message.client.sendMessage(message.jid, '*#### Hata! ####*\n' + err, MessageType.text);

        await message.client.sendMessage(message.jid, `*Orjinal Link:* ${match[1]}\n*Kısa Link:* ` + res, MessageType.text)
    });
}));

const def = "```Şarkı İsmi Gir!```"
const del = "Şarkı sözlerini bulur."

Asena.addCommand({pattern: 'lyric ?(.*)', fromMe: true, desc: del}, (async (message, match) => {

    if (match[1] === '') return await message.client.sendMessage(message.jid,def, MessageType.text);

    var aut = await solenolyrics.requestLyricsFor(`${match[1]}`); 
    var son = await solenolyrics.requestAuthorFor(`${match[1]}`);
    var cov = await solenolyrics.requestIconFor(`${match[1]}`);
    var tit = await solenolyrics.requestTitleFor(`${match[1]}`);

    var buffer = await axios.get(cov, {responseType: 'arraybuffer'});

    await message.client.sendMessage(message.jid, Buffer.from(buffer.data),  MessageType.image, {caption: '*Aratılan Şarkı:* ' + '```' + `${match[1]}` + '```\n*Bulunan Şarkı:* ```' + tit + '```\n*Şarkı Sahibi:* ```' + son + '```\n*Şarkı Sözleri:*\n\n' + aut });

}));
const Sr = "Googlede arama yapar."
Asena.addCommand({pattern: 'search ?(.*)', fromMe: true, desc: Sr}, (async (message, match) => {

    if (match[1] === '') return await message.client.sendMessage(message.jid,'```Aranacak Kelime Girmelisin!```', MessageType.text);
 
    Sea.google(`${match[1]}`).then(async(result) => {
        
        await message.client.sendMessage(message.jid,result[0], MessageType.text);
    });
}));

const cn = require('../config');
const vf = "Onaylanmış Hesap"
const novf = "Onaylanmamış Hesap"
const bs = "Evet"
const nobs = "Hayır"

if (cn.WORKTYPE == 'private') {

    Asena.addCommand({ pattern: 'insta ?(.*)', fromMe: true, desc: Lang.DESC }, async (message, match) => {

        const userName = match[1]

        if (userName === '') return await message.sendMessage(errorMessage(Lang.NEED_WORD))

        await message.sendMessage(infoMessage(Lang.LOADING))

        await axios.get(`https://docs-jojo.herokuapp.com/api/stalk?username=${userName}`).then(async (response) => {

            const {biography, username, edge_follow, edge_followed_by, category_name, is_verified, is_private, edge_owner_to_timeline_media, profile_pic_url_hd, full_name, is_business_account } = response.data.graphql.user

            const profileBuffer = await axios.get(profile_pic_url_hd, { responseType: 'arraybuffer' })

            const msg = `*${Lang.NAME}*: ${full_name} \n*${Lang.USERNAME}*: ${username} \n*${Lang.BIO}*: ${biography} \n*${Lang.FOLLOWERS}*: ${edge_followed_by.count} \n*${Lang.FOLLOWS}*: ${edge_follow.count} \n*${Lang.ACCOUNT}*: ${is_private ? Lang.HIDDEN : Lang.PUBLIC} \n*Hesap Türü:* ${is_verified ? vf : novf} \n*İşletme Hesabı mı?:* ${is_business_account ? bs : nobs} \n*Kategori:* ${category_name} \n*Post Sayısı:* ${edge_owner_to_timeline_media.count}`

            await message.sendMessage(Buffer.from(profileBuffer.data), MessageType.image, { caption: msg })

        }).catch(async (err) => {
            await message.sendMessage(errorMessage(Lang.NOT_FOUND + userName))
        })
    });
}
