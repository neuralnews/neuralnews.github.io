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
        color: '#5193ff',
        fontSize: 14,
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
        backgroundColor: 'grey',
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


export default class Entity extends React.Component {
    render () {
        return (
            <View style={styles.entitiesContainer}>
                <View style={styles.entityContainer}>
                    <Text
                        style={styles.entity}
                    >
                        {this.props.name}
                    </Text>
                </View>
                <Image
                    source={mapPolarityImage(this.props.sentiment)}
                    style={{height: 40, width: 80}}
                />
            </View>
        )
    }
}