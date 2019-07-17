import React from "react";
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import AppNavigation from './config/routes';
import { Root } from "native-base";
import { ChatProvider } from "./context/ChatProvider";
import { I18nManager, YellowBox } from 'react-native';

class App extends React.Component {

  constructor(props) {
      super(props);
      I18nManager.forceRTL(false);
      I18nManager.allowRTL(false);
      this.state = {
        isReady: false,
      }
      console.ignoredYellowBox = ['Remote debugger'];
      YellowBox.ignoreWarnings([
          'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
      ]);

  }

  async _getFonts() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      'noto-font': require('./assets/fonts/NotoKufiArabic-Regular.ttf')
    })
  }

  render() {
    if(!this.state.isReady) {
      return (
          <AppLoading startAsync={this._getFonts} onFinish={() => this.setState({isReady: true})}/>
      )
    }
    return (
        <ChatProvider chat={null}>
          <Root><AppNavigation /></Root>
        </ChatProvider>
    )
  }
}

export default App