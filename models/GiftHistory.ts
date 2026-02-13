import mongoose from 'mongoose';

const GiftHistorySchema = new mongoose.Schema({
    senderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    receiverId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    giftId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Gift',
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true,
        default: 1
    },
    totalValue: {
        type: Number,
        required: true
    },
    streamId: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const GiftHistoryModel = mongoose.model('GiftHistory', GiftHistorySchema);
