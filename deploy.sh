#!/bin/bash
# Script para fazer deploy da aplicação LiveGo na VPS

# Garante que o script pare se algum comando falhar
set -e

echo "--- [PASSO 1/4] Navegando para a pasta do projeto..."
cd /var/www/livego10

echo "--- [PASSO 2/4] Instalando/atualizando dependências..."
npm install

echo "--- [PASSO 3/4] Compilando todo o projeto (Frontend e Backend)..."
npm run build

echo "--- [PASSO 4/4] (Re)iniciando o servidor da API com PM2 (Zero-Downtime)..."
npm run vps:deploy # Este comando agora usa o novo e mais seguro ecosystem.config.cjs

echo "--- Salvando a configuração do PM2 para reiniciar com o servidor..."
pm2 save

echo "--- ✅ DEPLOY CONCLUÍDO! ---"
echo "O backend 'livego-backend' foi atualizado e está online."
echo "Para ver os logs, use: npm run vps:logs"
pm2 status
