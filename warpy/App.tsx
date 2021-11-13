import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  Feed,
  NewStream,
  Notifications,
  SignUpAvatar,
  SignUpName,
  SignUpUsername,
  MainSettingsScreen,
  Splash,
  Stream,
  Loading,
} from './src/screens';
import {StatusBar} from 'react-native';
import {ModalProvider, ToastProvider} from '@app/components';

const Stack = createStackNavigator();

const App = () => {
  StatusBar.setTranslucent(true);
  StatusBar.setBackgroundColor('transparent');

  const screens = {
    Splash,
    SignUpName,
    SignUpUsername,
    SignUpAvatar,
    Feed,
    NewStream,
    Stream,
    Notifications,
    MainSettingsScreen,
  };

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          {Object.keys(screens).map(name => (
            <Stack.Screen name={name} component={(screens as any)[name]} />
          ))}
        </Stack.Navigator>
      </NavigationContainer>

      <ToastProvider />
      <ModalProvider />
    </>
  );
};

export default App;
