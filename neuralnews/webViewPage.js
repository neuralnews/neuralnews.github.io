import React, { Component } from 'react';
import { WebView } from 'react-native';

export default class webViewPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url : this.props.navigation.state.params.url
        };
    }

    render() {
        return (
            <WebView
                source={{uri: this.state.url}}
                style={{marginTop: 20}}
            />
        );
    }
}