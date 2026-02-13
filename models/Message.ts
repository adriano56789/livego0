import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
    id: string;
    chatId: string;
    fromUserId: string;
    toUserId?: string;
    text: string;
    imageUrl?: string;
    status: 'sent' | 'delivered' | 'read';
    type?: string;
    user?: any;
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
    id: { type: String, required: true, unique: true },
    chatId: { type: String, required: true, index: true },
    fromUserId: { type: String, required: true, index: true },
    toUserId: { type: String, index: true },
    text: { type: String, required: true },
    imageUrl: { type: String },
    type: { type: String, default: 'chat' },
    status: { 
        type: String, 
        enum: ['sent', 'delivered', 'read'], 
        default: 'sent' 
    },
    user: { type: Schema.Types.Mixed },
}, { 
    timestamps: true,
    toJSON: {
        transform: function(doc: any, ret: any) {
            // Criando um novo objeto com as propriedades desejadas
            const result = {
                ...ret,
                id: ret._id.toString()
            };
            // Removendo propriedades indesejadas
            delete result._id;
            delete result.__v;
            return result;
        }
    }
});

// Índice composto para consultas otimizadas
MessageSchema.index({ chatId: 1, createdAt: -1 });

export const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);
