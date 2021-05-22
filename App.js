import React, {Component, useEffect} from 'react';
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
  Button,
} from 'react-native';
import { Asset } from 'expo-asset';
import AppLoading from 'expo-app-loading';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';

import HomePage from './pages/HomePage';
import CommunityDetailPage from './pages/CommunityDetailPage';
import LoadingPage from './pages/loadingPage';

import Global from './constant/constant';

const RootStack = createStackNavigator();


class MainStackNav extends Component {
  constructor(props) {
    super(props)

    this.state = {

    };
    this.communityDetailRef = React.createRef();
  }



  render() {
    return (
      <View style={{width: '100%', height: '100%'}}>
        <RootStack.Navigator
          initialRouteName='HomePage'
          screenOptions={{ gestureEnabled: false, headerShown: false }}
          mode="card"
        >
          <RootStack.Screen name="HomePage" component={HomePage} />
          {/* <RootStack.Screen name="CommunityDetailPage" component={CommunityDetailPage} /> */}
        </RootStack.Navigator>


        {/* 各类需要出现在最顶层的窗口 */}
        <CommunityDetailPage
          ref={this.communityDetailRef}
          >
        </CommunityDetailPage>

      </View>
    )
  }
}


export default class NavManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };
  }

  loaded(styler) {
    this.setState({
      isReady: true,
    })
    gStyler = styler
  }

  componentDidMount() {
  }

  render() {
    if (this.state.isReady) return (
      <NavigationContainer>
        <MainStackNav />
      </NavigationContainer>
    )
    return (
      <LoadingPage
        loaded={this.loaded.bind(this)} />
    )
  }
}
