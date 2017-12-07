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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#211f21',
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color: 'white',
    },
    searchBar: {
        color: 'white',
    },
    wrapperStatusBarContainer: {
        backgroundColor: '#211f21',
    },
    wrapperContainer: {
        width: Dimensions.get('window').width,
        backgroundColor: '#211f21',
    },
    loadingImage : {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
    loadingImageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchImageContainer: {
        paddingRight: 20,
    },
    searchImage: {
        height: 20,
        width: 20,
    },
    topicText: {
        fontSize: 18,
        paddingLeft: 5,
        fontWeight: 'bold',
        color: 'white',
    },
    articleTitleContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: 7,
        width: 260,
    },
    articleTitle: {
        fontSize: 14,
        color: '#5193ff',
        flexWrap: 'wrap',
        paddingLeft: 7,
        paddingRight: 7,
    },
    articleImage: {
        height: 60,
        width: 60
    },
    descriptionContainer: {
        flexDirection: 'row',
        width: Dimensions.get('window').width,
    },
    articleNetwork: {
        fontSize: 10,
        color: 'gray',
        flexWrap: 'wrap',
        paddingLeft: 7,
    },
    articleDescriptionHeader: {
        paddingLeft: 7,
        paddingTop: 10,
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
    },
    articleDescription: {
        paddingLeft: 7,
        paddingRight: 7,
        paddingTop: 7,
        color: 'white',
        flex: 0.8,
        flexWrap: 'wrap',
    },
    analysisContainer: {
    },
    entityContainer: {
        flexWrap: 'wrap',
        width: 175,
    },
    entity: {
        paddingLeft: 7,
        paddingRight: 7,
        color: 'white',
        fontSize: 16,
    },
    entitiesContainer: {
        paddingTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    topStoriesContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 5,
    },
    topStoriesText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
    },
    topStoryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    topStoryContainer2: {
        borderBottomColor: 'black',
        borderTopColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderWidth: 1,
    },
    iconContainer: {
        paddingLeft: 10,
        paddingRight: 10,
    }
});

export default class SearchScreen extends Component {
    static navigationOptions = {
        title: 'Neural News',
        headerStyle: {
            backgroundColor: '#211f21',
        },
        headerTintColor: 'lightgrey',
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