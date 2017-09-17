import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View
} from 'react-native'

export default class App extends Component {   
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>
                    NeuralNews
                </Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});