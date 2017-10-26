import React from 'react';
import { Text, AppRegistry, StyleSheet, ScrollView, View, Dimensions, Image, TouchableHighlight } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Search from 'react-native-search-box';
import { WebView, Linking } from 'react-native';

const networkImageDictionary = {
  'MSN':              require('./assets/msn.png'),
  'CNN':              require('./assets/cnn.png'),
  'Huffington Post':  require('./assets/huffington_post.png'),
  'Fox News':         require('./assets/fox_news.png'),
  'Breitbart':        require('./assets/breitbart.jpeg'),
  'NBC':              require('./assets/nbc.png'),
  'Politico':         require('./assets/politico.png'),
  'Washington Post':  require('./assets/washington_post.png'),
  'unknown':          require('./assets/nnn.jpg'),
};

const polarityImageDictionary = {
  'very_negative' : require('./assets/very_negative.png'),
  'very_positive' : require('./assets/very_positive.png'),
  'somewhat_negative' : require('./assets/somewhat_negative.png'),
  'somewhat_positive' : require('./assets/somewhat_positive.png'),
  'neutral' : require('./assets/neutral.png')
};

var mapNetworkImage = function(source)
{
  if (source in networkImageDictionary) {
    return networkImageDictionary[source]
  } else {
    return networkImageDictionary['unknown']
  }
}

var mapPolarityImage = function(polarity)
{
    if (polarity <= -0.75) {
        return polarityImageDictionary['very_negative'];
    } else if (polarity <= -0.25) {
        return polarityImageDictionary['somewhat_negative'];
    } else if (polarity >= 0.25 && polarity <= 0.75) {
        return polarityImageDictionary['somewhat_positive'];
    } else if (polarity > 0.75) {
        return polarityImageDictionary['very_positive'];
    } else {
        return polarityImageDictionary['neutral'];
    }
}


export default class SearchResultsScreen extends React.Component {
    /*
     * constructor
     * Responsible for initializing the SearchResultsScreen class
     */
    constructor(props) {
        super(props);
        this.state = {
            articles: this.props.navigation.state.params.articles,
            toggled: false,
            url: 'some_url'
        }
        this.onSearch = this.onSearch.bind(this)
    }

    /*
     * renderItem
     * Renders a single article object
     */
    _renderItem({item}) {
        return (
                <View style={styles.slide}>

                        {/* News network logo */}
                        <TouchableHighlight
                            onPress={() => {
                              Linking.openURL(item.article.url);
                            }}
                            style={styles.linkContainer}
                        >
                          <View >
                            <Image
                              source={mapNetworkImage(item.article.source)}
                              style={styles.articleImage}
                            />
                            <View style={styles.articleTitleContainer}>
                              <Image
                                source={{uri: item.article.thumbnail}}
                                style={{height: 45, width: 45}}
                              />
                              <Text style={styles.articleTitle}>{item.article.title}</Text>
                            </View>
                          </View>
                        </TouchableHighlight>

                        {/* Article title */}
                    <ScrollView>
                        {/* Article description */}
                        <View style={styles.articleDescriptionContainer}>
                            <Text style={styles.articleDescription}>{item.article.description}</Text>
                        </View>
                        {/* NLP analysis */}
                        <View style={styles.analysisContainer}>
                          <View style={styles.entitiesContainer}>
                            <View style={styles.entityContainer}>
                              <Text
                                style={styles.entity}
                                onPress={() => this.onSearch(item.article.data[0].ent)}
                              >
                                {item.article.data[0].ent}
                              </Text>
                            </View>
                            <Image
                                source={mapPolarityImage(item.article.data[0].polarity)}
                                style={{height: 60, width: 120}}
                            />
                          </View>
                          <View style={styles.entitiesContainer}>
                            <View style={styles.entityContainer}>
                              <Text
                                style={styles.entity}
                                onPress={() => this.onSearch(item.article.data[1].ent)}
                              >
                                {item.article.data[1].ent}
                              </Text>
                            </View>
                            <Image
                                source={mapPolarityImage(item.article.data[1].polarity)}
                                style={{height: 60, width: 120}}
                            />
                          </View>
                        </View>
                    </ScrollView>
                </View>
        );
    }

    /*
     * onSearch
     *
     */
     onSearch = (text) => {
         return new Promise((resolve, reject) => {
             // 2. Make HTTP GET call to the server
             //fetch('https://neuralnews.herokuapp.com/trump.json')
             fetch('https://neuralnews.herokuapp.com/query?search=' + text.replace(' ', '%20'))

             // 3. Handle the response
                 .then((response) => response.json())

                 // 3b. Convert JSON string to JS object
                 .then((resJson) => {
                     this.props.navigation.navigate('MyResults', { "articles" : resJson, "topic": text})
                     resolve();
                 })

                 // 3c. Catch errors
                 .catch((error) => {
                     alert("Error: " + JSON.stringify(error));
                 });
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
        color: "black",
        fontWeight: "bold"
    },
    articleTitle: {

    },
    articleDescriptionContainer: {

    },
    articleDescription: {
        paddingLeft: 7,
        paddingRight: 7,
        paddingTop: 7,
        color: "black",
        flexWrap: "wrap"
    },
    analysisContainer: {
        paddingBottom: 10
    },
    entityContainer: {
      flexWrap: "wrap",
      width: 175
    },
    entity: {
      paddingLeft: 7,
      paddingRight: 7,
      color: "black",
      fontWeight: 'bold',
      fontSize: 16,
    },
    entitiesContainer: {
        paddingTop: 10,
        //justifyContent : 'space-between',
        flexDirection : 'row',
        alignItems: 'center',

    },
    slide: {
        shadowColor: "black",
        shadowOffset: {width: 5, height: 5},
        shadowOpacity: 0.7,
        shadowRadius: 5,
        height: Dimensions.get("window").height - 125,
        backgroundColor: 'white',
        width: 300,

    },
    wrapperContainer: {
        backgroundColor: "white",
        paddingBottom: 50
    },
    linkContainer: {
      //backgroundColor: "white",
      borderWidth: .5,
      borderTopColor: "gray",
      borderBottomColor: "gray",
      borderLeftColor: "gray",
      borderRightColor: "transparent",
      shadowColor: "black",
      shadowOffset: {width: 0.5, height: 0.5},
      shadowOpacity: 0.3,
      shadowRadius: 0.5,
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
    },
    contentContainer: {
        paddingVertical: 20
    }
});
