import React from 'react';
import {Text, AppRegistry, StyleSheet, ScrollView, View, Dimensions, Image, TouchableHighlight, processColor} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Search from 'react-native-search-box';
import Nav from './index.js';
import { WebView, Linking } from 'react-native';
var Browser = require('react-native-browser');

const articleImageDictionary = {
  'MSN':              require('./assets/msn.png'),
  'CNN':              require('./assets/cnn.png'),
  'Huffington Post':  require('./assets/huffington_post.png'),
  'Fox News':         require('./assets/fox_news.png'),
  'Breitbart':        require('./assets/breitbart.jpeg'),
  'NBC':              require('./assets/nbc.png'),
  'Politico':         require('./assets/politico.png'),
  'Washington Post':  require('./assets/washington_post.png'),
  'unknown':          require('./assets/nnn.jpg'),
}

var mapArticleImage = function(source) {
  if (source in articleImageDictionary) {
    return articleImageDictionary[source]
  } else {
    return articleImageDictionary['unknown']
  }
}


export default class SearchResultsScreen extends React.Component {
    // Navigation options for stackNavigator

    /*
     * openLink
     */
    _openLink = (url) => {
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
        //alert(JSON.stringify(this.state.articles));
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
                  return (
                    <LinkArticle url={item.url}/>
                  );}}>
                  <Image
                    source={mapArticleImage(item.article.source)}
                    style={styles.articleImage}
                    //source={require('./assets/nnn.jpg')}
                  />
                </TouchableHighlight>

                {/* Article title */}
                <View style={styles.articleTitleContainer}>
                  <Image
                    source={mapArticleImage(item.article.source)}
                    style={{height: 45, width: 45}}
                  />
                  <Text style={styles.articleTitle}>{item.article.title}</Text>
                </View>

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
    alert("WOO")
    return (
          <WebView
            ref={(ref) => { this.webview = ref; }}
            source={{ uri: this.props.poop }}
            onNavigationStateChange={(event) => {
              if (event.url !== 'https://www.google.com') {
                this.webview.stopLoading();
                Linking.openURL(event.url);
              }
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
        fontSize: 20,
        paddingTop: 5,
        paddingBottom: 5,
        color: "black"
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
        color: "black"
    },
    articleTitle: {

    },
    articleDescription: {
        paddingLeft: 7,
        paddingTop: 5,
        color: "black"
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
        //backgroundColor: '#7d7d7d',
        backgroundColor: 'white',
        width: 300

    },
    wrapperContainer: {
        backgroundColor: "white"
    },
    articleTitleContainer: {
        //flex:0.5, //height (according to its parent),
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: 7,
        width: 260
    },
    articleTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
        //textAlign: 'center',
        flexWrap: 'wrap',
        paddingLeft: 7,
        //margin: 30
    }
});
