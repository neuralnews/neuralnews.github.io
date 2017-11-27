import React, { Component } from 'react';
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
import Carousel from 'react-native-snap-carousel';
import Search from 'react-native-search-box';
import Spinner from 'react-native-loading-spinner-overlay';

import Article from './article.js';

const networkImageDictionary = {
    msn: require('./assets/msn.png'),
    cnn: require('./assets/cnn.png'),
    'huffington post': require('./assets/huffington_post.png'),
    'fox news': require('./assets/fox_news.png'),
    breitbart: require('./assets/breitbart.jpeg'),
    nbc: require('./assets/nbc.png'),
    politico: require('./assets/politico.png'),
    'washington post': require('./assets/washington_post.png'),
    unknown: require('./assets/nnn.jpg'),
    'abc news': require('./assets/abc_news.jpeg'),
    'reuters': require('./assets/reuters.png'),
};

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

const styles = {
  articleContainerDefault: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  articleContainerExpanded: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  seeMoreOrLess: {
    fontSize: 8,
    justifyContent: 'right',
    alignItems: 'right',
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
      color: '#0645AD',
      flexWrap: 'wrap',
      paddingLeft: 7,
      paddingRight: 7,
  },
  articleImage: {
      height: 60,
      width: 60
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
      backgroundColor: 'grey'
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
};


export default class Article extends Component {

  constructor(props) {
    super(props);
    this.state = {
        expanded: false,
    };
  }

  /*
   * expand
   */
  expand = () => {
    this.setState({
        expanded: true,
    });
  }

  /*
   * contract
   */
   contract = () => {
     this.setState({
         expanded: false,
     });
   }

  render() {
    if (!this.state.expanded) {
      return (
        <View style={styles.articleContainerDefault}>
          <TouchableHighlight
              onPress={() => {
                  Linking.openURL(this.props.article.url);
              }}
              style={styles.linkContainer}
          >
              <View style={styles.articleTitleContainer}>
                  <Image
                      source={{uri: this.props.article.thumbnail}}
                      style={styles.articleImage}
                  />
                  <View>
                      <Text style={styles.articleTitle}>{this.props.article.title}</Text>
                      <Text style={styles.articleNetwork}>{this.props.article.source}</Text>
                  </View>
              </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.expand}>
            <Text style={styles.seeMoreOrLess}>SEE MORE</Text>
          </TouchableHighlight>
        </View>
      );
    } else {
      return (
        <ScrollView style={styles.articlesContainerExpanded}>
          <TouchableHighlight onPress={this.expand}>
            <Text style={styles.seeMoreOrLess}>SEE LESS</Text>
          </TouchableHighlight>
        </ScrollView>
      );
    }
  }
}
