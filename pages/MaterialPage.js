import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    TouchableWithoutFeedback,
    TouchableHighlight
} from 'react-native';

export default class MaterialPage extends Component  {
  constructor(props) {
    super(props)
    this.state = {
      typeSelected: 0,
      cateSelected: 0,
    },
    this.categoryList = [{
      name: '油画'
    },{
      name: '纹理'
    },{
      name: '风景'
    },{
      name: '插画'
    }];
    this.displayList = []
  }

  _changeTypeSelected(type) {
    if (this.state.typeSelected === 1 && type === 0) this.setState({
      typeSelected: 0
    })
    else if(this.state.typeSelected === 0 && type === 1) this.setState({
      typeSelected: 1
    })
  }

  _changeCateSelected(cate) {
    this.setState({
      cateSelected: cate
    }, () => this.forceUpdate())
  }

  _renderCate(item, index) {
    return (
      <TouchableHighlight
        key={index}
        style={[styles.cate_button, {
          backgroundColor: this.state.cateSelected === index ? 'rgb(38,170,239)' : '#fff',
          borderColor: this.state.cateSelected === index ? '#fff' : 'rgb(38,170,239)',
          height: this.state.cateSelected === index ? 34 : 30
        }]}
        underlayColor="rgb(38,170,239)"
        onPress={() => this._changeCateSelected(index)}>
        <Text style={{fontSize: 12, color: this.state.cateSelected === index ? '#fff' : 'rgb(38,170,239)'}}>{item.name}</Text>
      </TouchableHighlight>
    )
  }



  async getDisplayList() {

  }

  componentDidMount() {

  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={styles.top_bar}>

          {/* 选择内容图还是风格 */}
          <View style={styles.type_container}>
            <TouchableHighlight
              style={[styles.type_button, {
                backgroundColor: this.state.typeSelected === 0 ? 'rgb(38,170,239)' : '#fff',
                borderColor: this.state.typeSelected === 0 ? 'white' : 'rgb(38,170,239)',
                height: this.state.typeSelected === 0 ? 34 : 30
              }]}
              underlayColor="rgb(38,170,239)"
              onPress={() => this._changeTypeSelected(0)}>
              <Text style={{color: this.state.typeSelected === 0 ? 'white' : 'rgb(38,170,239)'}}>素材库</Text>
            </TouchableHighlight>

            <TouchableHighlight
              style={[styles.type_button, {
                backgroundColor: this.state.typeSelected === 0 ? 'white' : 'rgb(38,170,239)',
                borderColor: this.state.typeSelected === 1 ? 'white' : 'rgb(38,170,239)',
                height: this.state.typeSelected === 1 ? 34 : 30
              }]}
              underlayColor="rgb(38,170,239)"
              onPress={() => this._changeTypeSelected(1)}>
              <Text style={{color: this.state.typeSelected === 1 ? 'white' : 'rgb(38,170,239)'}}>风格</Text>
            </TouchableHighlight>
          </View>

          {/* 分类选择 */}
          <View style={styles.cate_container}>
            {
              this.categoryList.map((item, index) => this._renderCate(item, index))
            }
          </View>
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  top_bar: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    height: 100,
    backgroundColor: '#fff',
    elevation: 10,
    shadowColor: '#eee',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 10,
  },
  type_container: {
    height: 30,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  cate_container: {
    height: 30,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 5
  },
  type_button: {
    width: 80,
    height: 30,
    borderRadius: 20,
    backgroundColor: 'rgb(38,170,239)',
    borderWidth: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5
  },
  cate_button: {
    width: 60,
    height: 30,
    borderRadius: 20,
    backgroundColor: 'rgb(38,170,239)',
    borderWidth: 1.5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5
  }

})
