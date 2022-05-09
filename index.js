/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import bgMessaging from './bgMessaging';
import bgActions from './bgActions';

AppRegistry.registerComponent(appName, () => App);

AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging); // <-- Add this line

// New task registration
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundNotificationAction', () => bgActions); // <-- Add this line