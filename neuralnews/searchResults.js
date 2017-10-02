import React from 'react';
import { Text, AppRegistry } from 'react-native';

export default class SearchResultsScreen extends React.Component {
  static navigationOptions = {
    title: 'Neural News'
  }
    render() {
        return (
            <Text>Hello</Text>
        );
    }
}

AppRegistry.registerComponent('neuralnews', () => neuralnews);
