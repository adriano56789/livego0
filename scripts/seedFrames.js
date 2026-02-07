require('dotenv').config();
const mongoose = require('mongoose');
const { FrameModel } = require('../models/Frame');

const frames = [
    { id: 'FrameBlazingSunIcon', name: 'Sol Escaldante', price: 500, duration: 30, category: 'avatar', active: true },
    { id: 'FrameBlueCrystalIcon', name: 'Cristal Azul', price: 300, duration: 30, category: 'avatar', active: true },
    { id: 'FrameBlueFireIcon', name: 'Fogo Azul', price: 600, duration: 30, category: 'avatar', active: true },
    { id: 'FrameDiamondIcon', name: 'Diamante', price: 1000, duration: 30, category: 'avatar', active: true },
    { id: 'FrameFloralWreathIcon', name: 'Coroa Floral', price: 400, duration: 30, category: 'avatar', active: true },
    { id: 'FrameGoldenFloralIcon', name: 'Floral Dourado', price: 800, duration: 30, category: 'avatar', active: true },
    { id: 'FrameIcyWingsIcon', name: 'Asas de Gelo', price: 1200, duration: 30, category: 'avatar', active: true },
    { id: 'FrameMagentaWingsIcon', name: 'Asas Magenta', price: 1100, duration: 30, category: 'avatar', active: true },
    { id: 'FrameNeonDiamondIcon', name: 'Diamante Neon', price: 1500, duration: 30, category: 'avatar', active: true },
    { id: 'FrameNeonPinkIcon', name: 'Neon Rosa', price: 750, duration: 30, category: 'avatar', active: true },
    { id: 'FrameOrnateBronzeIcon', name: 'Bronze Ornate', price: 250, duration: 30, category: 'avatar', active: true },
    { id: 'FramePinkGemIcon', name: 'Gema Rosa', price: 900, duration: 30, category: 'avatar', active: true },
    { id: 'FramePinkLaceIcon', name: 'Renda Rosa', price: 350, duration: 30, category: 'avatar', active: true },
    { id: 'FramePurpleFloralIcon', name: 'Floral Roxo', price: 650, duration: 30, category: 'avatar', active: true },
    { id: 'FrameRegalPurpleIcon', name: 'Roxo Real', price: 2000, duration: 30, category: 'avatar', active: true },
    { id: 'FrameRoseHeartIcon', name: 'Coração de Rosa', price: 1800, duration: 30, category: 'avatar', active: true },
    { id: 'FrameSilverBeadedIcon', name: 'Prata Frisado', price: 200, duration: 30, category: 'avatar', active: true },
    { id: 'FrameSilverThornIcon', name: 'Espinho de Prata', price: 450, duration: 30, category: 'avatar', active: true }
];

async function seedFrames() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://adriano123:admin@localhost:27017/api?authSource=api');
        console.log('Conectado ao MongoDB');

        // Remove todos os frames existentes
        await FrameModel.deleteMany({});
        console.log('Frames antigos removidos');

        // Insere os novos frames
        await FrameModel.insertMany(frames);
        console.log('Frames inseridos com sucesso!');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Erro ao popular o banco de dados:', error);
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
        process.exit(1);
    }
}

seedFrames();
