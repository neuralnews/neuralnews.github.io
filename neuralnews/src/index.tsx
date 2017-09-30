import React, { PureComponent } from 'react'
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    Fetch
} from 'react-native'

// NewsAPI key: df226193949242e689ab6d8117191610
export default class App extends PureComponent {
    onCancel = () => {
        fetch('https://newsapi.org/v1/articles?source=cnn&sortBy=top&apiKey=df226193949242e689ab6d8117191610')
            .then((response) => response.json())
            .then((responseJson) => {
                let article = responseJson.articles[9];
                alert("CNN\nTitle: " + JSON.stringify(article.title) + "\n" + "Description: " + article.description);
            });
    }

    render() {
        return (
            <View style={styles.container}>
                {/* Hide status bar */}
                <StatusBar hidden={true} />

                {/* Header */}
                <View style={styles.headerContainer}>
                    <Text style={styles.text}>
                        NeuralNews!
                    </Text>
                </View>

                {/* Search field */}
                <View style={styles.searchBar}>
                    <Search
                        onCancel={this.onCancel}
                     />
                </View>

                {/* Trending topics */}
                <View style={styles.trendingTopicsContainer}>
                    <Text style={styles.trendingTopicsText}>
                        TRENDING TOPICS
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    headerContainer: {
        borderBottomWidth: 0.75,
        borderBottomColor: 'black'
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    searchBar: {
        flex: 1,
        flexDirection: "column"
    },
    trendingTopicsContainer: {
        borderWidth: 1,
        borderColor: 'black'
    },
    trendingTopicsText: {
        textAlign: 'center',
        fontFamily: 'Times New Roman',
        fontWeight: 'bold',
        fontSize: 36,
    }
});