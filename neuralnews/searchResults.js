import React from 'react';
import { Text, AppRegistry, StyleSheet, View, Dimensions, Image, TouchableHighlight } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Search from 'react-native-search-box';
import Nav from './index.js';

export default class SearchResultsScreen extends React.Component {
    // Navigation options for stackNavigator
    static navigationOptions = {
        title: 'Neural News'
    }

    /*
     * constructor
     * Responsible for initializing the SearchResultsScreen class
     */
    constructor(props) {
      super(props);
      this.state = {
          entries : ["Some_Article", "Another_Article", "Wow_That_Is_An_Article", "Is_This_An_Article", "Yes_It_Is"]
      }
    }

    /*
     * renderItem
     * Renders a single article object
     */
    _renderItem ({item, index})
    {
        return (
            <View style={styles.slide}>
                {/* News network logo */}
                <TouchableHighlight onPress={() => {alert("TODO: Navigate to article");}}>
                    <Image
                        source={require("./assets/cnn.png")}
                        style={styles.articleImage}
                    />
                </TouchableHighlight>

                {/* Article title */}
                <Text style={styles.articleDescription}>Index: {index}, Title: {item}</Text>

                {/* Article description */}
                <View style={styles.descriptionContainer}>
                    <Text style={styles.articleDescriptionHeader}>Description</Text>
                    <Text style={styles.articleDescription}>TODO: Get article description</Text>
                </View>

                {/* NLP analysis */}
                <View style={styles.analysisContainer}>
                    <Text style={styles.articleDescriptionHeader}>Analysis</Text>
                    <Text style={styles.articleDescription}>TODO:</Text>
                </View>
            </View>
        );
    }

    /*
     * onSearch
     *
     */
     onSearch = (text) => {
         return new Promise((resolve, reject) => {
             this.props.navigation.navigate('MyResults', { "topic" : text})
             resolve();
         });
     }

    /*
     * render
     * Renders the SearchResultsScreen
     */
    render() {
        return (
            // Wrapper
            <View style={styles.wrapperContainer}>
                {/* Search Bar */}
                <View style={styles.searchBarContainer}>
                    <Search
                        onSearch={this.onSearch}
                    />
                </View>

                {/* Topic Header */}
                <View>
                    <Text
                        style={styles.topicHeader}>
                        {this.props.navigation.state.params.topic}
                    </Text>
                </View>

                {/* Cover flow style display of sorted articles along with their
                    appropriate NLP data */}
                <Carousel
                    ref={(c) => { this._carousel = c; }}
                    data={this.state.entries}
                    renderItem={this._renderItem}
                    sliderWidth={Dimensions.get('window').width}
                    itemWidth={300}
                    firstItem={2}
                    containerCustomStyle={styles.slider}
                 />
            </View>
        );
    }
}

// StyleSheet
const styles = StyleSheet.create({
    topicHeader: {
        textAlign: "center",
        fontSize: 36,
        paddingTop: 5,
        paddingBottom: 5,
        color: "white"
    },
    todoText: {
        textAlign: "center",
        color: "red",
    },
    searchBarContainer: {
        alignContent: "center"
    },
    articleImage: {
        width: 300,
        height: 300,
        alignContent: "center"
    },
    carouselContainer: {
        borderWidth: .5,
        borderTopColor: "black",
        borderBottomColor: "transparent",
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        alignContent: "center"
    },
    descriptionContainer: {

    },
    articleDescriptionHeader: {
        paddingLeft: 7,
        paddingTop: 10,
        fontSize: 18,
        color: "white"
    },
    articleDescription: {
        paddingLeft: 7,
        paddingTop: 5,
        color: "white"
    },
    analysisContainer: {
        paddingTop: 10
    },
    slide: {
        shadowColor: "black",
        shadowOffset: {width: 5, height: 5},
        shadowOpacity: 0.7,
        shadowRadius: 5,
        height: Dimensions.get("window").height,
        backgroundColor: '#7d7d7d'

    },
    wrapperContainer: {
        backgroundColor: "#525252"
    }
});

AppRegistry.registerComponent('neuralnews', () => neuralnews);
