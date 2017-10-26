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

  /*
   * onSearch
   *
   */
  onSearch = (text) => {
      return new Promise((resolve, reject) => {
          // 2. Make HTTP GET call to the server
          fetch('https://neuralnews.herokuapp.com/sanders.json')
          //fetch('https://neuralnews.herokuapp.com/query?search=' + text.replace(' ', '%20'))

          // 3. Handle the response
              .then((response) => response.json())

              // 3b. Convert JSON string to JS object
              .then((resJson) => {
                  this.props.navigation.navigate('MyResults', { "articles" : resJson, "title": 'POOP', "topic": text})
                  resolve();
              })

              // 3c. Catch errors
              .catch((error) => {
                  alert("Error: " + JSON.stringify(error));
              });
      });
  }
    render() {
        return (
            <View style={styles.container}>
                {/* Hide status bar */}
                <StatusBar /*hidden={true}*//>

                {/* Search field */}
                <Search
                  onSearch={this.onSearch}
                  style={styles.searchBar}
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
        <TrendingTopic name="Jeff Flake" onTopicPress={this.props.onTopicPress}/>
        <TrendingTopic name="Donald Trump–Russia dossier" onTopicPress={this.props.onTopicPress}/>
        <TrendingTopic name="Democratic National Committee" onTopicPress={this.props.onTopicPress}/>
        <TrendingTopic name="Puerto Rico" onTopicPress={this.props.onTopicPress}/>
        <TrendingTopic name="North Korea" onTopicPress={this.props.onTopicPress}/>
        <TrendingTopic name="United States Senator" onTopicPress={this.props.onTopicPress}/>

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
        backgroundColor: 'white',
    },
    headerContainer: {
        //borderBottomWidth: 0.75,
        //borderBottomColor: 'black'
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    searchBar: {
        //flex: 1,
        //flexDirection: "column"
        color: 'white',
        //placeholderTextColor: 'white',
        //titleCancelColor: 'white',
        //tintColorSearch: 'white',
        //tintColorDelete: 'white',
    },
    trendingTopicsContainer: {
        //borderWidth: 1,
        //borderColor: 'black'
        flex: 1,
        //justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    trendingTopicsText: {
        textAlign: 'center',
        //fontFamily: 'Arial',
        //fontWeight: 'bold',
        fontSize: 24,
        padding: 20
    },
    wrapperStatusBarContainer: {
        backgroundColor: "#525252"
    }
});

const Nav = StackNavigator({
    Home: {
      screen: HomeScreen
    },
    MyResults: {
      screen: SearchResultsScreen,
      navigationOptions: ({navigation}) => ({
        title: `${navigation.state.params.topic}`,
      }),
    }
});

export default Nav;

AppRegistry.registerComponent('neuralnews', () => neuralnews);
