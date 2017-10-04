import React from 'react';
import { Text, AppRegistry, StyleSheet, View, Dimensions, Image, TouchableHighlight } from 'react-native';
import Carousel from 'react-native-snap-carousel';


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
          entries : ["Some_Article", "Another_Article", "Wow_That_Is_An_Article"]
      }
    }

    /*
     * renderItem
     * Renders a single article object
     */
    _renderItem ({item, index})
    {
        return (
            <View>
                {/* News network logo */}
                <TouchableHighlight onPress={() => {alert("TODO: Navigate to article");}}>
                    <Image
                        source={require("./assets/cnn.png")}
                        style={styles.articleImage}
                    />
                </TouchableHighlight>

                {/* Article title */}
                <Text>No. {index}, Article Name: {item}</Text>

                {/* Article description */}
                <View style={styles.descriptionContainer}>
                    <Text style={styles.articleDescriptionHeader}>Description</Text>
                    <Text style={styles.articleDescription}>TODO: Get article description</Text>
                </View>

                {/* NLP analysis */}
                <View style={styles.analysisContainer}>
                    <Text style={styles.articleDescriptionHeader}>Analysis</Text>
                    <Text>TODO: Generate percentage bars to show</Text>
                    <Text>subjectivity for each entity</Text>
                </View>
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
            <View>
                {/* Search Bar */}
                <View style={styles.searchBarContainer}>
                    <Text
                        style={styles.todoText}>
                        TODO: Implement search bar
                    </Text>
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
                    containerCustomStyle={styles.carouselContainer}
                    activeSlideAlignment={"center"}
                    firstItem={1}
                 />
            </View>
        );
    }
}

// StyleSheet
const styles = StyleSheet.create({
    topicHeader: {
        textAlign: "center",
        fontSize: 36
    },
    todoText: {
        textAlign: "center",
        color: "red",
    },
    searchBarContainer: {
        borderBottomColor: "black",
        borderBottomWidth: 0.5,
        height: 70,
        alignContent: "center"
    },
    articleImage: {
        width: 300,
        height: 300
    },
    carouselContainer: {
        borderWidth: 1,
        borderColor: "black",
        alignContent: "center"
    },
    descriptionContainer: {

    },
    articleDescriptionHeader: {
        paddingTop: 10,
        fontSize: 18
    },
    articleDescription: {
        paddingTop: 5
    },
    analysisContainer: {
        paddingTop: 10
    }
});

AppRegistry.registerComponent('neuralnews', () => neuralnews);