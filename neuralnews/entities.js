import React from "react";
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
import Entity from './entity.js';

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
        alignContent: 'center',
    },
    descriptionContainer: {
        paddingBottom: 20,
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
        backgroundColor: '#211f21'
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


export default class Entities extends React.Component {
    render () {
        return (
            <View style={styles.analysisContainer}>
                <Entity
                    name={this.props.data[0].name}
                    score={this.props.data[0].sentiment.score}
                    magnitude={this.props.data[0].sentiment.magnitude}
                />
                <Entity
                    name={this.props.data[1].name}
                    score={this.props.data[1].sentiment.score}
                    magnitude={this.props.data[1].sentiment.magnitude}
                />
                <Entity
                    name={this.props.data[2].name}
                    score={this.props.data[2].sentiment.score}
                    magnitude={this.props.data[2].sentiment.magnitude}
                />
            </View>
        )
    }
}
