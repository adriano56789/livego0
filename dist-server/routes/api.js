import express from 'express';
import { authController } from '../controllers/authController.js';
import { userController } from '../controllers/userController.js';
import { giftController } from '../controllers/giftController.js';
import { streamController } from '../controllers/streamController.js';
import { walletController } from '../controllers/walletController.js';
import { chatController } from '../controllers/chatController.js';
import { assetController } from '../controllers/assetController.js';
import { mercadoPagoController } from '../controllers/mercadoPagoController.js';
import { adminController } from '../controllers/adminController.js';
import { feedController } from '../controllers/feedController.js';
import { rankingController } from '../controllers/rankingController.js';
import { taskController } from '../controllers/taskController.js';
import { miscController } from '../controllers/miscController.js';
import { authMiddleware } from '../middleware/auth.js';
import { sendSuccess } from '../utils/response.js';
import { dbController } from '../controllers/dbController.js';
const router = express.Router();
// --- Status & DB ---
router.get('/status', (req, res) => sendSuccess(res, { online: true }, "API Real LiveGo Ativa!"));
router.get('/db/required-collections', authMiddleware, dbController.getRequiredCollections);
router.get('/db/collections', authMiddleware, dbController.listCollections);
router.post('/db/setup', authMiddleware, dbController.setupDatabase);
// --- Auth ---
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);
router.post('/auth/verify-email', authController.verifyEmail);
router.post('/auth/logout', authController.logout);
router.post('/auth/save-last-email', authController.saveLastEmail);
router.get('/auth/last-email', authController.getLastEmail);
// --- Users ---
router.get('/users/me', authMiddleware, userController.getMe);
router.post('/users/me', authMiddleware, userController.updateMe);
router.get('/users/search', authMiddleware, userController.search);
router.get('/users/:id', authMiddleware, userController.getUser);
router.get('/users/:id/fans', authMiddleware, userController.getFans);
router.get('/users/:id/friends', authMiddleware, userController.getFriends);
router.post('/users/:id/follow', authMiddleware, userController.follow);
router.get('/users/:userId/following', authMiddleware, userController.getFollowing);
router.get('/users/:userId/visitors', authMiddleware, userController.getVisitors);
router.post('/users/me/language', authMiddleware, userController.setLanguage);
router.get('/users/me/withdrawal-history', authMiddleware, userController.getWithdrawalHistory);
router.get('/users/me/blocklist', authMiddleware, userController.getBlocklist);
router.post('/users/me/blocklist/:userId', authMiddleware, userController.blockUser);
router.post('/users/me/blocklist/:userId/unblock', authMiddleware, userController.unblockUser);
router.post('/users/me/billing-address', authMiddleware, userController.updateBillingAddress);
router.post('/users/me/credit-card', authMiddleware, userController.updateCreditCard);
router.post('/users/:userId/active-frame', authMiddleware, userController.setActiveFrame);
router.get('/users/me/history', authMiddleware, userController.getStreamHistory);
router.post('/users/me/history', authMiddleware, userController.addStreamToHistory);
router.delete('/users/me/history', authMiddleware, userController.clearStreamHistory);
router.get('/users/me/reminders', authMiddleware, userController.getReminders);
router.delete('/users/me/reminders/:id', authMiddleware, userController.removeReminder);
// --- Chats ---
router.get('/chats/conversations', authMiddleware, chatController.getConversations);
router.post('/chats/start', authMiddleware, chatController.start);
router.post('/chats/stream/:roomId/message', authMiddleware, chatController.sendMessageToStream);
// --- Streams ---
router.get('/live/:category', authMiddleware, streamController.listByCategory);
router.post('/streams', authMiddleware, streamController.create);
router.post('/streams/start-broadcast', authMiddleware, streamController.startBroadcast);
router.post('/streams/stop-broadcast', authMiddleware, streamController.stopBroadcast);
router.get('/streams/search', authMiddleware, streamController.search);
router.get('/streams/categories', authMiddleware, streamController.getCategories);
router.get('/streams/:streamId/session', authMiddleware, streamController.getSession);
router.patch('/streams/:id', authMiddleware, streamController.update);
router.delete('/streams/:id', authMiddleware, streamController.deleteById);
router.patch('/streams/:id/quality', authMiddleware, streamController.updateVideoQuality);
router.get('/streams/:streamId/donors', authMiddleware, streamController.getGiftDonors);
router.post('/streams/:streamId/invite', authMiddleware, streamController.inviteToPrivateRoom);
router.post('/streams/:streamId/cohost/invite', authMiddleware, streamController.inviteFriendForCoHost);
router.post('/streams/:roomId/kick', authMiddleware, streamController.kickUser);
router.post('/streams/:roomId/moderator', authMiddleware, streamController.makeModerator);
// --- Live Toggles ---
router.post('/live/toggle-mic', authMiddleware, streamController.toggleMicrophone);
router.post('/live/toggle-sound', authMiddleware, streamController.toggleStreamSound);
router.post('/live/toggle-autofollow', authMiddleware, streamController.toggleAutoFollow);
router.post('/live/toggle-autoinvite', authMiddleware, streamController.toggleAutoPrivateInvite);
// --- Beauty Effects ---
router.get('/streams/beauty-settings', authMiddleware, streamController.getBeautySettings);
router.post('/streams/beauty-settings', authMiddleware, streamController.saveBeautySettings);
router.post('/streams/beauty-settings/reset', authMiddleware, streamController.resetBeautySettings);
router.post('/streams/beauty-settings/apply', authMiddleware, streamController.applyBeautyEffect);
router.post('/streams/beauty-settings/log-tab', authMiddleware, streamController.logBeautyTabClick);
// --- Gifts & Wallet ---
router.get('/gifts', authMiddleware, giftController.getAll);
router.get('/gifts/gallery', authMiddleware, giftController.getGallery);
router.post('/streams/:streamId/gift', authMiddleware, giftController.sendGift);
router.post('/streams/:streamId/backpack-gift', authMiddleware, giftController.sendBackpackGift);
router.get('/wallet/balance', authMiddleware, walletController.getBalance);
router.post('/users/:userId/purchase', authMiddleware, walletController.purchase);
router.post('/wallet/confirm-purchase', authMiddleware, walletController.confirmPurchase);
router.post('/wallet/cancel-purchase', authMiddleware, walletController.cancelPurchase);
// --- Earnings ---
router.post('/earnings/withdraw/calculate', authMiddleware, walletController.calculateWithdrawal);
router.post('/earnings/withdraw/request', authMiddleware, walletController.requestWithdrawal);
router.post('/earnings/withdraw/methods', authMiddleware, walletController.updateWithdrawalMethod);
// --- Mercado Pago ---
router.post('/mercadopago/create_card_preference', authMiddleware, mercadoPagoController.createCardPreference);
router.post('/mercadopago/create_pix_payment', authMiddleware, mercadoPagoController.createPixPayment);
router.post('/mercadopago/webhook', mercadoPagoController.webhook);
// --- Admin ---
router.get('/admin/withdrawals', authMiddleware, adminController.getAdminWithdrawalHistory);
router.post('/admin/withdrawals/request', authMiddleware, adminController.requestWithdrawal);
router.post('/admin/withdrawals/method', authMiddleware, adminController.saveWithdrawalMethod);
// --- Feed ---
router.get('/feed/videos', authMiddleware, feedController.getFeedVideos);
router.post('/posts', authMiddleware, feedController.createPost);
router.post('/posts/:postId/like', authMiddleware, feedController.likePost);
router.post('/posts/:postId/comment', authMiddleware, feedController.addComment);
router.get('/posts/:postId/comments', authMiddleware, feedController.getComments);
// --- Ranking ---
router.get('/ranking/daily', authMiddleware, rankingController.getRanking('daily'));
router.get('/ranking/weekly', authMiddleware, rankingController.getRanking('weekly'));
router.get('/ranking/monthly', authMiddleware, rankingController.getRanking('monthly'));
router.get('/ranking/top-fans', authMiddleware, rankingController.getTopFans);
// --- Tasks ---
router.get('/tasks/quick-friends', authMiddleware, taskController.getQuickCompleteFriends);
router.post('/tasks/quick-friends/:friendId/complete', authMiddleware, taskController.completeQuickFriendTask);
// --- Assets ---
router.get('/assets/music', authMiddleware, assetController.getMusic);
router.get('/assets/frames', authMiddleware, assetController.getFrames);
// --- Misc ---
router.post('/translate', authMiddleware, miscController.translate);
export default router;
