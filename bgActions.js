import firebase from 'react-native-firebase';
// Optional flow type
import type, { NotificationOpen } from 'react-native-firebase';


export default async (notificationOpen: NotificationOpen) => {
    console.warn('opne notiti action ' , notificationOpen)
    if (notificationOpen.action === 'test_action') {
        // handle the action
        alert('open noti')
    }

    return Promise.resolve();
}