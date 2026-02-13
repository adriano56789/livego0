// vite.config.ts

import { defineConfig, loadEnv } from 'vite';

import react from '@vitejs/plugin-react';

import path from 'path';

import fs from 'fs';



export default defineConfig(({ mode }) => {

  // Carrega as variáveis de ambiente do arquivo .env

  const env = loadEnv(mode, process.cwd(), '');

  

  // Configurações específicas para desenvolvimento

  const devConfig = {

    define: {

      'process.env': env,

      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL || 'http://localhost:3000'),

    },

    server: {

      port: 5173,

      host: '0.0.0.0',

      strictPort: true,

      hmr: {

        host: 'localhost',

        port: 5173,

        protocol: 'ws',

        clientPort: 5173

      },

      watch: {

        usePolling: true

      },

      proxy: {

        '/api': {
            target: 'http://localhost:3000',
            changeOrigin: true,
            secure: false,
            ws: true
        },

        '/socket.io': {

          target: 'http://localhost:3000',

          ws: true,

          changeOrigin: true,

          secure: false

        }

      }

    },

  };



  // Configurações para produção

  const prodConfig = {

    define: {

      'process.env': env,

      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL || 'https://livego.store'),

    },

    server: {

      port: 3000,

      host: '0.0.0.0',

      strictPort: true

    },

  };



  // Usa configuração de desenvolvimento ou produção baseado no modo

  const config = mode === 'development' ? devConfig : prodConfig;



  return {

    ...config,

    resolve: {

      alias: [

        {

          // Isso permite que @/ seja usado para importar a partir da raiz do projeto

          find: '@',

          replacement: path.resolve(__dirname, './')

        },

        {

          // Alias específico para components

          find: '@components',

          replacement: path.resolve(__dirname, './components')

        },

        {

          // Alias específico para services

          find: '@services',

          replacement: path.resolve(__dirname, './services')

        }

      ]

    },

    define: {

      // Expõe as variáveis de ambiente para o frontend

      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL || 'https://livego.store'),

      'import.meta.env.VITE_WS_URL': JSON.stringify(env.VITE_WS_URL || 'wss://livego.store')

    },

    plugins: [react()]

  };

});