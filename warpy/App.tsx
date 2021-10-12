import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  DevSignUp,
  Feed,
  NewStream,
  Notifications,
  SignUpAvatar,
  SignUpName,
  SignUpUsername,
  Splash,
  Stream,
} from './src/screens';
import {StatusBar} from 'react-native';
import {ModalProvider, ToastProvider} from '@app/components';

const Stack = createStackNavigator();

const App = () => {
  StatusBar.setTranslucent(true);
  StatusBar.setBackgroundColor('transparent');

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="SignUpName" component={SignUpName} />
          <Stack.Screen name="SignUpUsername" component={SignUpUsername} />
          <Stack.Screen name="SignUpAvatar" component={SignUpAvatar} />
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="DevSignUp" component={DevSignUp} />
          <Stack.Screen name="Feed" component={Feed} />
          <Stack.Screen name="NewStream" component={NewStream} />
          <Stack.Screen name="Stream" component={Stream} />
          <Stack.Screen name="Notifications" component={Notifications} />
        </Stack.Navigator>
      </NavigationContainer>

      <ToastProvider />
      <ModalProvider />
    </>
  );
};

export default App;
