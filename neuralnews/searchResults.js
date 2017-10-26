import React from 'react';
import { Text, AppRegistry, StyleSheet, ScrollView, View, Dimensions, Image, TouchableHighlight } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Search from 'react-native-search-box';
import { WebView, Linking } from 'react-native';

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
};

const polarityImageDictionary = {
  'very_negative' : require('./assets/very_negative.png'),
  'very_positive' : require('./assets/very_positive.png'),
  'somewhat_negative' : require('./assets/somewhat_negative.png'),
  'somewhat_positive' : require('./assets/somewhat_positive.png'),
  'neutral' : require('./assets/neutral.png')
};

var mapArticleImage = function(source)
{
  if (source in articleImageDictionary) {
    return articleImageDictionary[source]
  } else {
    return articleImageDictionary['unknown']
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
    }

    /*
     * renderItem
     * Renders a single article object
     */
    _renderItem({item}) {
        item.article.image = "";
        item.article.image = mapArticleImage(item.article.source);
        return (
                <View style={styles.slide}>
                    <ScrollView>
                        {/* News network logo */}
                        <TouchableHighlight onPress={() => {
                            Linking.openURL(item.article.url);
                          }}>
                          <Image
                            source={mapArticleImage(item.article.source)}
                            style={styles.articleImage}
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
                        <View style={styles.articleDescriptionContainer}>
                            <Text style={styles.articleDescriptionHeader}>Description</Text>
                            <Text style={styles.articleDescription}>{item.article.description}</Text>
                        </View>

                        <Text style={styles.articleDescriptionHeader}>Analysis</Text>
                        {/* NLP analysis */}
                        <View style={styles.analysisContainer}>
                            <Text style={styles.articleDescription}>{item.article.data[0].ent}</Text>
                            <Image
                                source={mapPolarityImage(item.article.data[0].polarity)}
                                style={{height: 60, width: 120}}
                            />
                        </View>
                        <View style={styles.analysisContainer}>
                            <Text style={styles.articleDescription}>{item.article.data[1].ent}</Text>
                            <Image
                                source={mapPolarityImage(item.article.data[1].polarity)}
                                style={{height: 60, width: 120}}
                            />
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
        color: "black",
        flexWrap: "wrap"
    },
    analysisContainer: {
        paddingTop: 10,
        justifyContent : 'space-between',
        flexDirection : 'row'

    },
    slide: {
        shadowColor: "black",
        shadowOffset: {width: 5, height: 5},
        shadowOpacity: 0.7,
        shadowRadius: 5,
        height: Dimensions.get("window").height,
        backgroundColor: 'white',
        width: 300

    },
    wrapperContainer: {
        backgroundColor: "white",
        paddingBottom: 50
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
