import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  TouchableHighlight,
  Alert,
  ScrollView,
  ActivityIndicator,
  Button
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';

import HomePage from './HomePage';
import WorkSpace from './WorkSpace'

const RootStack = createStackNavigator();


function MainStackNav() {
  return (
    <RootStack.Navigator
      initialRouteName='HomePage'
      screenOptions={{ gestureEnabled: false, headerShown: false }}
      mode="modal"
    >
      <RootStack.Screen name="HomePage" component={HomePage} />
      <RootStack.Screen name="WorkSpace" component={WorkSpace} />
    </RootStack.Navigator>
  );
}

export default class NavManager extends Component {
  render() {
    return (
      <NavigationContainer>
        <MainStackNav />
      </NavigationContainer>
    );
  }
}
