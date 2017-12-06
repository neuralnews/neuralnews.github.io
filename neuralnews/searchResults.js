import React from 'react';
import {
    Text,
    StyleSheet,
    ScrollView,
    View,
    Dimensions,
    Image,
    TouchableHighlight,
    WebView,
    Linking,
    AsyncStorage
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Search from 'react-native-search-box';
import Spinner from 'react-native-loading-spinner-overlay';
import {StackNavigator} from 'react-navigation';


const networkImageDictionary = {
    msn: require('./assets/msn.png'),
    cnn: require('./assets/cnn.png'),
    'huffington post': require('./assets/huffington_post.png'),
    'fox news': require('./assets/fox_news.png'),
    breitbart: require('./assets/breitbart.jpeg'),
    nbc: require('./assets/nbc.png'),
    politico: require('./assets/politico.png'),
    'washington post': require('./assets/washington_post.png'),
    unknown: require('./assets/nnn.jpg'),
    'abc news': require('./assets/abc_news.jpeg'),
    'reuters': require('./assets/reuters.png'),
};

const polarityImageDictionary = {
    very_negative: require('./assets/very_negative.png'),
    very_positive: require('./assets/very_positive.png'),
    somewhat_negative: require('./assets/somewhat_negative.png'),
    somewhat_positive: require('./assets/somewhat_positive.png'),
    neutral: require('./assets/neutral.png'),
};

const mapNetworkImage = function (source) {
    if (source in networkImageDictionary) {
        return networkImageDictionary[source];
    }
    return networkImageDictionary.unknown;
};

const mapPolarityImage = function (polarity) {
    if (polarity <= -0.75) {
        return polarityImageDictionary.very_negative;
    } else if (polarity <= -0.1) {
        return polarityImageDictionary.somewhat_negative;
    } else if (polarity >= 0.1 && polarity <= 0.75) {
        return polarityImageDictionary.somewhat_positive;
    } else if (polarity > 0.75) {
        return polarityImageDictionary.very_positive;
    }
    return polarityImageDictionary.neutral;
};

// StyleSheet
const styles = StyleSheet.create({
    articleTitleContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: 7,
        width: 260,
    },
    articleTitle: {
        fontSize: 14,
        color: '#0645AD',
        flexWrap: 'wrap',
        paddingLeft: 7,
        paddingRight: 7,
    },
    searchBarContainer: {
        alignContent: 'center',
    },
    articleImage: {
        height: 60,
        width: 60
    },
    carouselContainer: {
        borderWidth: .5,
        borderTopColor: 'black',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        alignContent: 'center',
    },
    descriptionContainer: {
        paddingBottom: 20,
        borderWidth: .5,
        borderTopColor: 'transparent',
        borderBottomColor: 'gray',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
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
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
    },
    articleDescription: {
        paddingLeft: 7,
        paddingRight: 7,
        paddingTop: 7,
        color: 'black',
        flexWrap: 'wrap',
    },
    analysisContainer: {
        paddingBottom: 100,
        borderWidth: .5,
        borderTopColor: 'black',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
    },
    entityContainer: {
        flexWrap: 'wrap',
        width: 175,
    },
    entity: {
        paddingLeft: 7,
        paddingRight: 7,
        color: '#0645AD',
        fontSize: 16,
    },
    entitiesContainer: {
        paddingTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    slide: {
        shadowColor: 'black',
        shadowOffset: {width: 5, height: 5},
        shadowOpacity: 0.7,
        shadowRadius: 5,
        height: Dimensions.get('window').height - 100,
        backgroundColor: 'white',
        width: 300,

    },
    wrapperContainer: {
        backgroundColor: 'grey'
    },
    contentContainer: {
        paddingVertical: 20,
    },
    queryContainer: {
        backgroundColor: "transparent",
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 5,
    },
    queryText: {
        color: "white",
        fontSize: 16,
    },
});


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
            url: 'some_url',
            visible: false,
            topic: this.props.navigation.state.params.topic,
        };
        this.onSearch = this.onSearch.bind(this);
    }


    /*
     * onSearch
     *
     */
    onSearch = (text) => {
        this.setState({
            visible: true,
        });
        if (text == 'Trump_raw.json') {
            return new Promise((resolve, reject) => {
                // 2. Make HTTP GET call to the server
                fetch('http://104.196.204.46:3000/Trump_raw.json', {
                    method: 'GET',
                    headers: {
                        Accept: 'text',
                        'Content-Type': 'text',
                    }
                })

                // 3. Handle the response
                    .then((response) => response.json())

                    // 3b. Convert JSON string to JS object
                    .then((resJson) => {
                        this.setState({
                            visible: false,
                            articles: resJson,
                            topic: text,
                        });
                        resolve();
                    })

                    // 3c. Catch errors
                    .catch((error) => {
                        this.setState({
                            visible: false,
                        });
                        alert('Fetch Error: ' + JSON.stringify(error));
                    });
            });
        } else {
            return new Promise((resolve, reject) => {
                // 2. Make HTTP GET call to the server
                fetch('http://104.196.204.46:3000/query?search=' + text.replace(' ', '%20'), {
                    method: 'GET',
                    headers: {
                        Accept: 'text',
                        'Content-Type': 'text',
                    }
                })

                // 3. Handle the response
                    .then((response) => response.json())

                    // 3b. Convert JSON string to JS object
                    .then((resJson) => {
                        this.setState({
                            visible: false,
                            articles: resJson,
                            topic: text,
                        });
                        resolve();
                    })

                    // 3c. Catch errors
                    .catch((error) => {
                        this.setState({
                            visible: false,
                        });
                        alert('Fetch Error: ' + JSON.stringify(error));
                    });
            });
        }
    }

    /*
       * renderItem
       * Renders a single article object
       */
    renderItem({item}) {
        return (
            <View
                style={styles.slide}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    {/* News network logo */}
                    <TouchableHighlight
                        onPress={() => {
                            Linking.openURL(item.article.url);
                        }}
                        style={styles.linkContainer}
                    >
                        <View style={styles.articleTitleContainer}>
                            <Image
                                source={{uri: item.article.thumbnail}}
                                style={styles.articleImage}
                            />
                            <View>
                                <Text style={styles.articleTitle}>{item.article.title}</Text>
                                <Text style={styles.articleNetwork}>{item.article.source}</Text>
                            </View>
                        </View>
                    </TouchableHighlight>

                    {/* Article title */}

                    {/* Article description */}
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.articleDescription}>{item.article.description}</Text>
                    </View>
                    {/* NLP analysis */}
                    <Entities
                      data={item.article.data}
                    />
                </ScrollView>
            </View>
        );
    }

    /*
     * render
     * Renders the SearchResultsScreen
     */
    render() {
        return (
            // Wrapper
            <View style={styles.wrapperContainer}>
                <Spinner
                    visible={this.state.visible}
                />

                {/* Search Bar */}
                <View style={styles.searchBarContainer}>
                    <Search
                        onSearch={this.onSearch}
                    />
                </View>

                <View
                    style={styles.queryContainer}>
                    <Text style={styles.queryText}>{this.state.topic}</Text>

                </View>

                {/* Cover flow style display of sorted articles along with their
                    appropriate NLP data */}
                <Carousel
                    data={this.state.articles}
                    renderItem={this.renderItem}
                    sliderWidth={Dimensions.get('window').width}
                    itemWidth={300}
                    firstItem={2}
                />
            </View>
        );
    }
}
