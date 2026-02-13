import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    identification: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    emailVerified: { type: Boolean, default: false },
    emailVerificationCode: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },
    diamonds: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    avatarUrl: String,
    coverUrl: String,
    fans: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    followingIds: [{ type: String }],
    isOnline: { type: Boolean, default: false },
    activeFrameId: { type: String, default: null },
    ownedFrames: [{ frameId: String, expirationDate: String }],
    ownedGifts: [{ giftId: String, quantity: Number }],
    billingAddress: {
        street: String,
        number: String,
        district: String,
        city: String,
        zip: String
    },
    creditCardInfo: {
        last4: String,
        brand: String,
        expiry: String
    },
    fcmTokens: { type: [String], default: [] },
    preferences: {
        giftOrdering: { type: Map, of: [String], default: {} },
        chatConfig: {
            filterSpam: { type: Boolean, default: true },
            autoTranslate: { type: Boolean, default: false }
        }
    },
    cameraPermission: {
        status: { type: String, enum: ['granted', 'denied', 'prompt'], default: 'prompt' },
        updatedAt: { type: Date, default: Date.now }
    },
    microphonePermission: {
        status: { type: String, enum: ['granted', 'denied', 'prompt'], default: 'prompt' },
        updatedAt: { type: Date, default: Date.now }
    },
    notificationSettings: {
        newMessages: { type: Boolean, default: true },
        streamerLive: { type: Boolean, default: true },
        newFollower: { type: Boolean, default: true },
        followedPosts: { type: Boolean, default: true },
        pedido: { type: Boolean, default: true },
        interactive: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        giftAlertsOnScreen: { type: Boolean, default: true },
        giftSoundEffects: { type: Boolean, default: true },
        giftLuxuryBanners: { type: Boolean, default: true },
        updatedAt: { type: Date, default: Date.now }
    }
}, { 
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            delete (ret as any)._id;
            delete (ret as any).__v;
            delete (ret as any).password;
            return ret;
        }
    }
});

export const UserModel = mongoose.model('User', UserSchema);