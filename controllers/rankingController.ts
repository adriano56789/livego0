import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../utils/response.js';
import { UserModel } from '../models/User.js';
import { GiftHistoryModel } from '../models/GiftHistory.js';
import { startOfDay, startOfWeek, startOfMonth } from 'date-fns';
import { Types } from 'mongoose';

interface RankedUser {
    _id: string;
    username: string;
    avatarUrl: string;
    level: number;
    isOnline: boolean;
    diamonds: number;
    fans: number;
    following: number;
    rank: number;
    totalGifts: number;
    totalValue: number;
    isFollowing: boolean;
}

interface AuthenticatedRequest extends Request {
    user?: {
        _id: Types.ObjectId;
    };
}

export const rankingController = {
    getCombinedRankings: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const now = new Date();
            const periods = [
                { type: 'daily', start: startOfDay(now) },
                { type: 'weekly', start: startOfWeek(now, { weekStartsOn: 1 }) },
                { type: 'monthly', start: startOfMonth(now) }
            ];

            const results = await Promise.all(periods.map(async ({ type, start }) => {
                const giftHistory = await GiftHistoryModel.aggregate([
                    { $match: { createdAt: { $gte: start, $lte: now } } },
                    {
                        $group: {
                            _id: '$receiverId',
                            totalValue: { $sum: { $multiply: ['$giftValue', '$quantity'] } },
                            giftCount: { $sum: 1 }
                        }
                    },
                    { $sort: { totalValue: -1 } },
                    { $limit: 100 }
                ]);

                const userIds = giftHistory.map((item: any) => item._id);
                const users = await UserModel.find({ _id: { $in: userIds } }).lean();

                const ranking = giftHistory.map((item: any, index: number) => {
                    const user = users.find((u: any) => u._id.toString() === item._id.toString());
                    if (!user) return null;
                    
                    const isFollowing = Array.isArray(user.followingIds) 
                        ? user.followingIds.includes(req.user?._id?.toString() || '') 
                        : false;
                    
                    return {
                        _id: user._id.toString(),
                        username: user.name || 'Usuário',
                        avatarUrl: user.avatarUrl || '',
                        level: user.level || 1,
                        isOnline: user.isOnline || false,
                        diamonds: user.diamonds || 0,
                        fans: user.fans || 0,
                        following: user.following || 0,
                        rank: index + 1,
                        totalGifts: item.giftCount || 0,
                        totalValue: item.totalValue || 0,
                        isFollowing
                    } as RankedUser;
                }).filter(Boolean);

                return { type, ranking };
            }));

            const response = results.reduce((acc, { type, ranking }) => ({
                ...acc,
                [type]: ranking
            }), {});

            return sendSuccess(res, response);
        } catch (error) {
            next(error);
        }
    },
    
    getRanking: (type: string) => async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let startDate: Date;
            const endDate = new Date();
            
            // Set start date based on ranking type
            switch (type) {
                case 'daily':
                    startDate = startOfDay(new Date());
                    break;
                case 'weekly':
                    startDate = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
                    break;
                case 'monthly':
                    startDate = startOfMonth(new Date());
                    break;
                default:
                    startDate = startOfDay(new Date());
            }

            // Get gift history for the period
            const giftHistory = await GiftHistoryModel.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: '$receiverId',
                        totalValue: { $sum: { $multiply: ['$giftValue', '$quantity'] } },
                        giftCount: { $sum: 1 }
                    }
                },
                { $sort: { totalValue: -1 } },
                { $limit: 100 }
            ]);

            // Get user details for the top receivers
            const userIds = giftHistory.map((item: any) => item._id);
            const users = await UserModel.find({ _id: { $in: userIds } }).lean();

            const currentUserId = req.user?._id?.toString();
            // Combine user data with ranking information
            const ranking = giftHistory.map((item: any, index: number) => {
                const user = users.find((u: any) => u._id.toString() === item._id.toString());
                if (!user) return null;
                
                const isFollowing = Array.isArray(user.followingIds) 
                    ? user.followingIds.includes(currentUserId || '') 
                    : false;
                
                return {
                    _id: user._id.toString(),
                    username: user.name || 'Usuário',
                    avatarUrl: user.avatarUrl || '',
                    level: user.level || 1,
                    isOnline: user.isOnline || false,
                    diamonds: user.diamonds || 0,
                    fans: user.fans || 0,
                    following: user.following || 0,
                    rank: index + 1,
                    totalGifts: item.giftCount || 0,
                    totalValue: item.totalValue || 0,
                    isFollowing
                } as RankedUser;
            }).filter(Boolean);

            return sendSuccess(res, ranking);
        } catch (err) {
            console.error('Error in getRanking:', err);
            next(err);
        }
    },

    getTopFans: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            // Get top fans based on total gifts sent
            const topFans = await GiftHistoryModel.aggregate([
                {
                    $group: {
                        _id: '$senderId',
                        totalGifts: { $sum: 1 },
                        totalValue: { $sum: { $multiply: ['$giftValue', '$quantity'] } }
                    }
                },
                { $sort: { totalValue: -1 } },
                { $limit: 20 }
            ]);

            // Get user details for top fans
            const userIds = topFans.map((fan: any) => fan._id);
            const users = await UserModel.find({ _id: { $in: userIds } }).lean();
            const currentUserId = req.user?._id?.toString();

            // Combine user data with fan stats
            const fansWithDetails = topFans.map((fan: any, index: number) => {
                const user = users.find((u: any) => u._id.toString() === fan._id.toString());
                if (!user) return null;
                
                const isFollowing = Array.isArray(user.followingIds) 
                    ? user.followingIds.includes(currentUserId || '') 
                    : false;
                
                return {
                    _id: user._id.toString(),
                    username: user.name || 'Usuário',
                    avatarUrl: user.avatarUrl || '',
                    level: user.level || 1,
                    isOnline: user.isOnline || false,
                    diamonds: user.diamonds || 0,
                    fans: user.fans || 0,
                    following: user.following || 0,
                    rank: index + 1,
                    totalGifts: fan.totalGifts || 0,
                    totalValue: fan.totalValue || 0,
                    isFollowing
                } as RankedUser;
            }).filter(Boolean);

            return sendSuccess(res, fansWithDetails);
        } catch (err) {
            console.error('Error in getTopFans:', err);
            next(err);
        }
    }
};
