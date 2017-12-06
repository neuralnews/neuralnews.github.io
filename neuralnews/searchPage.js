import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    StatusBar,
    Fetch,
    AppRegistry,
    AsyncStorage,
    Text,
    Image,
    Dimensions,
    TouchableHighlight,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Search from 'react-native-search-box';
import SearchResultsScreen from './searchResults.js';
import Spinner from 'react-native-loading-spinner-overlay';
import TrendingTopics from './trendingTopics.js';

export default class SearchScreen extends Component {
    static navigationOptions = {
        title: 'Neural News',
    };

    constructor(props) {
        super(props);
        this.onSearch = this.onSearch.bind(this);
        this.state = {
            visible: false,
            topics: ["", "", "", "", "", "", "", ""],
            isLoading: true,
        };
        fetch('http://104.196.204.46:3000/trendingTopics', {
          method: 'GET',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
        })
        // 3. Handle the response
        .then((response) => response.json())

        // 3b. Convert JSON string to JS object
        .then((resJson) => {
            this.setState({
                topics: resJson.topics,
                isLoading: false,
            });
        });

    }

    /*
     * onSearch
     *
     */
    onSearch = (text) => {
        this.setState({
            visible: !this.state.visible,
        });
        return new Promise((resolve, reject) => {
            // 2. Make HTTP GET call to the server
            if (text !== 'Trump_raw.json') {
                const URL = 'http://104.196.204.46:3000/query?search=' + text.replace(' ', '%20');
                fetch(URL, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                })

                // 3. Handle the response
                    .then((response) => response.json())

                    // 3b. Convert JSON string to JS object
                    .then((resJson) => {
                        this.setState({
                            visible: !this.state.visible,
                        });
                        this.props.navigation.navigate('MyResults', {articles: resJson, topic: text});
                        resolve();
                    })

                    // 3c. Catch errors
                    .catch((error) => {
                        alert('Error: ' + JSON.stringify(error));
                        reject('error');
                    });
            } else {
                const URL = 'http://104.196.204.46:3000/trump_raw.json';
                fetch(URL, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                })

                    // 3. Handle the response
                    .then((response) => response.json())

                    // 3b. Convert JSON string to JS object
                    .then((resJson) => {
                        this.setState({
                            visible: !this.state.visible,
                        });
                        this.props.navigation.navigate('MyResults', {articles: resJson, topic: text});
                        resolve();
                    })

                    // 3c. Catch errors
                    .catch((error) => {
                        alert('Error: ' + JSON.stringify(error));
                        reject('error');
                    });
            }
        });
    };

    render() {
      if (!this.state.isLoading) {
        return (
            <View style={styles.container}>
                <Spinner
                    visible={this.state.visible}
                />
                {/* Hide status bar */}
                <StatusBar /* hidden={true}*//>

                {/* Search field */}
                <Search
                    onSearch={this.onSearch}
                    style={styles.searchBar}
                />

                {/* Trending topics */}
                <TrendingTopics onTopicPress={this.onSearch} topics={this.state.topics} />
            </View>
        );
      }
      return (
        <View style={styles.container}>
            <Spinner
                visible={this.state.visible}
            />
        </View>
      )
    }
}