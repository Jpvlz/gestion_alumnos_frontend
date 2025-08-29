# Script para ejecutar el frontend (React)
# Ejecutar desde la carpeta gestion_alumnos_frontend

Write-Host "=== Iniciando Frontend React ===" -ForegroundColor Green
Write-Host "Verificando dependencias..." -ForegroundColor Yellow

if (!(Test-Path "node_modules")) {
    Write-Host "Instalando dependencias de Node.js..." -ForegroundColor Yellow
    npm install
}

Write-Host "Iniciando servidor React en http://localhost:3000/" -ForegroundColor Green
Write-Host "" -ForegroundColor White
Write-Host "ASEGURATE de que el backend Django esté corriendo en http://127.0.0.1:8000/" -ForegroundColor Red
Write-Host "" -ForegroundColor White

npm start
