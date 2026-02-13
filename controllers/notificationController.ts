import { Request, Response } from 'express';
import { UserModel } from '../models/User.js';
import { NotificationSettings } from '../types';
import { Types } from 'mongoose';

// Default notification settings
const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  newMessages: true,
  streamerLive: true,
  newFollower: true,
  followedPosts: true,
  pedido: true,
  interactive: true,
  push: true,
  giftAlertsOnScreen: true,
  giftSoundEffects: true,
  giftLuxuryBanners: true
};

// Get notification settings for a user
export const getNotificationSettings = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // Check if the user has permission to access these settings
    const authReq = req as any; // Cast to any to access userId from auth middleware
    const requestingUserId = authReq.userId;
    
    if (!requestingUserId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    // Find user by custom ID (u-xxxx) or fall back to MongoDB _id
    let user;
    if (userId.startsWith('u-')) {
      user = await UserModel.findOne({ id: userId }).select('notificationSettings');
    } else if (Types.ObjectId.isValid(userId)) {
      user = await UserModel.findById(userId).select('notificationSettings');
    } else {
      return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // If user has no notification settings, return default settings
    if (!user.notificationSettings) {
      return res.status(200).json({
        success: true,
        settings: DEFAULT_NOTIFICATION_SETTINGS
      });
    }
    
    res.status(200).json({
      success: true,
      settings: { ...DEFAULT_NOTIFICATION_SETTINGS, ...user.notificationSettings }
    });
  } catch (error) {
    console.error('Error getting notification settings:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update notification settings for a user
export const updateNotificationSettings = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const settings = req.body as Partial<NotificationSettings>;
    
    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }
    
    // Validate required fields
    if (!settings || Object.keys(settings).length === 0) {
      return res.status(400).json({ success: false, message: 'Settings are required' });
    }
    
    // Update user's notification settings
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { 
        $set: { 
          'notificationSettings': { 
            ...DEFAULT_NOTIFICATION_SETTINGS, 
            ...settings,
            updatedAt: new Date()
          } 
        } 
      },
      { new: true, runValidators: true }
    ).select('notificationSettings');
    
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      settings: updatedUser.notificationSettings || DEFAULT_NOTIFICATION_SETTINGS
    });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export default {
  getNotificationSettings,
  updateNotificationSettings
};
