import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  Feed,
  NewStream,
  Notifications,
  SignUpAvatar,
  SignUpName,
  SendInvite,
  SignUpUsername,
  MainSettingsScreen,
  Splash,
  User,
  UserListScreen,
  Stream,
  Loading,
  InviteCodeInput,
  MyAwardsDisplay,
} from './src/screens';
import {StatusBar} from 'react-native';
import {QueryClient, QueryClientProvider} from 'react-query';
import {ModalProvider, ToastProvider} from '@app/components';

const Stack = createStackNavigator();

const queryClient = new QueryClient();

const App = () => {
  StatusBar.setTranslucent(true);
  StatusBar.setBackgroundColor('transparent');

  const screens = {
    Splash,
    SignUpName,
    SignUpUsername,
    Loading,
    SendInvite,
    InviteCodeInput,
    MyAwardsDisplay,
    SignUpAvatar,
    Feed,
    NewStream,
    Stream,
    Notifications,
    MainSettingsScreen,
    User,
    UserListScreen,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          {Object.keys(screens).map(name => (
            <Stack.Screen name={name} component={(screens as any)[name]} />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
      <ModalProvider />
      <ToastProvider />
    </QueryClientProvider>
  );
};

export default App;
