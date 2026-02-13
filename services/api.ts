
import { User, PurchaseRecord, Gift, Streamer, RankedUser, MusicTrack, FeedPhoto, GiftSendPayload, LiveSessionState, Comment } from '@/types';
import { apiTrackerService } from '@/services/apiTrackerService';

const TOKEN_KEY = '@LiveGo:token';
const USER_KEY = '@LiveGo:user';
const REQUEST_TIMEOUT = 10000; // 10 seconds

export const storage = {
    getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
    setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
    getUser: (): User | null => {
        const userJson = localStorage.getItem(USER_KEY);
        try {
            return userJson ? JSON.parse(userJson) : null;
        } catch (e) {
            console.error("Failed to parse user from storage", e);
            return null;
        }
    },
    setUser: (user: User) => {
        if (user) {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        }
    },
    clear: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },
};

const fetcher = async (method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT', endpoint: string, payload?: any): Promise<any> => {
    const url = `${(import.meta as any).env.VITE_API_BASE_URL}${endpoint}`;
    const logId = apiTrackerService.addLog(method, endpoint);

    console.log(`%c[API REQ] --> ${method} ${url}`, 'color: #8B5CF6; font-weight: bold;', payload ? { payload } : '');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
        controller.abort();
        apiTrackerService.updateLog(logId, { status: 'Timeout' });
    }, REQUEST_TIMEOUT);

    try {
        const token = storage.getToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const options: RequestInit = {
            method,
            headers,
            signal: controller.signal,
        };

        if (payload && (method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE')) {
            options.body = JSON.stringify(payload);
        }

        const response = await fetch(url, options);
        clearTimeout(timeoutId);

        if (response.status === 401) {
            if (!endpoint.startsWith('/auth/login')) {
                storage.clear();
                window.location.reload();
            }
        }

        const textResponse = await response.text();
        const responseData = textResponse ? JSON.parse(textResponse) : {};

        apiTrackerService.updateLog(logId, { status: response.ok ? 'Success' : 'Error', statusCode: response.status });

        if (!response.ok) {
            console.error(`%c[API ERROR] <-- ${method} ${url} | Status: ${response.status}`, 'color: #EF4444; font-weight: bold;', { error: responseData.error || 'Request failed' });
            const error = new Error(responseData.error || `Request failed with status ${response.status}`);
            (error as any).status = response.status;
            throw error;
        }
        
        console.log(`%c[API OK] <-- ${method} ${url} | Status: ${response.status}`, 'color: #10B981; font-weight: bold;', { response: responseData });
        
        return responseData.data !== undefined ? responseData.data : responseData;
    } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name !== 'AbortError') {
            apiTrackerService.updateLog(logId, { status: 'Error', error: error.message });
            
            // Connection Refused / Network Error
            if (error.message.includes('Failed to fetch')) {
                console.error(`%c[API OFFLINE] <-- O backend não está respondendo em ${url}. Verifique se o servidor na porta 3000 está rodando.`, 'color: #EF4444; font-weight: bold; font-size: 14px;');
            } else {
                console.error(`%c[API FATAL] <-- ${method} ${url} | ${error.name}: ${error.message}`, 'color: #F97316; font-weight: bold;', { error });
            }
        } else {
            console.warn(`%c[API TIMEOUT] <-- ${method} ${url}`, 'color: #F59E0B; font-weight: bold;');
        }
        throw error;
    }
};


export const api = {
    auth: {
        login: (credentials: any): Promise<{ user: User, token: string }> => fetcher('POST', '/auth/login', credentials),
        register: (data: any): Promise<{ email: string }> => fetcher('POST', '/auth/register', data),
        verifyEmail: (data: { email: string; code: string }): Promise<{ success: boolean }> => fetcher('POST', '/auth/verify-email', data),
        logout: () => fetcher('POST', '/auth/logout'),
        getLastEmail: (): Promise<{ email: string }> => fetcher('GET', '/api/auth/last-email'),
        saveLastEmail: (email: string): Promise<void> => fetcher('POST', '/auth/save-last-email', { email }),
    },
    users: {
        me: (): Promise<User> => fetcher('GET', '/users/me'),
        get: (id: string): Promise<User> => fetcher('GET', `/users/${id}`),
        update: (id: 'me', data: Partial<User>): Promise<{ success: boolean, user: User }> => fetcher('POST', `/users/me`, data),
        getOnlineUsers: (roomId: string): Promise<User[]> => fetcher('GET', `/users/online?roomId=${roomId}`),
        getFansUsers: (id: string): Promise<User[]> => fetcher('GET', `/users/${id}/fans`),
        getFriends: (id: string): Promise<User[]> => fetcher('GET', `/users/${id}/friends`),
        search: (q: string): Promise<User[]> => fetcher('GET', `/users/search?q=${q}`),
        toggleFollow: (id: string) => fetcher('POST', `/users/${id}/follow`),
        getWithdrawalHistory: (status: string): Promise<PurchaseRecord[]> => fetcher('GET', `/users/me/withdrawal-history?status=${status}`),
        blockUser: (userId: string): Promise<{ success: boolean }> => fetcher('POST', `/users/me/blocklist/${userId}`),
        updateBillingAddress: (address: any) => fetcher('POST', '/users/me/billing-address', address),
        updateCreditCard: (card: any) => fetcher('POST', '/users/me/credit-card', card),
        updateUiSettings: (settings: any) => api.users.update('me', { uiSettings: settings }),
        setLanguage: (code: string): Promise<{ success: boolean }> => fetcher('POST', '/users/me/language', { country: code }),
    },
    chats: {
        listConversations: (): Promise<any[]> => fetcher('GET', '/chats/conversations'),
        start: (userId: string) => fetcher('POST', '/chats/start', { userId }),
        getMessages: (roomId: string): Promise<any[]> => fetcher('GET', `/chats/stream/${roomId}/messages`),
        sendMessage: (roomId: string, messagePayload: any) => fetcher('POST', `/chats/stream/${roomId}/message`, messagePayload),
    },
    gifts: {
        list: (category?: string): Promise<Gift[]> => fetcher('GET', `/gifts${category ? `?category=${category}` : ''}`),
        getGallery: (): Promise<(Gift & { count: number })[]> => fetcher('GET', '/gifts/gallery'),
    },
    mercadopago: {
        createCardPreference: (details: any): Promise<{ preferenceId: string; init_point: string; }> => fetcher('POST', '/mercadopago/create_card_preference', { details }),
        createPixPayment: (details: any): Promise<{ qrCodeBase64: string; qrCode: string; paymentId: string; expiresAt: string; }> => fetcher('POST', '/mercadopago/create_pix_payment', { details }),
    },
    diamonds: {
        getBalance: (userId: string): Promise<any> => fetcher('GET', `/wallet/balance?userId=${userId}`),
        purchase: (userId: string, diamonds: number, price: number): Promise<{ success: boolean, user: User }> => fetcher('POST', `/users/${userId}/purchase`, { diamonds, price }),
    },
    earnings: {
        withdraw: {
            calculate: (amount: number): Promise<any> => fetcher('POST', '/earnings/withdraw/calculate', { amount }),
            request: (amount: number, method?: any): Promise<{ success: boolean; message: string }> => fetcher('POST', '/earnings/withdraw/request', { amount, method }),
            methods: {
                update: (method: string, details: any): Promise<{ success: boolean; user: User }> => fetcher('POST', '/earnings/withdraw/methods', { method, details }),
            },
        },
    },
    admin: {
        getAdminWithdrawalHistory: (): Promise<PurchaseRecord[]> => fetcher('GET', '/admin/withdrawals'),
        withdraw: {
            request: (amount: number): Promise<{ success: boolean }> => fetcher('POST', '/admin/withdrawals/request', { amount }),
        },
        saveAdminWithdrawalMethod: (details: any): Promise<{ success: boolean }> => fetcher('POST', '/admin/withdrawals/method', details),
    },
    streams: {
        listByCategory: (category: string, region: string): Promise<Streamer[]> => fetcher('GET', `/live/${category}?region=${region}`),
        create: (data: Partial<Streamer>): Promise<Streamer> => fetcher('POST', '/streams', data),
        getSession: (streamId: string): Promise<LiveSessionState> => fetcher('GET', `/streams/${streamId}/session`),
        update: (id: string, data: Partial<Streamer>): Promise<{ success: boolean }> => fetcher('PATCH', `/streams/${id}`, data),
        updateVideoQuality: (id: string, quality: string): Promise<{ success: boolean }> => fetcher('PATCH', `/streams/${id}/quality`, { quality }),
        getGiftDonors: (streamId: string): Promise<User[]> => fetcher('GET', `/streams/${streamId}/donors`),
        search: (query: string): Promise<Streamer[]> => fetcher('GET', `/streams/search?q=${query}`),
        getCategories: (): Promise<{ id: string, label: string }[]> => fetcher('GET', '/streams/categories'),
        getBeautySettings: () => fetcher('GET', '/streams/beauty-settings'),
        saveBeautySettings: (settings: any) => fetcher('POST', '/streams/beauty-settings', settings),
        resetBeautySettings: () => fetcher('POST', '/streams/beauty-settings/reset'),
        applyBeautyEffect: (payload: { effectId: string }) => fetcher('POST', '/streams/beauty-settings/apply', payload),
        logBeautyTabClick: (payload: { tabId: string }) => fetcher('POST', '/streams/beauty-settings/log-tab', payload),
        deleteById: (id: string): Promise<{ success: boolean, message?: string }> => fetcher('DELETE', `/streams/${id}`),
        inviteToPrivateRoom: (streamId: string, userId: string): Promise<{ success: boolean }> => fetcher('POST', `/streams/${streamId}/invite`, { userId }),
        startBroadcast: (data: { streamId: string }): Promise<{ success: boolean }> => fetcher('POST', '/streams/start-broadcast', data),
        stopBroadcast: (data: { streamId: string }): Promise<{ success: boolean }> => fetcher('POST', '/streams/stop-broadcast', data),
    },
    srs: {
        getVersions: () => fetcher('GET', '/v1/versions'),
        getSummaries: () => fetcher('GET', '/v1/summaries'),
        getFeatures: () => fetcher('GET', '/v1/features'),
        getClients: () => fetcher('GET', '/v1/clients'),
        getClientById: (id: string) => fetcher('GET', `/v1/clients/${id}`),
        getStreams: () => fetcher('GET', '/v1/streams'),
        getStreamById: (id: string) => fetcher('GET', `/v1/streams/${id}`),
        deleteStreamById: (id: string) => fetcher('DELETE', `/v1/streams/${id}`),
        getConnections: () => fetcher('GET', '/v1/connections'),
        getConnectionById: (id: string) => fetcher('GET', `/v1/connections/${id}`),
        deleteConnectionById: (id: string) => fetcher('DELETE', `/v1/connections/${id}`),
        getConfigs: () => fetcher('GET', '/v1/configs'),
        updateConfigs: (config: string) => fetcher('PUT', '/v1/configs', config),
        getMetrics: () => fetcher('GET', '/v1/metrics'),
        rtcPublish: (sdp: string, streamUrl: string) => fetcher('POST', '/rtc/v1/publish', { sdp, streamUrl }),
        trickleIce: (sessionId: string, candidate: any) => fetcher('POST', `/rtc/v1/trickle/${sessionId}`, candidate),
    },
    db: {
        checkCollections: (): Promise<string[]> => fetcher('GET', '/db/collections'),
        getRequiredCollections: (): Promise<string[]> => fetcher('GET', '/db/required-collections'),
        setupDatabase: (): Promise<{ success: boolean; message: string }> => fetcher('POST', '/db/setup'),
    },
    getFollowingUsers: (userId: string): Promise<User[]> => fetcher('GET', `/users/${userId}/following`),
    getVisitors: (userId: string): Promise<User[]> => fetcher('GET', `/users/${userId}/visitors`),
    getBlocklist: (): Promise<User[]> => fetcher('GET', `/users/me/blocklist`),
    unblockUser: (userId: string): Promise<{ success: boolean }> => fetcher('POST', `/users/me/blocklist/${userId}/unblock`),
    getStreamHistory: (): Promise<any[]> => fetcher('GET', '/users/me/history'),
    clearStreamHistory: (): Promise<{ success: boolean }> => fetcher('DELETE', '/users/me/history'),
    getReminders: (): Promise<Streamer[]> => fetcher('GET', '/users/me/reminders'),
    removeReminder: (id: string): Promise<{ success: boolean }> => fetcher('DELETE', `/users/me/reminders/${id}`),
    getDailyRanking: (): Promise<RankedUser[]> => fetcher('GET', '/ranking/daily'),
    getWeeklyRanking: (): Promise<RankedUser[]> => fetcher('GET', '/ranking/weekly'),
    getMonthlyRanking: (): Promise<RankedUser[]> => fetcher('GET', '/ranking/monthly'),
    getTopFans: (): Promise<RankedUser[]> => fetcher('GET', '/ranking/top-fans'),
    getQuickCompleteFriends: (): Promise<any[]> => fetcher('GET', '/tasks/quick-friends'),
    completeQuickFriendTask: (friendId: string): Promise<{ success: boolean }> => fetcher('POST', `/tasks/quick-friends/${friendId}/complete`),
    getMusicLibrary: (): Promise<MusicTrack[]> => fetcher('GET', '/assets/music'),
    getAvatarFrames: (): Promise<any[]> => fetcher('GET', '/assets/frames'),
    setActiveFrame: (userId: string, frameId: string): Promise<User> => fetcher('POST', `/users/${userId}/active-frame`, { frameId }),
    createFeedPost: (data: { mediaData: string; type: 'image' | 'video'; caption?: string }): Promise<{ success: boolean; user: User; post: FeedPhoto }> => fetcher('POST', '/posts', data),
    getFeedVideos: (): Promise<FeedPhoto[]> => fetcher('GET', '/feed/videos'),
    likePost: (postId: string): Promise<{ success: boolean }> => fetcher('POST', `/posts/${postId}/like`),
    addComment: (postId: string, text: string): Promise<{ success: boolean; comment: any }> => fetcher('POST', `/posts/${postId}/comment`, { text }),
    getComments: (postId: string): Promise<Comment[]> => fetcher('GET', `/posts/${postId}/comments`),
    sendGift: (fromUserId: string, streamId: string, giftName: string, count: number, targetId: string): Promise<{ success: boolean, updatedSender: User }> => fetcher('POST', `/streams/${streamId}/gift`, { from: fromUserId, giftName, amount: count, toUserId: targetId }),
    sendBackpackGift: (fromUserId: string, streamId: string, giftId: string, count: number, targetId: string): Promise<{ success: boolean, updatedSender: User }> => fetcher('POST', `/streams/${streamId}/backpack-gift`, { from: fromUserId, giftId, amount: count, toUserId: targetId }),
    confirmPurchaseTransaction: (details: any, method: string): Promise<[{ success: boolean; user: User }]> => fetcher('POST', '/wallet/confirm-purchase', { details, method }),
    cancelPurchaseTransaction: () => fetcher('POST', '/wallet/cancel-purchase'),
    kickUser: (roomId: string, userId: string) => fetcher('POST', `/streams/${roomId}/kick`, { userId }),
    makeModerator: (roomId: string, userId: string) => fetcher('POST', `/streams/${roomId}/moderator`, { userId }),
    toggleMicrophone: () => fetcher('POST', '/live/toggle-mic'),
    toggleStreamSound: () => fetcher('POST', '/live/toggle-sound'),
    toggleAutoFollow: () => fetcher('POST', '/live/toggle-autofollow'),
    toggleAutoPrivateInvite: () => fetcher('POST', '/live/toggle-autoinvite'),
    inviteFriendForCoHost: (streamId: string, friendId: string): Promise<{ success: boolean }> => fetcher('POST', `/streams/${streamId}/cohost/invite`, { friendId }),
    translate: (text: string): Promise<{ translatedText: string }> => fetcher('POST', '/translate', { text }),
};
