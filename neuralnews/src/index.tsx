import React, { PureComponent } from 'react'
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    Fetch
} from 'react-native'
import { StackNavigator } from 'react-navigation'


// NewsAPI key: df226193949242e689ab6d8117191610
class HomeScreen extends PureComponent {
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

const Nav = StackNavigator({
    Home: { screen: HomeScreen }
});

export default Nav;
