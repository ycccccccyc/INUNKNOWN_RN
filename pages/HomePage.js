import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    Image,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';

import Community from './Community';
import MaterialPage from './MaterialPage';
import FavoritePage from './FavoritePage';
import MyPage from './MyPage';
import WorkSpace from './WorkSpace';

import ChooseContentInModel from '../components/Modal/ChooseContentInModel';


const Tab = createBottomTabNavigator();

const getTabBarVisibility = (route) => {
  if (route.name === "WorkSpace"){
      return false
  }
  return true;
}
const tabBarVisibleOptionConfig = ({route})=>{
  return {tabBarVisible: getTabBarVisibility(route)}
}


const tabIconConfig = ({ route }) => ({
  tabBarIcon: ({ focused, color, size }) => {
    let icon;
    switch (route.name) {
      case 'Community' :
        icon = focused ? (
          <Image
            source={require('../assets/icon/homepage_active.png')}
            style={{width: 25, height: 25}}/>
        ) : (
          <Image
            source={require('../assets/icon/homepage_inactive.png')}
            style={{width: 25, height: 25}}/>
        )
        break;
      case 'MaterialPage':
        icon = focused ? (
          <Image
            source={require('../assets/icon/workspace_active.png')}
            style={{width: 28, height: 28}}/>
        ) : (
          <Image
            source={require('../assets/icon/workspace_inactive.png')}
            style={{width: 28, height: 28}}/>
        )
        break;
      case 'FavoritePage':
        icon = focused ? (
          <Image
            source={require('../assets/icon/like_active.png')}
            style={{width: 28, height: 28}}/>
        ) : (
          <Image
            source={require('../assets/icon/like_inactive.png')}
            style={{width: 28, height: 28}}/>
        )
        break;
      case 'MyPage':
        icon = focused ? (
          <Image
            source={require('../assets/icon/me_active.png')}
            style={{width: 25, height: 25}}/>
        ) : (
          <Image
            source={require('../assets/icon/me_inactive.png')}
            style={{width: 25, height: 25}}/>
        )
        break;
      default:
        icon = (<Image
          sorce={require('../assets/icon/workspace_red.png')}
          style={{width: 25, height: 25}}/>)
    }
    return icon;
  },
  tabBarLabel: ({ focused, color, size }) => {
    if (route.name === 'WorkSpace' && !focused) {
      return (
        <View
          style={styles.work_space_icon}
          // onPress={() => { console.log('aaaaa'); ChooseContentInModel.show() }}
          // onPress={() => navigation.navigate('WorkSpace', {navigation: navigation})}
        >
        </View>
      )
    }
    return (
      <Text style={{color: '#000', fontSize: 11}}>啊啊啊</Text>
    )
  }
})


export default function TabScreen() {
  return (
    <Tab.Navigator
      screenOptions={tabIconConfig}>
      <Tab.Screen name="Community" component={Community} options={tabBarVisibleOptionConfig} />
      <Tab.Screen name="MaterialPage" component={MaterialPage} options={tabBarVisibleOptionConfig} />
      <Tab.Screen name="WorkSpace" component={WorkSpace} options={tabBarVisibleOptionConfig} />
      <Tab.Screen name="FavoritePage" component={FavoritePage} options={tabBarVisibleOptionConfig} />
      <Tab.Screen name="MyPage" component={MyPage} options={tabBarVisibleOptionConfig} />
    </Tab.Navigator>
  )
}

const styles = {
  work_space_icon: {
    width: 70,
    height: 70,
    borderRadius: 40,
    position: 'relative',
    top: -5,
    backgroundColor: '#f00',
    borderStyle: 'solid',
    borderColor: '#fff',
    borderWidth: 3,
    elevation: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  }
}
