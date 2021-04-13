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
import SideMenu from 'react-native-side-menu';
import InfoCenterPage from './InfoCenterPage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomePage from './HomePage';
import WorkSpacePage from './WorkSpacePage';
import DetailPage from './DetailPage';

const image = require('../../assets/images/menu.png');

function NavTabs() {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let icon;

          if (route.name === 'home') {
            icon = focused ?
            (
              <Image
                sorce={require('../../assets/icon/homepage.svg')}
                style={{width: 25, height: 25, color: '#f00'}}/>
            ) : (
              <Image
                source={require('../../assets/icon/homepage.svg')}
                style={{width: 25, height: 25, color: '#ff0'}}/>
            )
          } else if (route.name === 'workspace') {
            icon = focused ?
            (
              <Image
                sorce={require('../../assets/icon/workspace_64.png')}
                style={{width: 25, height: 25, color: '#f00'}}/>
            ) : (
              <Image
                source={require('../../assets/icon/workspace_64.png')}
                style={{width: 25, height: 25, color: '#ff0'}}/>
            )
          }
          return icon;
        }
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
        pressColor: '#788493',
        style: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          borderTopColor: '#ccc',
          paddingLeft: 80,
          paddingRight: 80,
          height: '100%',
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 14,
        },
        labelStyle: {
          fontSize: 16,
          margin: 1
        },
        indicatorStyle: {height: 0},
        tabBarPosition: 'bottom',
        swipeEnabled: true,
      }}>
      <Tab.Screen name="社区" component={HomePage} />
      <Tab.Screen name="工作台" component={WorkSpacePage} />
      {/* <Tab.Screen name="我" component={WorkSpacePage} /> */}
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
            headerTitle: '首 页',
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
        <TxClass></TxClass>
        {/* <Text>分tferwrewrweertiary</Text> */}
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
    height: 56,
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
