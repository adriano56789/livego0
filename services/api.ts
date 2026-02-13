
import { User, PurchaseRecord, Gift, Streamer, RankedUser, MusicTrack, FeedPhoto, GiftSendPayload, LiveSessionState, Comment, Country, NotificationSettings, ApiUsers } from '@/types';
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

const fetcher = async <T = any>(method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT', endpoint: string, payload?: any): Promise<T> => {
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
        login: (credentials: any): Promise<{ user: User, token: string }> => fetcher('POST', '/api/auth/login', credentials),
        register: (data: any): Promise<{ email: string }> => fetcher('POST', '/api/auth/register', data),
        verifyEmail: (data: { email: string; code: string }): Promise<{ success: boolean }> => fetcher('POST', '/api/auth/verify-email', data),
        logout: () => fetcher('POST', '/api/auth/logout'),
        getLastEmail: (): Promise<{ email: string }> => fetcher('GET', '/api/auth/last-email'),
        saveLastEmail: (email: string): Promise<void> => fetcher('POST', '/api/auth/save-last-email', { email }),
    },
    users: {
        me: (): Promise<User> => fetcher('GET', '/api/users/me'),
        get: (id: string): Promise<User> => fetcher('GET', `/api/users/${id}`),
        update: (id: 'me', data: Partial<User>): Promise<{ success: boolean, user: User }> => fetcher('POST', `/api/users/me`, data),
        getOnlineUsers: (roomId: string): Promise<User[]> => fetcher('GET', `/api/users/online?roomId=${roomId}`),
        getFansUsers: (id: string): Promise<User[]> => fetcher('GET', `/api/users/${id}/fans`),
        getFriends: (id: string): Promise<User[]> => fetcher('GET', `/api/users/${id}/friends`),
        search: (q: string): Promise<User[]> => fetcher('GET', `/api/users/search?q=${q}`),
        toggleFollow: (id: string) => fetcher('POST', `/api/users/${id}/follow`),
        getWithdrawalHistory: (status: string): Promise<PurchaseRecord[]> => fetcher('GET', `/api/users/me/withdrawal-history?status=${status}`),
        blockUser: (userId: string): Promise<{ success: boolean }> => fetcher('POST', `/api/users/me/blocklist/${userId}`),
        updateBillingAddress: (address: any) => fetcher('POST', '/api/users/me/billing-address', address),
        updateCreditCard: (card: any) => fetcher('POST', '/api/users/me/credit-card', card),
        updateUiSettings: (settings: any) => api.users.update('me', { uiSettings: settings }),
        setLanguage: (code: string): Promise<{ success: boolean }> => fetcher('POST', '/api/users/me/language', { country: code }),
        getFollowingUsers: (id: string): Promise<User[]> => fetcher('GET', `/api/users/${id}/following`),
    },
    chats: {
        listConversations: (): Promise<any[]> => fetcher('GET', '/api/chats/conversations'),
        start: (userId: string) => fetcher('POST', '/api/chats/start', { userId }),
        getMessages: (roomId: string): Promise<any[]> => fetcher('GET', `/api/chats/stream/${roomId}/messages`),
        sendMessage: (roomId: string, messagePayload: any) => fetcher('POST', `/api/chats/stream/${roomId}/message`, messagePayload),
    },
    gifts: {
        list: (category?: string): Promise<Gift[]> => fetcher('GET', `/api/gifts${category ? `?category=${category}` : ''}`),
        getGallery: (): Promise<(Gift & { count: number })[]> => fetcher('GET', '/api/gifts/gallery'),
    },
    mercadopago: {
        createCardPreference: (details: any): Promise<{ preferenceId: string; init_point: string; }> => fetcher('POST', '/api/mercadopago/create_card_preference', { details }),
        createPixPayment: (details: any): Promise<{ qrCodeBase64: string; qrCode: string; paymentId: string; expiresAt: string; }> => fetcher('POST', '/api/mercadopago/create_pix_payment', { details }),
    },
    diamonds: {
        getBalance: (userId: string): Promise<any> => fetcher('GET', `/api/wallet/balance?userId=${userId}`),
        purchase: (userId: string, diamonds: number, price: number): Promise<{ success: boolean, user: User }> => fetcher('POST', `/api/users/${userId}/purchase`, { diamonds, price }),
    },
    earnings: {
        withdraw: {
            calculate: (amount: number): Promise<any> => fetcher('POST', '/api/earnings/withdraw/calculate', { amount }),
            request: (amount: number, method?: any): Promise<{ success: boolean; message: string }> => fetcher('POST', '/api/earnings/withdraw/request', { amount, method }),
            methods: {
                update: (method: string, details: any): Promise<{ success: boolean; user: User }> => fetcher('POST', '/api/earnings/withdraw/methods', { method, details }),
            },
        },
    },
    admin: {
        getAdminWithdrawalHistory: (): Promise<PurchaseRecord[]> => fetcher('GET', '/api/admin/withdrawals'),
        withdraw: {
            request: (amount: number): Promise<{ success: boolean }> => fetcher('POST', '/api/admin/withdrawals/request', { amount }),
        },
        saveAdminWithdrawalMethod: (details: any): Promise<{ success: boolean }> => fetcher('POST', '/api/admin/withdrawals/method', details),
    },
    streams: {
        listByCategory: (category: string, region: string): Promise<Streamer[]> => fetcher('GET', `/api/live/${category}?region=${region}`),
        create: (data: Partial<Streamer>): Promise<Streamer> => fetcher('POST', '/api/streams', data),
        getSession: (streamId: string): Promise<LiveSessionState> => fetcher('GET', `/api/streams/${streamId}/session`),
        update: (id: string, data: Partial<Streamer>): Promise<{ success: boolean }> => fetcher('PATCH', `/api/streams/${id}`, data),
        updateVideoQuality: (id: string, quality: string): Promise<{ success: boolean }> => fetcher('PATCH', `/api/streams/${id}/quality`, { quality }),
        getGiftDonors: (streamId: string): Promise<User[]> => fetcher('GET', `/api/streams/${streamId}/donors`),
        search: (query: string): Promise<Streamer[]> => fetcher('GET', `/api/streams/search?q=${query}`),
        getCategories: (): Promise<{ id: string, label: string }[]> => fetcher('GET', '/api/streams/categories'),
        getBeautySettings: () => fetcher('GET', '/api/streams/beauty-settings'),
        saveBeautySettings: (settings: any) => fetcher('POST', '/api/streams/beauty-settings', settings),
        resetBeautySettings: () => fetcher('POST', '/api/streams/beauty-settings/reset'),
        applyBeautyEffect: (payload: { effectId: string }) => fetcher('POST', '/api/streams/beauty-settings/apply', payload),
        logBeautyTabClick: (payload: { tabId: string }) => fetcher('POST', '/api/streams/beauty-settings/log-tab', payload),
        deleteById: (id: string): Promise<{ success: boolean, message?: string }> => fetcher('DELETE', `/api/streams/${id}`),
        inviteToPrivateRoom: (streamId: string, userId: string): Promise<{ success: boolean }> => fetcher('POST', `/api/streams/${streamId}/invite`, { userId }),
        startBroadcast: (data: { streamId: string }): Promise<{ success: boolean }> => fetcher('POST', '/api/streams/start-broadcast', data),
        stopBroadcast: (data: { streamId: string }): Promise<{ success: boolean }> => fetcher('POST', '/api/streams/stop-broadcast', data),
    },
    srs: {
        getVersions: () => fetcher('GET', '/api/v1/versions'),
        getSummaries: () => fetcher('GET', '/api/v1/summaries'),
        getFeatures: () => fetcher('GET', '/api/v1/features'),
        getClients: () => fetcher('GET', '/api/v1/clients'),
        getClientById: (id: string) => fetcher('GET', `/api/v1/clients/${id}`),
        getStreams: () => fetcher('GET', '/api/v1/streams'),
        getStreamById: (id: string) => fetcher('GET', `/api/v1/streams/${id}`),
        deleteStreamById: (id: string) => fetcher('DELETE', `/api/v1/streams/${id}`),
        getConnections: () => fetcher('GET', '/api/v1/connections'),
        getConnectionById: (id: string) => fetcher('GET', `/api/v1/connections/${id}`),
        deleteConnectionById: (id: string) => fetcher('DELETE', `/api/v1/connections/${id}`),
        getConfigs: () => fetcher('GET', '/api/v1/configs'),
        updateConfigs: (config: string) => fetcher('PUT', '/api/v1/configs', config),
        getMetrics: () => fetcher('GET', '/api/v1/metrics'),
        rtcPublish: (sdp: string, streamUrl: string) => fetcher('POST', '/api/rtc/v1/publish', { sdp, streamUrl }),
        trickleIce: (sessionId: string, candidate: any) => fetcher('POST', `/api/rtc/v1/trickle/${sessionId}`, candidate),
    },
    db: {
        checkCollections: (): Promise<string[]> => fetcher('GET', '/api/db/collections'),
        getRequiredCollections: (): Promise<string[]> => fetcher('GET', '/api/db/required-collections'),
        setupDatabase: (): Promise<{ success: boolean; message: string }> => fetcher('POST', '/api/db/setup'),
    },
    // User related
    getVisitors: (userId: string): Promise<User[]> => fetcher('GET', `/api/users/${userId}/visitors`),
    getBlocklist: (): Promise<User[]> => fetcher('GET', '/api/users/me/blocklist'),
    unblockUser: (userId: string): Promise<{ success: boolean }> => fetcher('DELETE', `/api/users/me/blocklist/${userId}`),
    getMessages: (userId: string): Promise<any> => fetcher('GET', `/api/chats/stream/${userId}/messages`),
    
    // Stream history
    getStreamHistory: (): Promise<any[]> => fetcher('GET', '/api/history/streams'),
    clearStreamHistory: (): Promise<{ success: boolean }> => fetcher('DELETE', '/api/history/streams'),
    
    // Reminders
    getReminders: (): Promise<Streamer[]> => fetcher('GET', '/api/reminders'),
    removeReminder: (id: string): Promise<{ success: boolean }> => fetcher('DELETE', `/api/reminders/${id}`),
    
    // Rankings
    getCombinedRankings: (): Promise<{
        daily: RankedUser[];
        weekly: RankedUser[];
        monthly: RankedUser[];
    }> => fetcher('GET', '/api/rankings/all'),
    getDailyRanking: (): Promise<RankedUser[]> => fetcher('GET', '/api/rankings/daily'),
    getWeeklyRanking: (): Promise<RankedUser[]> => fetcher('GET', '/api/rankings/weekly'),
    getMonthlyRanking: (): Promise<RankedUser[]> => fetcher('GET', '/api/rankings/monthly'),
    getTopFans: (): Promise<RankedUser[]> => fetcher('GET', '/api/rankings/fans'),
    
    // Streams
    getPopularStreams: (): Promise<Streamer[]> => fetcher('GET', '/api/live/popular'),
    getQuickCompleteFriends: (): Promise<any[]> => fetcher('GET', '/api/quick-complete/friends'),
    completeQuickFriendTask: (friendId: string): Promise<{ success: boolean }> => fetcher('POST', '/api/quick-complete/complete', { friendId }),
    getMusicLibrary: (): Promise<MusicTrack[]> => fetcher('GET', '/api/music/library'),
    getAvatarFrames: (): Promise<any[]> => fetcher('GET', '/api/avatar/frames'),
    setActiveFrame: (userId: string, frameId: string): Promise<User> => fetcher('POST', '/api/avatar/frames/set', { userId, frameId }),
    createFeedPost: (data: { mediaData: string; type: 'image' | 'video'; caption?: string }): Promise<{ success: boolean; user: User; post: FeedPhoto }> => fetcher('POST', '/api/feed/posts', data),
    getFeedVideos: (): Promise<FeedPhoto[]> => fetcher('GET', '/api/feed/videos'),
    likePost: (postId: string): Promise<{ success: boolean }> => fetcher('POST', `/api/feed/posts/${postId}/like`),
    addComment: (postId: string, text: string): Promise<{ success: boolean; comment: any }> => fetcher('POST', `/api/feed/posts/${postId}/comments`, { text }),
    getComments: (postId: string): Promise<Comment[]> => fetcher('GET', `/api/feed/posts/${postId}/comments`),
    
    // Atualiza o status online do usuário
    updateOnlineStatus: (isOnline: boolean): Promise<{ success: boolean }> => 
        fetcher('POST', '/api/sim/status', { isOnline }),
    
    // Notifications
    notifications: {
        getSettings: (userId: string): Promise<NotificationSettings> => fetcher('GET', `/api/notifications/settings/${userId}`),
        updateSettings: (userId: string, settings: NotificationSettings): Promise<{ success: boolean }> => fetcher('PUT', `/api/notifications/settings/${userId}`, settings),
    },
    
    // Regions
    regions: {
        list: (): Promise<Country[]> => fetcher('GET', '/api/regions'),
    },
    
    // Purchases
    purchases: {
        getHistory: (userId: string): Promise<PurchaseRecord[]> => fetcher('GET', `/api/purchases/history/${userId}`),
    },
    
    // PK Battle
    pk: {
        getConfig: (): Promise<any> => fetcher('GET', '/api/pk/config'),
    },
    sendGift: (fromUserId: string, streamId: string, giftName: string, count: number, targetId: string): Promise<{ success: boolean, updatedSender: User }> => fetcher('POST', '/api/gifts/send', { fromUserId, streamId, giftName, count, targetId }),
    sendBackpackGift: (fromUserId: string, streamId: string, giftId: string, count: number, targetId: string): Promise<{ success: boolean, updatedSender: User }> => fetcher('POST', '/api/gifts/backpack/send', { fromUserId, streamId, giftId, count, targetId }),
    confirmPurchaseTransaction: (details: any, method: string): Promise<[{ success: boolean; user: User }]> => fetcher('POST', '/api/purchase/confirm', { details, method }),
    cancelPurchaseTransaction: () => fetcher('POST', '/api/purchase/cancel'),
    kickUser: (roomId: string, userId: string) => fetcher('POST', `/api/rooms/${roomId}/kick`, { userId }),
    makeModerator: (roomId: string, userId: string) => fetcher('POST', `/api/rooms/${roomId}/moderator`, { userId }),
    toggleMicrophone: () => fetcher('POST', '/api/streams/toggle-microphone'),
    toggleStreamSound: () => fetcher('POST', '/api/streams/toggle-sound'),
    toggleAutoFollow: () => fetcher('POST', '/api/settings/toggle-auto-follow'),
    toggleAutoPrivateInvite: () => fetcher('POST', '/api/settings/toggle-auto-private-invite'),
    inviteFriendForCoHost: (streamId: string, friendId: string): Promise<{ success: boolean }> => fetcher('POST', `/api/streams/${streamId}/cohost/invite`, { friendId }),
    translate: (text: string): Promise<{ translatedText: string }> => fetcher('POST', '/api/translate', { text }),
    
    // Permissions
    permissions: {
        getCamera: (userId: string): Promise<{ status: string }> => 
            fetcher('GET', `/api/permissions/camera/${userId}`),
        updateCamera: (userId: string, data: { status: string }): Promise<{ success: boolean }> => 
            fetcher('POST', `/api/permissions/camera/${userId}`, data),
        getMicrophone: (userId: string): Promise<{ status: string }> => 
            fetcher('GET', `/api/permissions/microphone/${userId}`),
        updateMicrophone: (userId: string, data: { status: string }): Promise<{ success: boolean }> => 
            fetcher('POST', `/api/permissions/microphone/${userId}`, data),
    },
};

export { fetcher };
