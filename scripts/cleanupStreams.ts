// scripts/cleanupStreams.ts
import mongoose from 'mongoose';
import { StreamerModel } from '../models/Streamer';

const MONGODB_URI = 'mongodb://admin:adriano123@localhost:27017/api?authSource=admin';

async function cleanup() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado ao banco de dados com sucesso!');
    
    // Remove todas as transmissões do usuário 56281520
    const result = await StreamerModel.deleteMany({ 
      $or: [
        { id: '56281520' },
        { hostId: '56281520' }
      ] 
    });
    
    console.log(`Foram removidas ${result.deletedCount} transmissões.`);
    process.exit(0);
  } catch (error) {
    console.error('Erro ao limpar as transmissões:', error);
    process.exit(1);
  }
}

cleanup();
