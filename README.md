# Gold Tracker 🥇

App para llevar el control de tus operaciones con oro. Funciona como PWA instalable.

## 🚀 Desplegar en Vercel (5 minutos)

### Opción A: Arrastrar y soltar (la más fácil)

1. Entra a [vercel.com/signup](https://vercel.com/signup) y crea una cuenta gratis (puedes usar GitHub, Google o email)
2. Una vez dentro, ve a [vercel.com/new](https://vercel.com/new)
3. Busca la opción **"Deploy without Git"** o directamente arrastra esta carpeta completa (`gold-tracker`) a la zona indicada
4. Vercel detectará automáticamente que es un proyecto Vite y configurará todo
5. Pulsa **Deploy**
6. En ~1 minuto tendrás una URL tipo `https://gold-tracker-xxx.vercel.app`

### Opción B: Con GitHub (si quieres actualizar fácil en el futuro)

1. Crea una cuenta en [github.com](https://github.com) si no tienes
2. Crea un repositorio nuevo llamado `gold-tracker`
3. Sube todos los archivos de esta carpeta al repo (arrastrando en la web o con git)
4. Ve a [vercel.com/new](https://vercel.com/new), conecta tu GitHub y selecciona el repo
5. Pulsa **Deploy**

## 📱 Instalar en el móvil

Una vez que tengas la URL de Vercel:

### Android (Chrome)
1. Abre la URL en Chrome
2. Verás un banner "Instalar app" o toca el menú (⋮) → **"Instalar aplicación"** / **"Añadir a pantalla de inicio"**
3. Confirma y ya tienes el icono en tu pantalla de inicio

### iPhone (Safari)
1. Abre la URL en Safari (importante: no funciona en Chrome iOS)
2. Toca el botón de **compartir** (el cuadrado con flecha hacia arriba)
3. Desplázate y toca **"Añadir a pantalla de inicio"**
4. Confirma

Una vez instalada, funciona igual que una app nativa: pantalla completa, icono propio, funciona sin internet, y los datos se guardan en tu móvil.

## 🛠 Desarrollo local (opcional)

Si quieres editarla en tu ordenador:

```bash
npm install
npm run dev
```

Para compilar la versión de producción:

```bash
npm run build
```

## 💾 Datos

Las operaciones se guardan en el `localStorage` del navegador/app. Si desinstalas la app o borras los datos del sitio, se perderán. Conviene hacer captura de pantalla de vez en cuando si el historial es importante.
