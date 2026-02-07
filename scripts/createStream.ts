// scripts/createStream.ts
import mongoose from 'mongoose';
import { StreamerModel } from '../models/Streamer';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

// URL de conexão com o MongoDB
const MONGODB_URI = 'mongodb://admin:adriano123@localhost:27017/api?authSource=admin';

// Função para conectar ao banco de dados
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado ao banco de dados com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  }
}

// Função para criar uma nova transmissão
async function createStream() {
  try {
    // Verifica se já existe uma transmissão para este usuário
    const existingStream = await StreamerModel.findOne({ hostId: '56281520' });
    
    if (existingStream) {
      console.log('Já existe uma transmissão para este usuário:', existingStream);
      return existingStream;
    }

    // Cria uma nova transmissão
    const newStream = new StreamerModel({
      id: '56281520',
      hostId: '56281520',
      name: 'Transmissão do Adriano',
      avatar: 'https://picsum.photos/seed/56281520/200',
      thumbnail: 'https://picsum.photos/seed/stream-56281520/400/600',
      category: 'Popular',
      viewers: 0,
      location: 'Sua Localização',
      isPrivate: false,
      isLive: true,
      quality: '1080p',
      tags: ['Ao Vivo', 'Bate-papo'],
      startedAt: new Date()
    });

    const savedStream = await newStream.save();
    console.log('Nova transmissão criada com sucesso:', savedStream);
    return savedStream;
  } catch (error) {
    console.error('Erro ao criar transmissão:', error);
    throw error;
  }
}

// Função principal
async function main() {
  try {
    await connectDB();
    await createStream();
    process.exit(0);
  } catch (error) {
    console.error('Erro ao executar o script:', error);
    process.exit(1);
  }
}

// Executa a função principal
main();