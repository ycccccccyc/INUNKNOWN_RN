import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
// import SideMenu from 'react-native-side-menu';
import InfoCenterPage from './InfoCenterPage';
import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomePage from './HomePage';
import WorkSpacePage from './WorkSpacePage';
import HistoryPage from './HistoryPage';
import MyPage from './MyPage';
import DetailPage from './DetailPage';

const image = require('../../assets/images/menu.png');

function PageNavTabs() {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let icon;

          switch (route.name) {
            case '社区' :
              icon = focused ? (
                <Image
                  source={require('../../assets/icon/homepage_active.png')}
                  style={{width: 25, height: 25}}/>
              ) : (
                <Image
                  source={require('../../assets/icon/homepage_inactive.png')}
                  style={{width: 25, height: 25}}/>
              )
              break;
            case '工作台':
              icon = focused ? (
                <Image
                  source={require('../../assets/icon/workspace_active.png')}
                  style={{width: 28, height: 28}}/>
              ) : (
                <Image
                  source={require('../../assets/icon/workspace_inactive.png')}
                  style={{width: 28, height: 28}}/>
              )
              break;
            case '赞过':
              icon = focused ? (
                <Image
                  source={require('../../assets/icon/like_active.png')}
                  style={{width: 28, height: 28}}/>
              ) : (
                <Image
                  source={require('../../assets/icon/like_inactive.png')}
                  style={{width: 28, height: 28}}/>
              )
              break;
            case '我':
              icon = focused ? (
                <Image
                  source={require('../../assets/icon/me_active.png')}
                  style={{width: 25, height: 25}}/>
              ) : (
                <Image
                  source={require('../../assets/icon/me_inactive.png')}
                  style={{width: 25, height: 25}}/>
              )
              break;
            default:
              icon = (<Image
                sorce={require('../../assets/icon/workspace_red.png')}
                style={{width: 25, height: 25}}/>)
          }
          return icon;
        },
        // tabBarIcon: ({ focused, color, size }) => {
        //   let icon;
        //   icon = (<Image source={require('../../assets/icon/workspace_64.png')} style={{width: 20, height: 20}}></Image>)
        //   return icon;
        // }
      })}
      tabBarOptions={{
        showIcon: true,
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
        pressColor: '#f00',
        style: {
          backgroundColor: 'rgb(39,51,63)',
          borderTopWidth: 0,
          borderTopColor: '#ccc',
          // paddingLeft: 80,
          // paddingRight: 80,
          position: 'absolute',
          paddingBottom: 10,
          paddingTop: 8,
          height: 60,
        },
        labelStyle: {
          fontSize: 10,
          margin: 1
        },
        indicatorStyle: {height: 0},
        tabBarPosition: 'bottom',
        swipeEnabled: true,
        animationEnabled: true,
      }}>
      <Tab.Screen name="社区" component={HomePage} />
      <Tab.Screen name="工作台" component={WorkSpacePage} />
      <Tab.Screen name="赞过" component={HistoryPage} />
      <Tab.Screen name="我" component={MyPage} />
    </Tab.Navigator>
  )
}

function TxClass() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="home"
          component={ NavTabs }
          options={{
            headerTitle: '社区',
            headerBackTitleVisible: 'true'
          }}
        />
        <Stack.Screen
          name="detail"
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

export default class Basic extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    this.state = {
      isOpen: false,
      selectedItem: 'About',
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  updateMenuState(isOpen) {
    this.setState({isOpen});
  }

  onMenuItemSelected = (item) =>
    this.setState({
      isOpen: true,
      selectedItem: item,
    });

  render() {
    const menu = <InfoCenterPage onItemSelected={this.onMenuItemSelected} />;

    return (
      <SafeAreaView style={{width: '100%', height: '100%'}}>
        {/* <SideMenu
          menu={menu}
          isOpen={this.state.isOpen}
          // openMenuOffset={Dimensions.get('window').width / 2}
          onChange={(isOpen) => this.updateMenuState(isOpen)}>
          <View style={styles.main_page}>
            <View style={styles.navigator}>
              <View style={styles.nav_menu}>
                <NavigationContainer>
                  <NavTabs></NavTabs>
                  <Text></Text>
                </NavigationContainer>
              </View>
              <TouchableOpacity onPress={this.toggle} style={styles.btn_InfoCenter}>
                <Image source={image} style={{width: 32, height: 32}} />
              </TouchableOpacity>
            </View>
          </View>
        </SideMenu> */}
        <NavigationContainer>
          <PageNavTabs></PageNavTabs>
        </NavigationContainer>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  caption: {
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  main_page: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  navigator: {
    height: 50,
    backgroundColor: '#ccc',
    top: 0,
    marginTop: 0,
  },
  nav_menu: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  nav_tab: {
    fontSize: 18,
    margin: 10,
  },
  btn_InfoCenter: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
});
