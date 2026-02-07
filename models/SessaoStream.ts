import mongoose from 'mongoose';

const SessaoStreamSchema = new mongoose.Schema({
    idUsuario: { type: String, required: true, index: true },
    urlStream: { type: String, required: true, index: true },
    sdp: { type: String, required: true },
    idSessao: { type: String, required: true, index: true },
    status: { 
        type: String, 
        enum: ['ativo', 'encerrado', 'falha'], 
        default: 'ativo' 
    },
    dataInicio: { type: Date, default: Date.now },
    dataFim: { type: Date },
    metadados: { type: Object, default: {} }
}, { timestamps: true });

export const SessaoStreamModel = mongoose.model('SessaoStream', SessaoStreamSchema);
