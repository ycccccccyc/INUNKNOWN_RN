import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
} from 'react-native';

export default function FavoritePage({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>favorite</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}