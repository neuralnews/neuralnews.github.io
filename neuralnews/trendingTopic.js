import React, { Component } from 'react';
import {
    Button,
} from 'react-native';

export default class TrendingTopic extends Component {
  render() {
    return (
            <Button
              title={this.props.name}
              onPress={() => this.props.onTopicPress(this.props.name)}
            />
        );
  }
}
