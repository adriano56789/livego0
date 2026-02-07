import mongoose from 'mongoose';
import { SettingModel } from '../models/Setting.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Configuração para módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configura o dotenv para carregar as variáveis de ambiente
dotenv.config({ path: `${__dirname}/../.env` });

// Carrega as variáveis de ambiente
dotenv.config();

// Configurações do TURN/STUN para salvar
const turnConfig = [
  {
    urls: 'stun:72.60.249.175:3478',
    username: 'livego',
    credential: 'adriano123',
    credentialType: 'password'
  },
  {
    urls: 'turn:72.60.249.175:3478',
    username: 'livego',
    credential: 'adriano123',
    credentialType: 'password'
  }
];

async function saveConfig() {
  try {
    // Conecta ao MongoDB dentro do container Docker
    const mongoUri = 'mongodb://admin:adriano123@localhost:27017/api?authSource=admin';
    console.log('Conectando ao MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Conectado ao MongoDB com sucesso!');
    
    // Salva as configurações
    await SettingModel.findOneAndUpdate(
      { key: 'turn_server_config' },
      { 
        key: 'turn_server_config',
        value: turnConfig 
      },
      { upsert: true, new: true }
    );
    
    console.log('✅ Configurações do TURN/STUN salvas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao salvar configurações:', error);
  } finally {
    // Fecha a conexão com o banco de dados
    await mongoose.connection.close();
    process.exit(0);
  }
}

// Executa a função
saveConfig();
