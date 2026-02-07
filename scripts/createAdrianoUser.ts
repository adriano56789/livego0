// scripts/createAdrianoUser.ts
import mongoose from 'mongoose';
import { UserModel } from '../models/User';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

async function createAdrianoUser() {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://admin:adriano123@localhost:27017/api?authSource=admin');
    console.log('Conectado ao MongoDB');

    // Verificar se o usuário já existe pelo ID ou identificação
    const existingUser = await UserModel.findOne({
      $or: [
        { id: '56281520-adriano' },
        { identification: '56281520' }
      ]
    });

    // Criar hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('adriano123', salt);

    // Dados do usuário
    const userData = {
      id: '56281520-adriano',
      identification: '56281520',
      name: 'Adriano',
      email: 'adrianomdk5@gmail.com',
      password: hashedPassword,
      emailVerified: true,
      avatarUrl: 'https://picsum.photos/seed/adriano/100/100',
      coverUrl: 'https://picsum.photos/seed/adriano-cover/400/800',
      country: 'br',
      age: 32,
      gender: 'male',
      level: 1,
      xp: 0,
      isOnline: true,
      lastSeen: new Date().toISOString(),
      fans: 0,
      following: 0,
      diamonds: 1234,
      earnings: 5678,
      earnings_withdrawn: 0,
      bio: 'CEO e co-fundador da LiveGo',
      ownedFrames: [],
      activeFrameId: null,
      frameExpiration: null,
      isVIP: false,
      preferences: {
        chatConfig: {
          filterSpam: true,
          autoTranslate: false
        },
        giftOrdering: {}
      }
    };

    let result;
    if (existingUser) {
      // Atualizar usuário existente
      result = await UserModel.findOneAndUpdate(
        { $or: [
            { id: '56281520-adriano' },
            { identification: '56281520' }
          ] },
        { $set: userData },
        { new: true, upsert: true }
      );
      console.log('Usuário Adriano atualizado com sucesso:', result);
    } else {
      // Criar novo usuário
      const adrianoUser = new UserModel(userData);
      result = await adrianoUser.save();
      console.log('Usuário Adriano criado com sucesso:', result);
    }

    // Fechar a conexão
    await mongoose.connection.close();
    console.log('Conexão com o MongoDB fechada');

  } catch (error) {
    console.error('Erro ao criar usuário Adriano:', error);
    process.exit(1);
  }
}

createAdrianoUser();