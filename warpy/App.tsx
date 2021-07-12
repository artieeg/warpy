import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {DevSignUp, Feed, NewStream, Splash} from './src/screens';
import {Provider} from 'react-redux';
import {store} from '@app/store';

const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="DevSignUp" component={DevSignUp} />
          <Stack.Screen name="Feed" component={Feed} />
          <Stack.Screen name="NewStream" component={NewStream} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
