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

import ModalView from '../components/base/ModalView';


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
            style={{width: 28, height: 28}}/>
        ) : (
          <Image
            source={require('../assets/icon/homepage_inactive.png')}
            style={{width: 28, height: 28}}/>
        )
        break;
      case 'MaterialPage':
        icon = focused ? (
          <Image
            source={require('../assets/icon/material_active.png')}
            style={{width: 28, height: 28}}/>
        ) : (
          <Image
            source={require('../assets/icon/material_inactive.png')}
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
          sorce={require('../assets/icon/me_inactive.png')}
          style={{width: 25, height: 25}}/>)
    }
    return icon;
  },
  tabBarLabel: ({ focused, color, size }) => {
    if (route.name === 'WorkSpace' && !focused) {
      return (
        <View
          style={styles.work_space_icon}
        >
          <Image source={require('../assets/icon/icon_workspace.png')} style={{width: 40, height: 40}}></Image>
        </View>
      )
    }
    let label;
    switch (route.name) {
      case 'Community':
        label = focused ? (
          <Text style={{color: '#000', fontSize: 11, color: '#1296db'}}>社区</Text>
        ) : (
          <Text style={{color: '#000', fontSize: 11, color: '#333'}}>社区</Text>
        )
        break;
      case 'MaterialPage':
        label = focused ? (
          <Text style={{color: '#000', fontSize: 11, color: '#1296db'}}>素材</Text>
        ) : (
          <Text style={{color: '#000', fontSize: 11, color: '#333'}}>素材</Text>
        )
        break;
      case 'FavoritePage':
        label = focused ? (
          <Text style={{color: '#000', fontSize: 11, color: '#1296db'}}>赞过</Text>
        ) : (
          <Text style={{color: '#000', fontSize: 11, color: '#333'}}>赞过</Text>
        )
        break;
      case 'MyPage':
        label = focused ? (
          <Text style={{color: '#000', fontSize: 11, color: '#1296db'}}>我的</Text>
        ) : (
          <Text style={{color: '#000', fontSize: 11, color: '#333'}}>我的</Text>
        )
        break;
    }
    return label
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

const styles = StyleSheet.create({
  work_space_icon: {
    width: 70,
    height: 70,
    borderRadius: 40,
    position: 'relative',
    top: -5,
    backgroundColor: '#fff',
    borderStyle: 'solid',
    borderColor: '#ccc',
    borderWidth: 3,
    elevation: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
})
