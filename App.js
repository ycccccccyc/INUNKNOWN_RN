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
import { Asset } from 'expo-asset';
import AppLoading from 'expo-app-loading';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';

import HomePage from './pages/HomePage';
import WorkSpace from './pages/WorkSpace'

const RootStack = createStackNavigator();


function MainStackNav() {
  return (
    <View style={{width: '100%', height: '100%'}}>
      <RootStack.Navigator
        initialRouteName='HomePage'
        screenOptions={{ gestureEnabled: false, headerShown: false }}
        mode="card"
      >
        <RootStack.Screen name="HomePage" component={HomePage} />
        <RootStack.Screen name="WorkSpace" component={WorkSpace} />
      </RootStack.Navigator>
      {
        // <View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.65)'}}></View>
      }
    </View>
  );
}

export default class NavManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };
  }

  render() {
    return (
      <NavigationContainer>
        <MainStackNav />
      </NavigationContainer>
    );
  }
}
