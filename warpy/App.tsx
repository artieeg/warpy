import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
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
  Search,
  AvatarPickerScreen,
} from './src/screens';
import {StatusBar} from 'react-native';
import {QueryClient, QueryClientProvider} from 'react-query';
import {ModalProvider, ToastProvider} from '@app/components';

const Stack = createStackNavigator();

const queryClient = new QueryClient();

const App = () => {
  StatusBar.setTranslucent(true);
  StatusBar.setBackgroundColor('transparent');
  StatusBar.setHidden(true);

  const screens = {
    Splash,
    SignUpName,
    SignUpUsername,
    Loading,
    SendInvite,
    InviteCodeInput,
    Search,
    MyAwardsDisplay,
    SignUpAvatar,
    Feed,
    NewStream,
    Stream,
    Notifications,
    MainSettingsScreen,
    User,
    UserListScreen,
    AvatarPickerScreen,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          {Object.keys(screens).map(name => (
            <Stack.Screen
              key={name}
              options={{
                cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
              }}
              name={name}
              component={(screens as any)[name]}
            />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
      <ModalProvider />
      <ToastProvider />
    </QueryClientProvider>
  );
};

export default App;
