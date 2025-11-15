const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const P = require('pino');
const fs = require('fs');
const express = require('express');
const qrcode = require('qrcode-terminal');

// Servidor Express para mantener activo en Render
const app = express();
app.get('/', (req, res) => res.send('🤖 Bot de WhatsApp activo!'));
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor HTTP en puerto ${PORT}`));

// Cargar datos del negocio
const negocioData = JSON.parse(fs.readFileSync('./data/negocio.json', 'utf8'));
const listaPrecios = JSON.parse(fs.readFileSync('./data/lista-precios.json', 'utf8'));

async function conectarWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    
    const sock = makeWASocket({
        auth: state,
        logger: P({ level: 'silent' })
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        // Mostrar código QR cuando esté disponible
        if (qr) {
            console.log('\n📱 ¡ESCANEA ESTE CÓDIGO QR CON WHATSAPP BUSINESS!\n');
            qrcode.generate(qr, { small: true });
            console.log('\n👆 Abre WhatsApp Business → Dispositivos vinculados → Vincular dispositivo\n');
        }
        
        if(connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Conexión cerrada. Reconectando:', shouldReconnect);
            if(shouldReconnect) {
                setTimeout(() => conectarWhatsApp(), 3000);
            }
        } else if(connection === 'open') {
            console.log('✅ Bot conectado a WhatsApp!');
            console.log('🤖 El bot está listo y esperando mensajes...');
        }
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const from = msg.key.remoteJid;
        const texto = msg.message.conversation || 
                     msg.message.extendedTextMessage?.text || '';

        console.log(`📩 Mensaje de ${from}: ${texto}`);

        const respuesta = await procesarMensaje(texto.toLowerCase());
        
        await sock.sendMessage(from, { text: respuesta });
        console.log(`✅ Respuesta enviada`);
    });
}

// Procesar mensajes sin IA (gratis)
async function procesarMensaje(mensaje) {
    // Saludos
    if (mensaje.match(/hola|buenas|buenos dias|buenas tardes|buenas noches|hey|hi/)) {
        return `¡Hola! 👋 Bienvenido a *${negocioData.nombre}*\n\n` +
               `Te puedo ayudar con:\n` +
               `📋 Lista de precios\n` +
               `🕐 Horarios\n` +
               `📍 Ubicación\n` +
               `📦 Stock de productos\n` +
               `🖨️ Servicios de impresión\n` +
               `💳 Medios de pago\n\n` +
               `¿Qué necesitas?`;
    }

    // Horarios
    if (mensaje.match(/horario|hora|atencion|abren|cierran|abierto/)) {
        return `🕐 *Horarios de Atención*\n\n${negocioData.horarios}`;
    }

    // Ubicación
    if (mensaje.match(/ubicacion|direccion|donde|local|negocio|como llego/)) {
        return `📍 *Nuestra Ubicación*\n\n${negocioData.direccion}\n\n` +
               `Te esperamos! 😊`;
    }

    // Precios - Librería
    if (mensaje.match(/cuaderno|lapiz|lapicera|marcador|libreria|escolar|boligrafo/)) {
        return buscarPreciosCategoria('libreria', mensaje);
    }

    // Precios - Cotillón
    if (mensaje.match(/cotillon|globo|vela|cumpleaños|cumpleanos|fiesta|piñata|pinata|decoracion/)) {
        return buscarPreciosCategoria('cotillon', mensaje);
    }

    // Precios - Juguetería
    if (mensaje.match(/juguete|rompecabeza|bloque|didactico|juego/)) {
        return buscarPreciosCategoria('jugueteria', mensaje);
    }

    // Impresiones
    if (mensaje.match(/fotocopia|impresi|imprim|sublim|remera|taza|edicion|diseño|diseno/)) {
        return buscarPreciosCategoria('impresiones', mensaje) + 
               `\n\n💡 *Servicios disponibles:*\n` +
               `- Fotocopias B/N y Color\n` +
               `- Sublimación en remeras\n` +
               `- Tazas personalizadas\n` +
               `- Mousepads custom\n` +
               `- Diseño e impresión de invitaciones\n` +
               `- Tarjetas personalizadas\n` +
               `- Y mucho más!\n\n` +
               `¿Qué necesitas imprimir?`;
    }

    // Bijou
    if (mensaje.match(/bijou|aro|collar|pulsera|accesorio|joya|anillo/)) {
        return buscarPreciosCategoria('bijou', mensaje);
    }

    // Accesorios celular
    if (mensaje.match(/celular|funda|vidrio|cargador|auricula|telefono|movil|cable/)) {
        return buscarPreciosCategoria('accesorios_celular', mensaje);
    }

    // Accesorios computadora
    if (mensaje.match(/computadora|mouse|teclado|pendrive|webcam|pc|compu|usb/)) {
        return buscarPreciosCategoria('accesorios_computadora', mensaje);
    }

    // Stock
    if (mensaje.match(/stock|hay|tienen|disponible|queda|quedan/)) {
        return `📦 Para consultar stock específico de un producto, ` +
               `por favor indica qué producto te interesa.\n\n` +
               `Ejemplo: "¿Hay stock de cuadernos A4?"`;
    }

    // Lista completa
    if (mensaje.match(/lista|precio|catalogo|que tienen|que venden|productos|menu/)) {
        return `📋 *Categorías Disponibles:*\n\n` +
               `📚 Librería\n` +
               `🎉 Cotillón\n` +
               `🧸 Juguetería\n` +
               `📄 Fotocopiadora\n` +
               `🖨️ Impresiones personalizadas\n` +
               `💍 Bijou\n` +
               `📱 Accesorios celular\n` +
               `💻 Accesorios computadora\n\n` +
               `Pregúntame por cualquier categoría! 😊`;
    }

    // Pago
    if (mensaje.match(/pago|efectivo|tarjeta|transfer|mercadopago|debito|credito/)) {
        return `💳 *Medios de Pago:*\n\n${negocioData.medios_pago}`;
    }

    // Contacto
    if (mensaje.match(/contacto|telefono|whatsapp|llamar/)) {
        return `📞 *Contacto*\n\n` +
               `WhatsApp: ${negocioData.whatsapp}\n` +
               `Teléfono: ${negocioData.telefono}\n\n` +
               `¡Estamos para ayudarte! 😊`;
    }

    // Respuesta por defecto
    return `No entendí bien tu consulta 🤔\n\n` +
           `Puedes preguntarme sobre:\n` +
           `• Precios y productos\n` +
           `• Horarios de atención\n` +
           `• Ubicación del local\n` +
           `• Stock disponible\n` +
           `• Servicios de impresión\n` +
           `• Medios de pago\n\n` +
           `¿En qué te puedo ayudar?`;
}

function buscarPreciosCategoria(categoria, mensaje) {
    const datos = listaPrecios[categoria];
    let respuesta = `💰 *Precios - ${categoria.toUpperCase().replace(/_/g, ' ')}*\n\n`;
    
    let contador = 0;
    for (const [subcategoria, productos] of Object.entries(datos)) {
        for (const [nombre, info] of Object.entries(productos)) {
            const stockEmoji = info.stock ? '✅' : '❌';
            const precioTexto = info.precio_desde 
                ? `desde $${info.precio_desde}` 
                : `$${info.precio}${info.unidad ? ' ' + info.unidad : ''}`;
            
            const nombreFormateado = nombre.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            respuesta += `${stockEmoji} ${nombreFormateado}: ${precioTexto}\n`;
            contador++;
        }
    }
    
    if (contador === 0) {
        respuesta += `No encontré productos en esta categoría.\n`;
    }
    
    respuesta += `\n¿Te interesa algo en particular? 😊`;
    return respuesta;
}

// Iniciar bot
conectarWhatsApp();

console.log('🤖 Iniciando bot de WhatsApp...');
console.log('📱 Esperando código QR...');
