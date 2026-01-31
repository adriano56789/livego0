import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../middleware/auth.js';
import { PostModel } from '../models/Post.js';
import { UserModel } from '../models/User.js';
import { CommentModel } from '../models/Comment.js';

export const feedController = {
    getFeedVideos: async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
        try {
            const posts = await PostModel.find({}).sort({ createdAt: -1 }).limit(20).lean();
            const userIds = [...new Set(posts.map(p => p.userId))];
            const users = await UserModel.find({ id: { $in: userIds } }).lean();
            const usersMap = new Map(users.map(u => [u.id, u]));
            
            const populatedPosts = posts.map(post => ({
              ...post,
              user: usersMap.get(post.userId) || { id: post.userId, name: 'Usuário Removido', avatarUrl: '' }
            }));

            return sendSuccess(res, populatedPosts);
        } catch (error) {
            next(error);
        }
    },

    getComments: async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
        try {
            const { postId } = (req as any).params;
            const comments = await CommentModel.find({ postId }).sort({ createdAt: -1 }).limit(50).lean();
            
            const userIds = [...new Set(comments.map(c => c.userId))];
            const users = await UserModel.find({ id: { $in: userIds } }).lean();
            const usersMap = new Map(users.map(u => [u.id, u]));

            const populatedComments = comments.map(c => ({
                ...c,
                user: usersMap.get(c.userId) || { id: c.userId, name: 'Usuário Removido', avatarUrl: '' }
            }));

            return sendSuccess(res, populatedComments);
        } catch (error) {
            next(error);
        }
    },

    createPost: async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
        try {
            const { mediaData, type, caption } = req.body;
            const newPost = {
                id: `post-${Date.now()}`,
                userId: req.userId,
                type,
                mediaUrl: "mock-url-from-base64",
                caption,
            };
            const user = await UserModel.findOne({id: req.userId});
            return sendSuccess(res, { success: true, post: newPost, user });
        } catch (error) {
            next(error);
        }
    },
    likePost: async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
        try {
            return sendSuccess(res, { success: true });
        } catch (error) {
            next(error);
        }
    },
    addComment: async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
        try {
            const { text } = req.body;
            const { postId } = req.params;
            const user = await UserModel.findOne({ id: req.userId });
            const comment = { id: `c-${Date.now()}`, user, text };
            return sendSuccess(res, { success: true, comment });
        } catch (error) {
            next(error);
        }
    }
};