import mongoose from 'mongoose';
import { UserModel } from '../models/User.js';
import bcrypt from 'bcryptjs';
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

// Função para criar ou atualizar o usuário
async function createOrUpdateUser() {
  try {
    // Primeiro, verifica se já existe um usuário com o ID 56281520
    const existingUserWithId = await UserModel.findOne({ id: '56281520' });
    
    // Verifica se o usuário com o email já existe
    const existingUserByEmail = await UserModel.findOne({ email: 'adrianomdk5@gmail.com' });
    
    // Se o usuário com o email já existe e é diferente do usuário com o ID 56281520
    if (existingUserByEmail && (!existingUserWithId || existingUserWithId._id.toString() !== existingUserByEmail._id.toString())) {
      console.log('Atualizando usuário existente com o email adrianomdk5@gmail.com...');
      
      // Se já existir um usuário com o ID 56281520, remove o ID duplicado primeiro
      if (existingUserWithId) {
        console.log('Removendo usuário duplicado com ID 56281520...');
        await UserModel.deleteOne({ _id: existingUserWithId._id });
      }
      
      // Atualiza o usuário existente com o email para ter o ID 56281520
      existingUserByEmail.id = '56281520';
      existingUserByEmail.name = existingUserByEmail.name || 'Adriano';
      existingUserByEmail.emailVerified = true;
      existingUserByEmail.diamonds = existingUserByEmail.diamonds || 1000;
      existingUserByEmail.level = existingUserByEmail.level || 10;
      existingUserByEmail.isOnline = true;
      
      const updatedUser = await existingUserByEmail.save();
      console.log('Usuário atualizado com sucesso:', updatedUser);
      return updatedUser;
    }
    // Se o usuário com o ID 56281520 já existe e é o mesmo que o usuário com o email
    else if (existingUserWithId) {
      console.log('Usuário com ID 56281520 já existe. Atualizando informações...');
      
      // Atualiza os campos do usuário existente
      existingUserWithId.email = 'adrianomdk5@gmail.com';
      existingUserWithId.name = existingUserWithId.name || 'Adriano';
      existingUserWithId.emailVerified = true;
      existingUserWithId.diamonds = existingUserWithId.diamonds || 1000;
      existingUserWithId.level = existingUserWithId.level || 10;
      existingUserWithId.isOnline = true;
      
      const updatedUser = await existingUserWithId.save();
      console.log('Usuário atualizado com sucesso:', updatedUser);
      return updatedUser;
    }

    // Se não existir, cria um novo usuário
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('sua_senha_aqui', salt);

    const newUser = new UserModel({
      id: '56281520',
      name: 'Adriano',
      email: 'adrianomdk5@gmail.com',
      password: hashedPassword,
      emailVerified: true,
      diamonds: 1000,
      level: 10,
      isOnline: true,
      preferences: {
        chatConfig: {
          filterSpam: true,
          autoTranslate: false
        },
        giftOrdering: {}
      }
    });

    const savedUser = await newUser.save();
    console.log('Novo usuário criado com sucesso:', savedUser);
    return savedUser;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
}

// Função principal
async function main() {
  try {
    await connectDB();
    await createOrUpdateUser();
    process.exit(0);
  } catch (error) {
    console.error('Erro ao executar o script:', error);
    process.exit(1);
  }
}

// Executa a função principal
main();
