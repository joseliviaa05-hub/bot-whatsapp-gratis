# 🤖 Bot de WhatsApp GRATIS - Negocio Multirubro

Bot completamente gratuito para WhatsApp sin costos de APIs.

## ✅ Características

- 🆓 **100% Gratis** - Sin costos de API
- 🔒 **Privado** - Corre en tu propio servidor
- 🚀 **Fácil de usar** - Solo escanear QR
- 📝 **Personalizable** - Edita precios fácilmente
- ⚡ **Sin límites** - Mensajes ilimitados
- 🤖 **Inteligente** - Responde automáticamente consultas comunes

## 🛍️ Funcionalidades

El bot puede responder automáticamente sobre:
- ✏️ Librería (cuadernos, lapiceras, etc.)
- 🎉 Cotillón (globos, decoraciones, etc.)
- 🧸 Juguetería (didácticos, peluches, etc.)
- 📄 Fotocopiadora (B/N, color)
- 🖨️ Impresiones personalizadas (remeras, tazas, etc.)
- 💍 Bijou (aros, collares, pulseras)
- 📱 Accesorios para celulares
- 💻 Accesorios para computadoras
- 🕐 Horarios de atención
- 📍 Ubicación del local
- 💳 Medios de pago
- 📦 Consultas de stock

## 🚀 Instalación

### Opción A: En tu PC (Para probar)

```bash
# 1. Clonar el repositorio
git clone https://github.com/joseliviaa05-hub/bot-whatsapp-gratis.git
cd bot-whatsapp-gratis

# 2. Instalar dependencias
npm install

# 3. Iniciar el bot
npm start

# 4. Escanear el código QR que aparece en la consola con WhatsApp
```

### Opción B: En Render (24/7 GRATIS)

1. **Fork este repositorio** en tu cuenta de GitHub
2. Ve a [render.com](https://render.com) y crea una cuenta gratuita
3. Click en **"New +"** → **"Web Service"**
4. Conecta tu repositorio de GitHub
5. Configura:
   - **Name**: bot-whatsapp
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Click en **"Create Web Service"**
7. Ve a los **Logs** y copia el código QR
8. Escanea el QR con tu **WhatsApp Business**

## 📝 Personalizar tu Bot

### 1. Editar información del negocio

Abre `data/negocio.json` y modifica:

```json
{
  "nombre": "TU NOMBRE DE NEGOCIO",
  "horarios": "Lunes a Viernes: 9:00 - 20:00\nSábados: 9:00 - 14:00",
  "direccion": "Tu dirección completa",
  "telefono": "+54 9 11 XXXX-XXXX",
  "whatsapp": "+54 9 11 XXXX-XXXX",
  "medios_pago": "• Efectivo\n• Débito\n• Crédito\n• Transferencia"
}
```

### 2. Actualizar lista de precios

Edita `data/lista-precios.json` con tus productos y precios:

```json
{
  "libreria": {
    "cuadernos": {
      "cuaderno_tapa_dura_A4": {
        "precio": 2500,
        "stock": true
      }
    }
  }
}
```

El bot actualizará automáticamente sin necesidad de reiniciar.

## 🔧 Mantener Activo 24/7 en Render (Gratis)

Render te da 750 horas gratis al mes. Para evitar que se duerma:

1. Ve a [cron-job.org](https://cron-job.org) (gratis)
2. Crea una cuenta
3. Crea un nuevo cron job:
   - URL: `https://tu-bot.onrender.com/health`
   - Intervalo: Cada 14 minutos
4. ¡Listo! Tu bot estará siempre activo

## 💬 Ejemplos de Conversación

**Cliente:** "Hola"
**Bot:** "¡Hola! 👋 Bienvenido a *Tu Negocio*
Te puedo ayudar con:
📋 Lista de precios
🕐 Horarios
📍 Ubicación..."

**Cliente:** "Cuánto sale un cuaderno?"
**Bot:** "💰 Precios - LIBRERÍA
✅ cuaderno tapa dura A4: $2500
✅ cuaderno espiral 21x27: $1800..."

**Cliente:** "Horarios?"
**Bot:** "🕐 Horarios de Atención
Lunes a Viernes: 9:00 - 20:00..."

**Cliente:** "Hacen impresiones en remeras?"
**Bot:** "💰 Precios - IMPRESIONES
✅ remera sublimada: $8500
💡 Servicios disponibles:
- Sublimación en remeras..."

## 🆚 Comparación de Opciones

| Característica | Gratis (Baileys) | Con Twilio |
|----------------|------------------|------------|
| 💰 Costo mensual | $0 | ~$150* |
| 🛠️ Dificultad setup | Media | Fácil |
| 📱 Escaneo QR | Sí | No |
| 📊 Límite mensajes | Ilimitado | Por mensaje |
| 🤖 IA Avanzada | No | Sí (extra) |
| 🔒 Privacidad | Total | Compartida |

*Estimado para ~1000 mensajes/mes

## ⚠️ Consideraciones Importantes

1. **Código QR**: Debes escanear el QR con WhatsApp Business al iniciar
2. **Reconexión**: Si Render reinicia el servicio, hay que re-escanear el QR
3. **WhatsApp Business**: Usa una cuenta de WhatsApp Business, no personal
4. **Límites de WhatsApp**: Respeta los límites de WhatsApp para evitar bloqueos
5. **Respaldo**: Guarda la carpeta `auth_info` para no perder la sesión

## 🐛 Solución de Problemas

### El bot no responde
- Verifica que el servicio esté corriendo en Render
- Revisa los logs en Render Dashboard
- Asegúrate de haber escaneado el QR correctamente

### Perdí la conexión
- Vuelve a escanear el QR code desde los logs
- Si persiste, elimina la carpeta `auth_info` y reconecta

### Error al iniciar
- Verifica que todas las dependencias estén instaladas: `npm install`
- Confirma que los archivos JSON en `/data` sean válidos

## 📚 Tecnologías Utilizadas

- **Baileys** - WhatsApp Web API
- **Node.js** - Runtime
- **Express** - Servidor HTTP
- **Pino** - Logging

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar el bot:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/mejora`)
3. Commit tus cambios (`git commit -m 'Agregar mejora'`)
4. Push a la rama (`git push origin feature/mejora`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto bajo la licencia MIT.

## 💡 Próximas Mejoras

- [ ] Sistema de pedidos automático
- [ ] Integración con Google Sheets para inventario
- [ ] Envío automático de catálogo PDF
- [ ] Panel de administración web
- [ ] Estadísticas de conversaciones
- [ ] Respuestas con IA (opcional)

## 📞 Soporte

Si necesitas ayuda:
- 📧 Abre un Issue en GitHub
- 💬 Consulta la documentación
- 🌟 Dale star al proyecto si te fue útil

---

Hecho con ❤️ para pequeños negocios

⭐ Si este proyecto te ayudó, dale una estrella en GitHub