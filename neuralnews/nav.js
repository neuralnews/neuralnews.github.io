import { StackNavigator } from 'react-navigation';
import HomeScreen from './index.js';
import SearchResultsScreen from './searchResults.js';

const Nav = StackNavigator({
    Home: { screen: HomeScreen },
    MyResults: { screen: SearchResultsScreen }
});

export default Nav;

AppRegistry.registerComponent('neuralnews', () => neuralnews);
