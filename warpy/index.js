/**
 * @format
 */

import 'react-native-gesture-handler';
import 'react-native-get-random-values';

import {registerGlobals} from 'react-native-webrtc';
registerGlobals();

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
