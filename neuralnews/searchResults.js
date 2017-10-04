import React from 'react';
import { Text, AppRegistry, StyleSheet, View } from 'react-native';
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
    _renderItem ({item, index}) {
        return (
            <Text>No. {index}, Article Name: {item}</Text>
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
                    sliderWidth={1000}
                    itemWidth={200}
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
    }
});

AppRegistry.registerComponent('neuralnews', () => neuralnews);