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
} from './src/screens';
import {StatusBar} from 'react-native';
import {QueryClient, QueryClientProvider} from 'react-query';
import {ModalProvider, ToastProvider} from '@app/components';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

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
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Stack.Navigator>
            {Object.keys(screens).map(name => (
              <Stack.Screen
                key={name}
                options={{
                  cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
                  headerShown: false,
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
    </GestureHandlerRootView>
  );
};

export default App;
