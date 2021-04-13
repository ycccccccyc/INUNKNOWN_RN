import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
} from 'react-native';
import Avatar from '../base/Avatar';

const window = Dimensions.get('window');
const uri = 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png';
const sectionsList = [
  {
    name: '我的主页',
    icon: '',
    pageId: '',
  },
  {
    name: '设置',
    icon: '',
    pageId: '',
  },
];

// export default function Menu({onItemSelected}) {
//   return (
//     <ScrollView scrollsToTop={false} style={styles.menu}>
//       <View style={styles.personalCard}>
//         <Avatar avatarUrl="" />
//         <Text style={styles.nickName}>最是人间留不住</Text>
//         <Text style={styles.signature}>朱颜辞镜花辞树</Text>
//       </View>

//       <View style={styles.sections}>
//         <Text>条目1</Text>
//       </View>
//     </ScrollView>
//   );
// }

export default class Menu extends Component {
  constructor(props) {
    super(props);
  }
  // onItemSelected
  render() {
    return (
      <ScrollView scrollsToTop={false} style={styles.menu}>
        <View style={styles.personalCard}>
          <Avatar avatarUrl="" />
          <Text style={styles.nickName}>最是人间留不住</Text>
          <Text style={styles.signature}>朱颜辞镜花辞树朱颜辞镜花辞树朱颜辞镜花辞树朱颜辞镜花辞树朱颜辞镜花辞树朱颜辞镜花辞树朱颜辞镜花辞树朱颜辞镜花辞树朱颜辞镜花辞树</Text>
        </View>
        <View style={styles.sections}>
          {sectionsList.map((item, index) => {
            return <Text>{item.name}</Text>;
          })}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    // width: window.width,
    // height: window.height,
    backgroundColor: 'gray',
    padding: 20,
  },
  personalCard: {
    marginBottom: 20,
    marginTop: 20,
  },
  nickName: {
    position: 'relative',
    top: -5,
    marginLeft: 10,
    fontSize: 20,
  },
  signature: {
    fontSize: 12,
    marginLeft: 10,
  },
  sections: {
    top: 0,
  },
  item: {
    fontSize: 14,
    fontWeight: '300',
    paddingTop: 5,
  },
});

Menu.propTypes = {
  onItemSelected: PropTypes.func.isRequired,
};
