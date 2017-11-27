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


const styles = {
  articlesContainerDefault: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  articlesContainerExpanded: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  seeMoreOrLess: {
    fontSize: 8,
    justifyContent: 'right',
    alignItems: 'right',
  }
};


export default class Articles extends Component {

  constructor(props) {
    super(props);
    this.state = {
        visible: false,
        expanded: false,
        articles: [],
        loading: true,
    };

    // 2. Make HTTP GET call to the server
    alert(this.props.topic)
    const URL = 'http://104.196.204.46:3000/query?search=' + this.props.topic.replace(' ', '%20');
    fetch(URL, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })

        // 3. Handle the response
        .then((response) => response.json())

        // 3b. Convert JSON string to JS object
        .then((resJson) => {
            this.setState({
                visible: !this.state.visible,
                articles: resJson,
            });
            resolve();
        })

        // 3c. Catch errors
        .catch((error) => {
            alert('Error: ' + JSON.stringify(error));
            reject('error');
        });
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
    if (this.state.loading) {
      return (
        <View style={styles.container}>
            <Spinner
                visible={this.state.visible}
            />
        </View>
      )
    } else if (!this.state.expanded) {
      return (
        <View style={styles.articlesContainerDefault}>
          <Article article={this.state.articles[0]}/>
          <Article article={this.state.articles[1]}/>
          <TouchableHighlight onPress={this.expand}>
            <Text style={styles.seeMoreOrLess}>SEE MORE</Text>
          </TouchableHighlight>
        </View>
      );
    } else {
      return (
        <ScrollView style={styles.articlesContainerExpanded}>
          <Article article={this.state.articles[0]}/>
          <Article article={this.state.articles[1]}/>
          <Article article={this.state.articles[2]}/>
          <Article article={this.state.articles[3]}/>
          <Article article={this.state.articles[4]}/>
          <TouchableHighlight onPress={this.expand}>
            <Text style={styles.seeMoreOrLess}>SEE LESS</Text>
          </TouchableHighlight>
        </ScrollView>
      );
    }
  }
}
