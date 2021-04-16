import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
} from 'react-native';

export default function MaterialPage({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>素材</Text>
      <Button
        title="Go to Notifications"
        onPress={() => navigation.navigate('WorkSpace')}
      />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}