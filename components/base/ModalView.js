import React, { Component} from 'react';
import  {
  AppRegistry,
  View,
  Modal,
  TouchableOpacity,
  Text
} from 'react-native';

// export default class ModalView extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       modalVisible: false,
//     }
//   }

//   setModalVisible = (visible)=> {
//     this.setState({
//       modalVisible: visible
//     })
//   };

//   render(){
//     return(
//       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffaaff'}}>
//         <Modal animationType={'none'}
//           transparent={true}
//           visible={this.state.modalVisible}
//           onrequestclose={() => {alert("Modal has been closed.")}}
//           onShow={() => {alert("Modal has been open.")}}
//           supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
//           onOrientationChange={() => {alert("Modal has been OrientationChange.")}}>
//           <View style={{flex:1, marginTop: 22, backgroundColor: '#aaaaaa', justifyContent: 'center', alignItems: 'center'}}>
//               <View>
//                   <Text>Hello World!</Text>
//                   <TouchableOpacity onPress={() => {
//                       this.setModalVisible(false)
//                   }}>
//                       <Text>隐藏 Modal</Text>
//                   </TouchableOpacity>
//               </View>
//           </View>
//         </Modal>
//         <TouchableOpacity onPress={() => {
//           console.log('hhhhh')
//           this.setModalVisible(true)
//         }}>
//           <Text>显示 Modal</Text>
//         </TouchableOpacity>
//       </View>
//     )
//   }
// }
// AppRegistry.registerComponent('ModalView', ()=>ModalView);

export default function ModalView() {
  return (
    <View style={{position: 'absolute', zIndex: 99999, top: 0, left: 0, flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffaaff'}}>
      <Modal animationType={'none'}
        transparent={true}
        visible={true}
        onrequestclose={() => {alert("Modal has been closed.")}}
        onShow={() => {alert("Modal has been open.")}}
        supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
        onOrientationChange={() => {alert("Modal has been OrientationChange.")}}>
        {/* <View style={{flex:1, marginTop: 22, backgroundColor: '#aaaaaa', justifyContent: 'center', alignItems: 'center'}}>
            <View>
                <Text>Hello World!</Text>
                <TouchableOpacity onPress={() => {
                    this.setModalVisible(false)
                }}>
                    <Text>隐藏 Modal</Text>
                </TouchableOpacity>
            </View>
        </View> */}
      </Modal>
    </View>
  )
}
