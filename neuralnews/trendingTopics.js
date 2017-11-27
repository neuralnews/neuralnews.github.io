import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    ScrollView,
    View,
    Dimensions,
    Image,
    TouchableHighlight,
    WebView,
    Linking,
    AsyncStorage
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Search from 'react-native-search-box';
import Spinner from 'react-native-loading-spinner-overlay';

import TrendingTopic from './trendingTopic.js';
import Articles from './articles.js';


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
  topicTitle: {
    fontSize: 24,
    padding: 10,
    backgroundColor: 'grey',
    color: 'white',
  }
};


export default class TrendingTopics extends Component {

  constructor(props) {
      super(props);
      this.state = {
          visible: false,
          topics: ["", "", "", "", "", "", "", ""],
          isLoading: true,
      };
      alert("HI")
    }


  render() {
    return (
      <ScrollView style={styles.trendingTopicsContainer}>
          <Text style={styles.trendingTopicsText}>
              Trending Topics
          </Text>
          <TrendingTopic name={this.props.topics[0]}>
            <Text style={styles.topicTitle}>
              {this.props.topics[0]}
            </Text>
            <Articles topic={this.props.topics[0]}/>
          </TrendingTopic>
          {/*
          <TrendingTopic name={this.props.topics[1]}>
            <Text style={styles.topicTitle}>
              {this.props.topics[1]}
            </Text>
            <Articles topic={this.props.topics[1]}/>
          <TrendingTopic>
          <TrendingTopic name={this.props.topics[2]}>
            <Text style={styles.topicTitle}>
              {this.props.topics[2]}
            </Text>
            <Articles topic={this.props.topics[2]}/>
          <TrendingTopic>
          <TrendingTopic name={this.props.topics[3]}>
            <Text style={styles.topicTitle}>
              {this.props.topics[3]}
            </Text>
            <Articles topic={this.props.topics[3]}/>
          <TrendingTopic>
          <TrendingTopic name={this.props.topics[4]}>
            <Text style={styles.topicTitle}>
              {this.props.topics[4]}
            </Text>
            <Articles topic={this.props.topics[4]}/>
          <TrendingTopic>
          <TrendingTopic name={this.props.topics[5]}>
            <Text style={styles.topicTitle}>
              {this.props.topics[5]}
            </Text>
            <Articles topic={this.props.topics[5]}/>
          <TrendingTopic>
          <TrendingTopic name={this.props.topics[6]}>
            <Text style={styles.topicTitle}>
              {this.props.topics[6]}
            </Text>
            <Articles topic={this.props.topics[6]}/>
          <TrendingTopic> */}
      </ScrollView>
    );
  }
}
