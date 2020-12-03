import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    View,
    Dimensions,
    StyleSheet,
    BackHandler,
    Platform,
    DeviceEventEmitter,
    Text,
    Image,
    TouchableOpacity,
    TouchableNativeFeedback,
} from 'react-native';

import { WebView } from 'react-native-webview';

// import global from '../common/global';
import { withNavigation } from 'react-navigation'
const kWidth = Dimensions.get('window').width;
const kHeight = Dimensions.get('window').height;

let kwidth = Dimensions.get('window').width;
export default class Privacy extends Component {
    static propTypes = {
        ...TouchableOpacity.propTypes,
        privacyLabel: PropTypes.string,
        accessSite: PropTypes.string,
        // allowFontScaling: Text.propTypes.allowFontScaling,
        // containerStyle: ViewPropTypes.style,
        // disabledContainerStyle: ViewPropTypes.style,
        // disabled: PropTypes.bool,
        // style: Text.propTypes.style,
        // styleDisabled: Text.propTypes.style,
        // childGroupStyle: ViewPropTypes.style,
        // androidBackground: PropTypes.object,
      };
    constructor(props) {
        super(props);
        this.state = {
            backButtonEnabled: false,
        }
    }

    componentDidMount() {
        console.log('Privacy page');
        const { navigation } = this.props;
        this.blurListener = navigation.addListener('didBlur', () => {
            if (Platform.OS === 'android') {
                BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
            }
            console.log("The Privacy Page is blurred");
        });
        this.focusListener = navigation.addListener('didFocus', () => {
            if (Platform.OS === 'android') {
                BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
            }
            console.log("The Privacy Page is focused");
        });

    }

    componentWillUnmount() {
        this.focusListener.remove();
        this.blurListener.remove();
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
        console.log('remove Recurit focus and blur listener');
    }

    onNavigationStateChange = navState => {
        this.setState({
            backButtonEnabled: navState.canGoBack
        });
    };

    onBackAndroid = () => {

        if (this.state.backButtonEnabled) {
            this.refs['webView_privacyPage'].goBack();
            
            return true;
        }
        else {
            if (typeof this.props.navigation.state.params !== 'undefined' && typeof this.props.navigation.state.params.backFromPrivacy != null) {
                this.props.navigation.state.params.backFromPrivacy();
            }
            return false;
        }

    };


    render() {
        return (
            <View style={[{ paddingTop:  0 }, styles.container]}>
                

                <View style={styles.header}>
                    <TouchableOpacity style={{ justifyContent: 'center', position: 'absolute', width: 50, height: 40, alignSelf: 'center', left: 13 }}
                        onPress={() => {
                            if (typeof this.props.navigation.state.params !== 'undefined' && typeof this.props.navigation.state.params.listen_name !== null) {
                                DeviceEventEmitter.emit(this.props.navigation.state.params.listen_name)
                            }

                            if (typeof this.props.navigation.state.params !== 'undefined' && typeof this.props.navigation.state.params.backFromPrivacy != null) {
                                this.props.navigation.state.params.backFromPrivacy();
                            }
                            this.props.navigation.goBack();
                        }}>
                        <Image
                            source={require('../img/back.png')}
                            style={{ width: 11, height: 18 }}>
                        </Image>
                    </TouchableOpacity>
                    <Text style={{ alignSelf: 'center', position: 'absolute', fontSize: 18, color: '#202030' }}>
                        {this.props.privacyLabel}
                    </Text>
                </View>

                <WebView
                    bounces={false}
                    scalesPageToFit={true}
                    source={{
                        uri: this.props.accessSite,
                        method: 'GET',
                        headers: { 'Cache-Control': 'no-cache' }
                    }}
                    style={{ width: kWidth, height: kHeight }}
                    ref="webView_privacyPage"
                    cacheEnabled={false}
                    onNavigationStateChange={this.onNavigationStateChange}
                >
                </WebView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'white',
        height: 45,
        width: kwidth,
    }
})
