const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

// Map para guardar el tiempo de salida de tu hermano (clave: ID, valor: fecha de salida)
const salidaTimes = new Map();

const AMIGO_ID  = '1440711431241596933';  // tu hermano
const SERVER_ID = '1096564371230036078';  // el server
const CANAL_ID  = '285501442549088256';  // canal del @everyone

client.once('ready', () => {
    console.log(`${client.user.tag} → ONLINE y esperando al rey 👑`);
});

// CUANDO TU HERMANO SALE DEL SERVIDOR (guardamos el tiempo)
client.on('guildMemberRemove', (member) => {
    if (member.guild.id !== SERVER_ID) return;
    if (member.id !== AMIGO_ID) return;

    // Guardamos la fecha actual como salida
    salidaTimes.set(AMIGO_ID, Date.now());
    console.log(`Tu hermano salió del server. Tiempo guardado.`);
});

// CUANDO TU HERMANO VUELVE AL SERVIDOR (calculamos el tiempo que se fue)
client.on('guildMemberAdd', (member) => {
    if (member.guild.id !== SERVER_ID) return;
    if (member.id !== AMIGO_ID) return;

    const salidaTime = salidaTimes.get(AMIGO_ID);
    let tiempoAusente = '';

    if (salidaTime) {
        // Calculamos la diferencia en milisegundos
        const tiempoSeFue = Date.now() - salidaTime;

        // Convertimos a días, horas, minutos y segundos
        const dias = Math.floor(tiempoSeFue / (1000 * 60 * 60 * 24));
        const horas = Math.floor((tiempoSeFue % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((tiempoSeFue % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((tiempoSeFue % (1000 * 60)) / 1000);

        // Mensaje épico con el tiempo
        if (dias > 0) tiempoAusente += `${dias}d `;
        if (horas > 0) tiempoAusente += `${horas}h `;
        if (minutos > 0) tiempoAusente += `${minutos}m `;
        if (segundos > 0) tiempoAusente += `${segundos}s`;

        // Si no hay tiempo (recién salió), no muestra nada
        if (tiempoAusente) {
            tiempoAusente = ` (se fue por ${tiempoAusente.trim()})`;
        }
        salidaTimes.delete(AMIGO_ID);  // Borramos el tiempo guardado
    } else {
        tiempoAusente = ' (primera vez o bot reiniciado)';
    }

    const canal = member.guild.channels.cache.get(CANAL_ID);
    if (canal) {
        canal.send(`@everyone si ${tiempoAusente} `);
    }

    console.log(`¡Tu hermano volvió! Se fue por: ${tiempoAusente}`);
});

// Truco para que NO se duerma en Render (importante)
const http = require('http');
http.createServer((req, res) => res.end('vivo')).listen(process.env.PORT || 8080);

client.login(process.env.TOKEN);
