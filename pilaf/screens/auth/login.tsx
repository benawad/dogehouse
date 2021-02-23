import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Linking} from 'react-native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {apiBaseUrl} from '@dogehouse/feta/constants';

type screens = {
  login: {};
};

const Login = ({navigation}: {navigation: StackNavigationProp<screens>}) => {
  return (
    <View>
      <TouchableOpacity
        style={styles.btn}
        activeOpacity={0.9}
        onPress={() => {
          Linking.openURL(apiBaseUrl + '/auth/github/web');
        }}>
        <Text style={{color: 'white'}}>Login with Github</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        activeOpacity={0.9}
        onPress={() => {
          Linking.openURL(apiBaseUrl + '/auth/twitter/web');
        }}>
        <Text style={{color: 'white'}}>Login with Twitter</Text>
      </TouchableOpacity>
    </View>
  );
};

const LoginStack = createStackNavigator<screens>();

const LoginStackScreens = () => {
  return (
    <LoginStack.Navigator
      screenOptions={{
        headerTitle: () => (
          <Text style={{fontWeight: 'bold', fontSize: 20}}>Login</Text>
        ),
      }}>
      <LoginStack.Screen name="login" component={Login} />
    </LoginStack.Navigator>
  );
};

const styles = StyleSheet.create({
  btn: {
    padding: 20,
    margin: 10,
    backgroundColor: '#0b78e3',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    top: 1,
    bottom: 1,
  },
});

export default LoginStackScreens;
