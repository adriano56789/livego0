import { ProfileUser } from '../screens/BroadcasterProfileScreen';
import { Stream } from '../types/types';
import { logger } from './logger';

const API_BASE_URL = 'http://localhost:3001/api';

const request = async (endpoint: string, options?: RequestInit) => {
    const method = options?.method || 'GET';
    const url = `${API_BASE_URL}${endpoint}`;
    const shortEndpoint = endpoint.substring(0, 50) + (endpoint.length > 50 ? '...' : '');
    const logMessage = `${method} ${shortEndpoint}`;
    
    logger.log(`REQ: ${logMessage}`, 'info');

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            let errorPayload;
            try {
                errorPayload = await response.json();
            } catch (e) {
                errorPayload = { message: response.statusText };
            }
            const errorMessage = errorPayload.message || `API Error: ${response.status}`;
            logger.log(`FAIL: ${response.status} ${logMessage} - ${errorMessage}`, 'error');
            throw new Error(errorMessage);
        }

        logger.log(`SUCCESS: ${response.status} ${logMessage}`, 'success');

        if (response.status === 204) {
            return null;
        }
        return response.json();
    } catch (error: any) {
        if (!error.message.includes('API Error')) {
             logger.log(`NETWORK_ERR: ${logMessage} - ${error.message}`, 'error');
        }
        console.error(`[API Service Error] ${logMessage}:`, error);
        throw error;
    }
};

export const api = {
    login: (): Promise<ProfileUser> => request('/auth/login', { method: 'POST' }),

    fetchStreams: (): Promise<Stream[]> => request('/streams'),

    fetchUser: (userId: string): Promise<ProfileUser | undefined> => request(`/users/${userId}`),

    fetchFans: (userId: string): Promise<ProfileUser[]> => request(`/users/${userId}/fans`),
    
    fetchFollowing: (userId: string): Promise<ProfileUser[]> => request(`/users/${userId}/following`),
    
    fetchVisitors: async (userId: string): Promise<{user: ProfileUser, isFollowing: boolean}[]> => {
        const [visitors, following] = await Promise.all([
             request(`/users/${userId}/visitors`),
             request(`/users/${userId}/following`)
        ]);
        
        const followingIds = new Set(following.map((u: ProfileUser) => u.id));
        return visitors.map((visitor: ProfileUser) => ({
            user: visitor,
            isFollowing: followingIds.has(visitor.id)
        }));
    },

    fetchConversations: (userId: string): Promise<any[]> => request(`/messages/${userId}`),

    fetchChatHistory: (userId1: string, userId2: string): Promise<any[]> => request(`/messages/${userId1}/${userId2}`),

    sendMessage: (fromId: string, toId: string, text: string): Promise<any> => {
        return request(`/messages/${fromId}/${toId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        }).then(() => {
            // Return a mock of the sent message for immediate UI update
            return {
                id: `msg-${Date.now()}`,
                senderId: fromId,
                text,
                timestamp: Date.now(),
            };
        });
    },
    
    fetchWallet: (userId: string): Promise<{ diamonds: number; earnings: number }> => request(`/wallet/${userId}`),
};