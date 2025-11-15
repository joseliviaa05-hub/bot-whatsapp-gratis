require baileys
makeWASocket
DisconnectReason
useMultiFileAuthState
from @whiskeysockets/baileys,
require pino as P,
require fs,
require express,
require qrcode-terminal;

// create express app
const app = express();

app.get('/', (req, res) => {
    res.send('Bot de WhatsApp activo');
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const negocioData = JSON.parse(fs.readFileSync('./data/negocio.json'));
const listaPrecios = JSON.parse(fs.readFileSync('./data/lista-precios.json'));

async function conectarWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const sock = makeWASocket({ auth: state, logger: P({ level: 'silent' }) });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', ({ lastDisconnect, qr, connection }) => {
        if (qr) {
            console.log('escanea codigo qr mensaje');
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            const shouldReconnect =lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut;
            console.log('conexion cerrada reconectando', shouldReconnect);
            if (shouldReconnect) {
                setTimeout(conectarWhatsApp, 3000);
            }
        }

        if (connection === 'open') {
            console.log('bot conectado');
        }
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const from = msg.key.remoteJid;
        const texto = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
        console.log('mensaje recibido', texto);

        const respuesta = await procesarMensaje(texto.toLowerCase());
        await sock.sendMessage(from, { text: respuesta });
    });
}

async function procesarMensaje(mensaje) {
    if (mensaje.match(/hola|buenas|buenos dias/)) return `greeting: ${negocioData.nombre}`;
    if (mensaje.match(/horario|hora atencion/)) return `horarios: ${negocioData.horario}`;
    if (mensaje.match(/ubicacion/)) return `direccion: ${negocioData.direccion}`;
    if (mensaje.match(/cuaderno|lapiz|lapicera/)) return await buscarPreciosCategoria('libreria');
    if (mensaje.match(/cotillon|globo/)) return await buscarPreciosCategoria('cotillon');
    if (mensaje.match(/juguete|rompecabeza/)) return await buscarPreciosCategoria('jugueteria');
    if (mensaje.match(/fotocopia|impresi/)) return await buscarPreciosCategoria('impresiones plus servicios');
    if (mensaje.match(/bijou|aro/)) return await buscarPreciosCategoria('bijou');
    if (mensaje.match(/celular|funda/)) return await buscarPreciosCategoria('accesorios_celular');
    if (mensaje.match(/computadora|mouse/)) return await buscarPreciosCategoria('accesorios_computadora');
    if (mensaje.match(/stock|hay/)) return 'stock message';
    if (mensaje.match(/lista|precio/)) return 'categorias list';
    if (mensaje.match(/pago|efectivo/)) return 'medios_pago';
    if (mensaje.match(/contacto|telefono/)) return 'contacto info';
    return 'no entendi';
}

function buscarPreciosCategoria(categoria, mensaje) {
    const datos = listaPrecios[categoria];
    let respuesta = categoria.toUpperCase();
    for (const [subcategoria, productos] of Object.entries(datos)) {
        for (const producto of productos) {
            const info = producto;
            const stockEmoji = info.stock;
            const precioTexto = info.precio_desde || info.precio + ' ' + info.unidad;
            const nombreFormateado = producto.nombre.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            respuesta += ` ${stockEmoji} ${nombreFormateado} ${precioTexto}`;
        }
    }
    return respuesta;
}

conectarWhatsApp();
console.log('iniciando bot y esperando QR');