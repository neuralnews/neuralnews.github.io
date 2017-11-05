import React, { Component } from 'react';
import {
    View,
    Text,
} from 'react-native';

import TrendingTopic from './trendingTopic.js';


const styles = {
  trendingTopicsContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  trendingTopicsText: {
    textAlign: 'center',
    fontSize: 24,
    padding: 20,
  },
};

export default class TrendingTopics extends Component {
  render() {
    return (
            <View style={styles.trendingTopicsContainer}>
                <Text style={styles.trendingTopicsText}>
                    Trending Topics
                </Text>
                <TrendingTopic name="Donald Trump" onTopicPress={this.props.onTopicPress} />
                <TrendingTopic name="Jeff Flake" onTopicPress={this.props.onTopicPress} />
                <TrendingTopic name="Donald Trump–Russia dossier" onTopicPress={this.props.onTopicPress} />
                <TrendingTopic name="Democratic National Committee" onTopicPress={this.props.onTopicPress} />
                <TrendingTopic name="Puerto Rico" onTopicPress={this.props.onTopicPress} />
                <TrendingTopic name="North Korea" onTopicPress={this.props.onTopicPress} />
                <TrendingTopic name="United States Senator" onTopicPress={this.props.onTopicPress} />

            </View>
        );
  }
}
