/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import LoginStackScreens from './screens/auth/login';

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <LoginStackScreens />
    </NavigationContainer>
  );
};

export default App;
