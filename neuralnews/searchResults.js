import React from 'react';
import { Text, AppRegistry, StyleSheet, View } from 'react-native';

export default class SearchResultsScreen extends React.Component {
  static navigationOptions = {
    title: 'Neural News'
  }
    render() {
        return (
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
            </View>
        );
    }
}

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
