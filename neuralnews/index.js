import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    Fetch,
    Button,
    AppRegistry
} from 'react-native'
import { StackNavigator } from 'react-navigation'
import Search from 'react-native-search-box'
import SearchResultsScreen from './searchResults.js'

// NewsAPI key: df226193949242e689ab6d8117191610
class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Neural News'
  }
  constructor(props) {
    super(props)
    this.onSearch = this.onSearch.bind(this)
  }
  onSearch(name) {
      this.props.navigation.navigate('MyResults', { "topic" : name})
  }
    render() {
        return (
            <View style={styles.container}>
                {/* Hide status bar */}
                <StatusBar /*hidden={true}*//>

                {/* Search field */}
                <Search
                  onSearch={() => this.onSearch("test")}
                />

                {/* Trending topics */}
                <TrendingTopics onTopicPress={this.onSearch}/>
            </View>
        );
    }
}

class TrendingTopics extends Component {

  render() {
    return (
      <View style={styles.trendingTopicsContainer}>
        <Text style={styles.trendingTopicsText}>
          Trending Topics
        </Text>
        <TrendingTopic name="Donald Trump" onTopicPress={this.props.onTopicPress}/>
        <TrendingTopic name="Hurricane Maria" onTopicPress={this.props.onTopicPress}/>
        <TrendingTopic name="Graham-Cassidy" onTopicPress={this.props.onTopicPress}/>
        <TrendingTopic name="Puerto Rico" onTopicPress={this.props.onTopicPress}/>
        <TrendingTopic name="NFL" onTopicPress={this.props.onTopicPress}/>
      </View>
    )
  }
}

class TrendingTopic extends Component {

  render() {
    return (
      <Button
        title={this.props.name}
        onPress={() => this.props.onTopicPress(this.props.name)}
      />
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    headerContainer: {
        borderBottomWidth: 0.75,
        borderBottomColor: 'black'
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    searchBar: {
        flex: 1,
        flexDirection: "column"
    },
    trendingTopicsContainer: {
        borderWidth: 1,
        borderColor: 'black'
    },
    trendingTopicsText: {
        textAlign: 'center',
        fontFamily: 'Arial',
        fontWeight: 'bold',
        fontSize: 24,
    }
});

const Nav = StackNavigator({
    Home: { screen: HomeScreen },
    MyResults: { screen: SearchResultsScreen }
});

export default Nav;

AppRegistry.registerComponent('neuralnews', () => neuralnews);
