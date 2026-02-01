import { sendSuccess } from '../utils/response.js';
import { UserModel } from '../models/User.js';
export const taskController = {
    // @FIX: Corrected types to express.Response and express.NextFunction
    getQuickCompleteFriends: async (req, res, next) => {
        try {
            const currentUser = await UserModel.findOne({ id: req.userId }).lean();
            if (!currentUser)
                return sendSuccess(res, []);
            const followingIds = currentUser.followingIds || [];
            const potentialFriends = await UserModel.find({
                id: { $nin: [...followingIds, req.userId] }
            }).limit(10).lean();
            const response = potentialFriends.map(u => ({
                id: u.id,
                name: u.name,
                avatarUrl: u.avatarUrl,
                status: 'pendente'
            }));
            return sendSuccess(res, response);
        }
        catch (error) {
            next(error);
        }
    },
    // @FIX: Corrected types to express.Request, express.Response, express.NextFunction
    completeQuickFriendTask: async (req, res, next) => {
        try {
            // Lógica para seguir o amigo pode ser adicionada aqui
            return sendSuccess(res, { success: true }, "Tarefa concluída.");
        }
        catch (error) {
            next(error);
        }
    }
};
