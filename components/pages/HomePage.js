import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function StackNav() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="homePage"
          component={ NavTabs }
          options={{
            headerTitle: '主页',
            headerBackTitleVisible: 'true'
          }}
        />
        <Stack.Screen
          name="searchPage"
          component={ DetailPage }
          options={{
            headerTitle: '搜索页',
            headerBackTitle: '返回'
          }}
        />
        <Stack.Screen
          name="detailPage"
          component={ DetailPage }
          options={{
            headerTitle: '详情页',
            headerBackTitle: '返回'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default class HomePage extends Component {
  render() {
    return (
      <View style={styles.page}>
        <View style={styles.title}>
          <View style={styles.title_tab}>
            <Text>推荐</Text>
            <Text>素材</Text>
          </View>
        </View>
        <View style={styles.category_tab}></View>
      </View>
    );
  }
}

const styles = {
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 60,
    display: 'flex',
  },
  title_tab: {

  },
  searchBtn: {
    width: 20,
    height: 20
  },
  category_tab: {

  }
}
