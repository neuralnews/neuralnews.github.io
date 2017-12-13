import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    StatusBar,
    Fetch,
    AppRegistry,
    Text,
    Image,
    Dimensions,
    TouchableHighlight,
    Linking,
    ScrollView,
    Button,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { StackNavigator } from 'react-navigation';
import Search from 'react-native-search-box';
import SearchResultsScreen from './searchResults.js';
import SearchScreen from './searchPage.js';
import Entities from './entities.js';

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

class HomeScreen extends Component {
    static navigationOptions = ({navigation}) => ({
        title: 'Neural News',
        headerRight: (
            <View style={styles.searchImageContainer}>
                <TouchableHighlight onPress={() => {navigation.navigate('MySearch')}}>
                    <Image
                        style={styles.searchImage}
                        source={require('./assets/search.png')}>
                    </Image>
                </TouchableHighlight>
            </View>
        ),
        headerStyle: {
            backgroundColor: '#211f21',
        },
        headerTintColor: 'lightgrey',
    });

    constructor(props)
    {
        super(props);
        this.state = {
           isLoading: true,
        };

        this.renderItem = this.renderItem.bind(this);

        fetch('https://neural-news-186322.appspot.com/hometopics', {
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
                isLoading: false,
                homeData: resJson,
            });
        });
    }

    renderItem(item)
    {
        return (<View style={styles.wrapperContainer}>
            <View style={styles.topStoryContainer}>
                <TouchableHighlight
                    style={styles.iconContainer}
                >
                    <Image
                        source={require('./assets/negative.png')}
                        style={styles.searchImage}
                    />
                </TouchableHighlight>
                <View>
                    {/* Article icon, description, and source -- all click-able to link to article */}
                    <TouchableHighlight
                        onPress={() => {
                            Linking.openURL(item.item.article.url);
                        }}
                        style={styles.linkContainer}
                    >
                        <View style={styles.articleTitleContainer}>
                            <Image
                                source={{uri: item.item.article.thumbnail}}
                                style={styles.articleImage}
                            />
                            <View>
                                <Text style={styles.articleTitle}>{item.item.article.title}</Text>
                                <Text style={styles.articleNetwork}>{item.item.article.source}</Text>
                            </View>
                        </View>
                    </TouchableHighlight>

                    {/* Article description */}
                    {/*<View style={styles.descriptionContainer}>*/}
                        {/*<Text style={styles.articleDescription}>{item.item.article.description}</Text>*/}
                    {/*</View>*/}

                    {/* NLP analysis */}
                    <Entities
                        data={item.item.article.data}
                    />
                </View>
                <TouchableHighlight
                    style={styles.iconContainer}
                >
                    <Image
                        source={require('./assets/positive.png')}
                        style={styles.searchImage}
                    />
                </TouchableHighlight>
            </View>
        </View>);
    }

    render()
    {
        if (!this.state.isLoading) {
            // TODO: Display top topics in a feed view
            return (
                <View style={styles.wrapperContainer}>
                    <ScrollView style={{backgroundColor: '#211f21', height: Dimensions.get('window').height,}}>
                        <View style={styles.topStoriesContainer}><Text style={styles.topStoriesText}>TOP STORIES</Text></View>

                        {/* Top Story #1 */}
                        <View style={styles.topStoryContainer2}>
                            <View>
                                <Text style={styles.topicText}>{this.state.homeData[0].topic}</Text>
                                <Carousel
                                    data={this.state.homeData[0].articles}
                                    renderItem={this.renderItem}
                                    sliderWidth={Dimensions.get('window').width}
                                    itemWidth={Dimensions.get('window').width}
                                    firstItem={1}
                                />
                            </View>
                        </View>
                        <View style={styles.topStoryContainer2}>
                            <View>
                                <Text style={styles.topicText}>{this.state.homeData[1].topic}</Text>
                                <Carousel
                                    data={this.state.homeData[1].articles}
                                    renderItem={this.renderItem}
                                    sliderWidth={Dimensions.get('window').width}
                                    itemWidth={Dimensions.get('window').width}
                                    firstItem={0}
                                />
                            </View>
                        </View>
                        <View style={styles.topStoryContainer2}>
                            <View>
                                <Text style={styles.topicText}>{this.state.homeData[2].topic}</Text>
                                <Carousel
                                    data={this.state.homeData[2].articles}
                                    renderItem={this.renderItem}
                                    sliderWidth={Dimensions.get('window').width}
                                    itemWidth={Dimensions.get('window').width}
                                    firstItem={1}
                                />
                            </View>
                        </View>

                        {/* Top Story #2 */}
                        <View style={styles.topStoryContainer2}>
                            <View>
                                <Text style={styles.topicText}>{this.state.homeData[3].topic}</Text>
                                <Carousel
                                    data={this.state.homeData[3].articles}
                                    renderItem={this.renderItem}
                                    sliderWidth={Dimensions.get('window').width}
                                    itemWidth={Dimensions.get('window').width}
                                    firstItem={1}
                                />
                            </View>
                        </View>

                        {/* Top Story #2 */}
                        <View style={styles.topStoryContainer2}>
                            <View>
                                <Text style={styles.topicText}>{this.state.homeData[4].topic}</Text>
                                <Carousel
                                    data={this.state.homeData[4].articles}
                                    renderItem={this.renderItem}
                                    sliderWidth={Dimensions.get('window').width}
                                    itemWidth={Dimensions.get('window').width}
                                    firstItem={1}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>
            );
        } else {
            return (
                <View
                    style={styles.loadingImageContainer}>
                    <Image
                        source={require('./assets/loading.png')}
                        style={styles.loadingImage}
                    />
                </View>
            );
        }
    };
}


const Nav = StackNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: ({ navigation }) => ({
            title: 'Neural News',
        }),
    },
    MyResults: {
        screen: SearchResultsScreen,
        navigationOptions: ({ navigation }) => ({
            title: 'Search Results',
        }),
    },
    MySearch: {
        screen: SearchScreen,
        navigationOptions: ({ navigation }) => ({
            title: "Search",
        }),
    },
});

export default Nav;

AppRegistry.registerComponent('neuralnews', () => neuralnews);
