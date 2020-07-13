import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Vibration,
} from 'react-native';

// External StyleSheet
import {styles} from '../src/Styles';
import {readText} from '../src/tts';
// import {Api} from '../src/Voiceapi';
import Voice from 'react-native-voice';

export default class Name extends React.Component {
  static navigationOptions = {
    title: 'Name',
    headerShown: false,
  };

  state = {
    pitch: '',
    error: '',
    end: '',
    started: '',
    results: [],
  };

  constructor(props) {
    super(props);
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  onSpeechStart = e => {
    console.log('onSpeechStart: ', e);
    this.setState({
      started: '√',
    });
  };

  onSpeechEnd = e => {
    console.log('onSpeechEnd: ', e);
    this.setState({
      end: '√',
    });
  };

  onSpeechError = e => {
    console.log('onSpeechError: ', e);
    this.setState({
      error: JSON.stringify(e.error),
    });
  };

  onSpeechResults = e => {
    console.log('onSpeechResults: ', e);
    this.setState({
      results: e.value,
      updatename: e.value[0],
    });
  };

  _startRecognizing = async () => {
    Vibration.vibrate(300);
    this.setState({
      pitch: '',
      error: '',
      started: '',
      results: [],
      end: '',
    });

    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  state = {
    updatename: '',
  };

  repeatPost = e => {
    // this.state.results.map((result, index) => {
    readText(this.state.updatename);
    Vibration.vibrate(300);
    // })
  };

  componentDidMount = () => {
    fetch('https://projobslk.website/unseen/settings/getname.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: 1,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.setState({
          updatename: responseJson[0].name,
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  //Insert POST to database
  insertPostToServer = () => {
    fetch('https://projobslk.website/unseen/settings/updatename.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: 1,
        name: this.state.results[0],
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        Vibration.vibrate(300);
        readText('Your name has been successfully updated!');
      })
      .catch(error => {
        console.error(error);
        Vibration.vibrate(300);
        readText('Try again!');
      });
  };

  render() {
    const {navigate, state} = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.flexOne}>
          <TouchableOpacity
            style={[styles.btn, styles.textCenter, styles.colorPink]}
            onLongPress={() => {
              this.props.navigation.goBack();
              Vibration.vibrate(300);
            }}
            onPress={readText.bind(
              this,
              'Go back to personal information menu.',
            )}>
            <Text style={styles.btnCaption}>Go Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.flexThree}>
          <TouchableOpacity
            style={[styles.btn, styles.textCenter, styles.colorYellow]}
            onPress={readText.bind(this, 'Start')}
            onLongPress={this._startRecognizing}>
            <Text style={styles.btnCaption}>Speak Name</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.textCenter, styles.colorBlue]}
            onPress={readText.bind(this, 'Re-try')}
            onLongPress={this._startRecognizing}>
            <Text style={styles.btnCaption}>Retry</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.flexThree}>
          <View style={styles.textCenter}>
            <Text style={styles.contentCenter}>{this.state.updatename}</Text>
          </View>
        </View>
        <View style={styles.flexThree}>
          <TouchableOpacity
            style={[styles.btn, styles.textCenter, styles.colorBlue]}
            onPress={readText.bind(this, 'Read the name.')}
            onLongPress={this.repeatPost}>
            <Text style={styles.btnCaption}>Read It</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.textCenter, styles.colorYellow]}
            onPress={readText.bind(this, 'Save the name.')}
            onLongPress={this.insertPostToServer}>
            <Text style={styles.btnCaption}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
