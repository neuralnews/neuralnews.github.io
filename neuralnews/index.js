import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    StatusBar,
    Fetch,
    AppRegistry,
    AsyncStorage
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Search from 'react-native-search-box';
import SearchResultsScreen from './searchResults.js';
import Spinner from 'react-native-loading-spinner-overlay';
import TrendingTopics from './trendingTopics.js';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    searchBar: {
        color: 'white',
    },
    wrapperStatusBarContainer: {
        backgroundColor: '#525252',
    },
});

// NewsAPI key: df226193949242e689ab6d8117191610
class HomeScreen extends Component {
    static navigationOptions = {
        title: 'Neural News',
    };

    constructor(props) {
        super(props);
        this.onSearch = this.onSearch.bind(this);
        this.state = {
            visible: false,
        };

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
            if (text !== 'Trump.json') {
                const URL = 'https://neuralnews.herokuapp.com/query?search=' + text.replace(' ', '%20');
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
                const URL = 'https://neuralnews.herokuapp.com/trump.json';
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
                <TrendingTopics onTopicPress={this.onSearch} />
            </View>
        );
    }
}


const Nav = StackNavigator({
    Home: {
        screen: HomeScreen,
    },
    MyResults: {
        screen: SearchResultsScreen,
        navigationOptions: ({ navigation }) => ({
            title: `${navigation.state.params.topic}`,
        }),
    },
});

export default Nav;

AppRegistry.registerComponent('neuralnews', () => neuralnews);