import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {DevSignUp, Feed, NewStream, Splash, Stream} from './src/screens';
import {StatusBar} from 'react-native';
import {ToastProvider} from '@app/components/ToastProvider';

const Stack = createStackNavigator();

const App = () => {
  StatusBar.setTranslucent(true);
  StatusBar.setBackgroundColor('transparent');

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="DevSignUp" component={DevSignUp} />
          <Stack.Screen name="Feed" component={Feed} />
          <Stack.Screen name="NewStream" component={NewStream} />
          <Stack.Screen name="Stream" component={Stream} />
        </Stack.Navigator>
      </NavigationContainer>

      <ToastProvider />
    </>
  );
};

export default App;
