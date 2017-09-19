import React, { PureComponent } from 'react'
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
} from 'react-native'
import Search from 'react-native-search-box';

export default class App extends PureComponent {
    onSearch = () => {

    }

    onCancel = () => {
        alert("????");
    }

    render() {
        return (
            <View style={styles.container}>
                {/* Hide status bar */}
                <StatusBar hidden={true} />

                {/* Header */}
                <View style={styles.headerContainer}>
                    <Text style={styles.text}>
                        NeuralNews
                    </Text>
                </View>

                {/* Search field */}
                <View style={styles.searchBar}>
                    <Search
                        onSearch={this.onSearch}
                        onCancel={this.onCancel}
                     />
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
});