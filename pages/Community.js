import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    TouchableOpacity,
} from 'react-native';

export default function Community({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>community</Text>
      <TouchableOpacity>
        <Button
          title="Go to Profile"
          onPress={() => navigation.navigate('WorkSpace')}
        />
      </TouchableOpacity>
    </View>
  );
}
