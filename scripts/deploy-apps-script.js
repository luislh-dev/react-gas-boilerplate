import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function deployToAppsScript() {
  // Subir un nivel desde scripts/ para llegar a la raíz del proyecto
  const projectRoot = path.join(__dirname, '..');
  const localDistDir = path.join(projectRoot, 'dist');
  // Cambiar la ruta para que apunte a form/server/dist (mismo nivel)
  const serverDistDir = path.join(projectRoot, 'server', 'dist');
  const indexHtmlPath = path.join(localDistDir, 'index.html');
  
  // Diagnóstico mejorado
  console.log('🔍 Diagnóstico:');
  console.log(`   Directorio del script: ${__dirname}`);
  console.log(`   Raíz del proyecto: ${projectRoot}`);
  console.log(`   Buscando en: ${localDistDir}`);
  console.log(`   Generando en: ${serverDistDir}`);
  console.log(`   Archivo index.html: ${indexHtmlPath}`);
  
  // Verificar que existe el directorio dist
  if (!fs.existsSync(localDistDir)) {
    console.error(`❌ No existe el directorio: ${localDistDir}`);
    return;
  }
  
  // Listar contenido del directorio dist
  console.log('\n📁 Contenido del directorio dist:');
  try {
    const files = fs.readdirSync(localDistDir);
    files.forEach(file => {
      const filePath = path.join(localDistDir, file);
      const stats = fs.statSync(filePath);
      console.log(`   ${stats.isDirectory() ? '📁' : '📄'} ${file}`);
    });
  } catch (error) {
    console.error(`❌ Error listando directorio dist: ${error.message}`);
    return;
  }
  
  // Verificar que existe el build local
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('\n❌ No se encontró dist/index.html.');
    console.error('💡 Posibles soluciones:');
    console.error('   1. Ejecuta "npm run build" de nuevo');
    console.error('   2. Verifica que el build se complete sin errores');
    console.error('   3. Verifica la configuración de vite.config.js');
    return;
  }
  
  console.log('\n✅ Archivo index.html encontrado');
  
  // Crear directorio server/dist si no existe
  if (!fs.existsSync(serverDistDir)) {
    fs.mkdirSync(serverDistDir, { recursive: true });
    console.log(`✅ Creado directorio: ${serverDistDir}`);
  } else {
    // Limpiar directorio existente
    fs.rmSync(serverDistDir, { recursive: true });
    fs.mkdirSync(serverDistDir, { recursive: true });
    console.log(`✅ Limpiado directorio: ${serverDistDir}`);
  }
  
  // Leer el HTML generado
  let htmlContent;
  try {
    htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
    console.log(`✅ HTML leído (${htmlContent.length} caracteres)`);
  } catch (error) {
    console.error(`❌ Error leyendo HTML: ${error.message}`);
    return;
  }
  
  // Extraer rutas de CSS y JS (que están en assets/)
  const cssMatch = htmlContent.match(/href="([^"]*\.css)"/);
  const jsMatch = htmlContent.match(/src="([^"]*\.js)"/);
  
  if (!cssMatch || !jsMatch) {
    console.error('❌ No se encontraron archivos CSS o JS en el HTML');
    console.error('\n📄 Contenido del HTML:');
    console.error(htmlContent.substring(0, 500) + '...');
    return;
  }
  
  console.log(`✅ Referencias encontradas:`);
  console.log(`   CSS: ${cssMatch[1]}`);
  console.log(`   JS: ${jsMatch[1]}`);
  
  // Las rutas incluyen assets/, ejemplo: "/assets/index-abc123.css"
  const cssPath = path.join(localDistDir, cssMatch[1].replace(/^\//, ''));
  const jsPath = path.join(localDistDir, jsMatch[1].replace(/^\//, ''));
  
  console.log(`\n🔍 Rutas absolutas:`);
  console.log(`   CSS: ${cssPath}`);
  console.log(`   JS: ${jsPath}`);
  
  // Verificar que existen los archivos en assets/
  if (!fs.existsSync(cssPath)) {
    console.error(`❌ No se encontró el archivo CSS: ${cssPath}`);
    return;
  }
  
  if (!fs.existsSync(jsPath)) {
    console.error(`❌ No se encontró el archivo JS: ${jsPath}`);
    return;
  }
  
  console.log('✅ Archivos CSS y JS encontrados');
  
  // Leer contenido de CSS y JS
  let cssContent, jsContent;
  try {
    cssContent = fs.readFileSync(cssPath, 'utf8');
    jsContent = fs.readFileSync(jsPath, 'utf8');
    console.log(`✅ Archivos leídos - CSS: ${cssContent.length} chars, JS: ${jsContent.length} chars`);
  } catch (error) {
    console.error(`❌ Error leyendo archivos: ${error.message}`);
    return;
  }
  
  // Crear archivos HTML para Apps Script con etiquetas apropiadas
  try {
    // Envolver CSS en etiquetas <style>
    const styledCss = `<style>
${cssContent}
</style>`;
    
    // Envolver JS en etiquetas <script>
    const scriptedJs = `<script>
${jsContent}
</script>`;
    
    fs.writeFileSync(path.join(serverDistDir, 'app-styles.html'), styledCss);
    fs.writeFileSync(path.join(serverDistDir, 'app-script.html'), scriptedJs);
    console.log('✅ Archivos app-styles.html y app-script.html creados con etiquetas HTML');
  } catch (error) {
    console.error(`❌ Error escribiendo archivos: ${error.message}`);
    return;
  }
  
  // Crear HTML principal con includes
  const newHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Q&A Chat</title>
    <?!= include('dist/app-styles') ?>
</head>
<body>
    <div id="root"></div>
    
    <?!= include('dist/app-script') ?>
</body>
</html>`;
  
  // Crear el index.html procesado
  try {
    fs.writeFileSync(path.join(serverDistDir, 'index.html'), newHtml);
    console.log('✅ index.html procesado creado');
  } catch (error) {
    console.error(`❌ Error creando index.html: ${error.message}`);
    return;
  }
  
  console.log('\n🎉 Deploy completado exitosamente en D:\\form\\server\\dist:');
  console.log('   📄 index.html (con includes)');
  console.log('   📄 app-styles.html (CSS envuelto en <style>)');
  console.log('   📄 app-script.html (JS envuelto en <script>)');
  console.log('');
  console.log('📂 Archivos procesados desde:');
  console.log(`   CSS: ${cssMatch[1]}`);
  console.log(`   JS: ${jsMatch[1]}`);
  console.log('');
  console.log('🚀 Archivos listos para subir a Apps Script!');
  
  // Ejecutar clasp push desde el directorio server
  const serverDir = path.join(projectRoot, 'server');
  console.log('\n📤 Ejecutando clasp push...');
  try {
    execSync('clasp push', { 
      cwd: serverDir,
      stdio: 'inherit'
    });
    console.log('✅ clasp push completado exitosamente!');
  } catch (error) {
    console.error('❌ Error ejecutando clasp push:', error.message);
    console.error('💡 Asegúrate de que clasp esté instalado y autenticado');
    process.exit(1);
  }
}

deployToAppsScript();