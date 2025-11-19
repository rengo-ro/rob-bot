const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

const salidaTimes = new Map();

const AMIGO_ID  = '1098589135838642207';
const SERVER_ID = '1158525807052992562';
const CANAL_ID  = '1158525807052992562';

// FORZAMOS LA HORA DE SALIDA DE TU HERMANO AHORA MISMO (19 nov 2025 ~19:26 Argentina)
salidaTimes.set(AMIGO_ID, Date.now() - 2 * 60 * 1000); // resto 2 minutos para que ya cuente desde ahora

client.once('ready', () => {
    console.log(`${client.user.tag} → ONLINE y esperando al rey 👑`);
    console.log(`Hora de salida de tu hermano forzada para prueba`);
});

// Cuando sale (normal)
client.on('guildMemberRemove', (member) => {
    if (member.id !== AMIGO_ID || member.guild.id !== SERVER_ID) return;
    salidaTimes.set(AMIGO_ID, Date.now());
});

// Cuando vuelve (el que importa)
client.on('guildMemberAdd', async (member) => {
    if (member.id !== AMIGO_ID || member.guild.id !== SERVER_ID) return;

    const salidaTime = salidaTimes.get(AMIGO_ID) || (Date.now() - 60000); // fallback 1 min
    const tiempoSeFue = Date.now() - salidaTime;

    const dias = Math.floor(tiempoSeFue / 86400000);
    const horas = Math.floor((tiempoSeFue % 86400000) / 3600000);
    const minutos = Math.floor((tiempoSeFue % 3600000) / 60000);
    const segundos = Math.floor((tiempoSeFue % 60000) / 1000);

    let tiempoTexto = '';
    if (dias > 0) tiempoTexto += `${dias}d `;
    if (horas > 0) tiempoTexto += `${horas}h `;
    if (minutos > 0) tiempoTexto += `${minutos}m `;
    tiempoTexto += `${segundos}s`;

    const canal = member.guild.channels.cache.get(CANAL_ID);
    if (canal) {
        canal.send(`@everyone Si ${tiempoTexto.trim()}`);
    }

    // Borramos para la próxima
    salidaTimes.delete(AMIGO_ID);
});

const http = require('http');
http.createServer((req, res) => res.end('vivo')).listen(process.env.PORT || 8080);

client.login(process.env.TOKEN);
