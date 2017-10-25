import React from 'react';
import {Text, AppRegistry, StyleSheet, ScrollView, View, Dimensions, Image, TouchableHighlight, processColor} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Search from 'react-native-search-box';
import Nav from './index.js';
import { WebView, Linking } from 'react-native';
var Browser = require('react-native-browser');


export default class SearchResultsScreen extends React.Component {
    // Navigation options for stackNavigator
    static navigationOptions = {
        title: 'Neural News'
    }

    /*
     * openLink
     */
    _openLink = (url) => {
      alert("BOYA");
      // if (!this.state.toggled) {
      //   return null;
      // }
      //const url = 'https://www.google.com';
      return (
        <WebView
          ref={(ref) => { this.webview = ref; }}
          source={{ uri: 'https://www.google.com' }}
          onNavigationStateChange={(event) => {
            // if (event.url !== 'https://www.google.com') {
            //   this.webview.stopLoading();
            //   Linking.openURL(event.url);
            // }
            alert("HOOO");
            Linking.openURL(event.url);
          }}
        />
      );
    }

    /*
     * constructor
     * Responsible for initializing the SearchResultsScreen class
     */
    constructor(props) {
        super(props);
        this.state = {
            articles: this.props.navigation.state.params.articles,
            toggled: false
        }
        alert(JSON.stringify(this.state.articles));
        this._openLink = this._openLink.bind(this);
        this.setState = this.setState.bind(this);
    }

    /*
     * renderItem
     * Renders a single article object
     */
    _renderItem({item}) {

        return (
            <View style={styles.slide}>
                {/* News network logo */}
                <TouchableHighlight onPress={() => {
                  alert("HOO");
                  return (
                    <LinkArticle url={item.url}/>
                  )}>

                {/* TODO: Article title */}

                {/* Article description */}
                <View style={styles.descriptionContainer}>
                    <Text style={styles.articleDescriptionHeader}>Description</Text>
                    <Text style={styles.articleDescription}>TODO: Get article description</Text>
                </View>

                {/* NLP analysis */}
                <View style={styles.analysisContainer}>
                    <Text style={styles.articleDescriptionHeader}>Analysis</Text>
                    <Text style={styles.articleDescription}>{item.article.data[0].ent} {item.article.data[0].polarity}</Text>
                    <Text style={styles.articleDescription}>{item.article.data[1].ent} {item.article.data[1].polarity}</Text>
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
            this.props.navigation.navigate('MyResults', {"topic": text})
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
                    ref={(c) => {
                        this._carousel = c;
                    }}
                    data={this.state.articles}
                    renderItem={this._renderItem}
                    sliderWidth={Dimensions.get('window').width}
                    itemWidth={300}
                    firstItem={1}
                    containerCustomStyle={styles.slider}
                />
            </View>
        );
    }
}

class LinkArticle extends React.Component {

  render() {

    return (
          <WebView
            ref={(ref) => { this.webview = ref; }}
            source={{ uri: this.props.poop }}
            onLoadStart={(event) => {
              if (event.url !== 'https://www.google.com') {
                this.webview.stopLoading();
                Linking.openURL(event.url);
              }
              alert("HOOO");
              Linking.openURL(event.url);
            }}
          />
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
    descriptionContainer: {},
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
    },
    articleTitleContainer: {
        flex:0.5, //height (according to its parent),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    articleTitle: {
        fontSize: 16,
        flex: 0.8,
        color: 'white',
        textAlign: 'center',
        flexWrap: 'wrap'
    }
});
