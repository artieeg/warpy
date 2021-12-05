import {INotification} from '@warpy/lib';
import {StoreSlice} from '../types';

export interface INotificationSlice {
  notifications: INotification[];
  hasUnseenNotifications: boolean;
  notificationPage: number;
}

export const createNotificationSlice: StoreSlice<INotificationSlice> = () => ({
  notifications: [],
  notificationPage: 0,
  hasUnseenNotifications: false,
});
