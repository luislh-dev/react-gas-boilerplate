# React + TypeScript + Vite → Google Apps Script

Boilerplate para desarrollar aplicaciones React que se despliegan automáticamente a Google Apps Script.

## 🚀 Stack Tecnológico

- **React 19** + **TypeScript** + **Vite 7**
- **ESLint 9** con configuración optimizada
- **Deploy automático** a Google Apps Script
- **Integración con clasp**
- **pnpm** como gestor de paquetes

## 📁 Estructura

```
react-gas-boilerplate/         # Proyecto principal
├── src/                       # Código fuente de React
│   ├── App.tsx               # Componente principal
│   ├── main.tsx              # Punto de entrada
│   ├── App.css               # Estilos del componente
│   └── index.css             # Estilos globales
├── public/                    # Archivos estáticos
├── dist/                      # Build generado por Vite
├── server/                    # Directorio de Apps Script
│   ├── dist/                  # Archivos procesados para Apps Script
│   ├── Code.js                # Código del backend de Apps Script
│   ├── .clasp.json            # Configuración de clasp
│   └── appsscript.json        # Configuración del proyecto Apps Script
├── scripts/                   # Scripts de deployment
│   └── deploy-apps-script.js  # Script de deploy automatizado
├── index.html                 # Template HTML principal
├── vite.config.ts             # Configuración de Vite
├── eslint.config.js           # Configuración de ESLint
├── tsconfig.json              # Configuración de TypeScript
└── package.json               # Dependencias y scripts
```

## ⚡ Inicio Rápido

### 1. Instalación
```bash
pnpm install
npm install -g @google/clasp
```

### 2. Configurar Google Apps Script

1. **Habilitar API**: Ve a [Google Apps Script API](https://script.google.com/home/usersettings) y actívala
2. **Autenticar**: `clasp login`
3. **Configurar proyecto**:
   ```bash
   cp server/.clasp.example.json server/.clasp.json
   ```
4. **Editar `.clasp.json`** con tu Script ID:
   ```json
   {
     "scriptId": "TU_SCRIPT_ID_AQUI"
   }
   ```

> **Obtener Script ID**: Crea un proyecto en [Google Apps Script](https://script.google.com/) y copia el ID de la URL

## 🔄 Comandos

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo con hot reload |
| `pnpm build` | Build de producción (TypeScript + Vite) |
| `pnpm deploy` | **Build + Deploy automático a Apps Script** |
| `pnpm preview` | Preview del build de producción |
| `pnpm lint` | Ejecutar ESLint con reglas actualizadas |
| `clasp:push` | Subir archivos manualmente a Apps Script |
| `clasp:pull` | Descargar archivos desde Apps Script |
| `clasp:open` | Abrir el proyecto en el editor de Apps Script |
| `clasp:webapp` | Abrir la aplicación web desplegada |

## 🚀 Deploy Automático

```bash
pnpm run deploy
```

**Proceso automático**:
1. Compilación TypeScript (`tsc -b`)
2. Build con Vite optimizado
3. Extrae CSS y JS del HTML generado
4. Convierte archivos a formato compatible con Apps Script
5. Genera archivos HTML con includes para Apps Script
6. Sube automáticamente usando `clasp push`

### Archivos generados en `server/dist/`:
- `index.html` - Página principal con sintaxis de includes de Apps Script
- `app-styles.html` - CSS envuelto en etiquetas `<style>`
- `app-script.html` - JavaScript envuelto en etiquetas `<script>`

## 🎯 Flujo de Trabajo

1. **Desarrolla** en `src/` usando React + TypeScript
2. **Prueba** localmente con `pnpm dev`
3. **Despliega** automáticamente con `pnpm deploy`
4. **Gestiona** el backend en `server/Code.js`

### Sintaxis de includes en Apps Script:
```html
<?!= include('dist/app-styles') ?>
<?!= include('dist/app-script') ?>
```

## 🤝 Uso como Boilerplate

1. **Clona** este repositorio
2. **Configura** tu proyecto de Apps Script con `.clasp.json`
3. **Desarrolla** tu aplicación React en `src/`
4. **Mantén** el script de deploy para automatización
5. **Personaliza** según tus necesidades específicas

### Problemas comunes:

1. **Error de clasp**: Asegúrate de estar autenticado con `clasp login`
2. **Build fallido**: Verifica errores de TypeScript con `pnpm build`
3. **Deploy fallido**: Revisa que `.clasp.json` tenga el Script ID correcto
4. **Dependencias**: Ejecuta `pnpm install` si faltan packages

### Logs detallados:
El script de deploy proporciona logs detallados del proceso de conversión y subida de archivos.