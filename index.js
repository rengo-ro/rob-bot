const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

const AMIGO_ID  = '1098589135838642207';
const SERVER_ID = '1096564371230036078';
const CANAL_ID  = '1158525807052992562';

client.once('ready', () => {
    console.log(`${client.user.tag} → ONLINE y esperando al rey 👑`);
});

client.on('guildMemberAdd', (member) => {
    if (member.guild.id !== SERVER_ID) return;
    if (member.id !== AMIGO_ID) return;
    const canal = member.guild.channels.cache.get(CANAL_ID);
    if (canal) canal.send(`@everyone si`);
});

const http = require('http');
http.createServer((req, res) => res.end('vivo')).listen(process.env.PORT || 8080);

client.login(process.env.TOKEN);
