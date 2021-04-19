import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, KeyboardAvoidingView, SafeAreaView, TouchableOpacity } from 'react-native';
import TextButton from "./TextButton";
import {colorAccent, white, gray} from "../assets/colors";
import {saveDeckTitle, getDeckTitles} from "../data/api";

class NewDeck extends Component {

  state = {
    currentTitles: [],
    inputTitle: "",
    titleExisted: false
  }

  updateState = () => {
    getDeckTitles().then((currentTitles) => {
      this.setState(() => ({currentTitles}))
    })
  }

  componentDidMount(){
    this.updateState();

    this._unsubscribeFocus = this.props.navigation.addListener('focus', () => {
      // user has navigated to this screen
      console.log("New Deck got Focus");
      this.updateState();
    });

    this._unsubscribeBlur = this.props.navigation.addListener("didBlur", () => {
      // user has navigated away from this screen
      console.log("New Deck lost Focus");
    });
  }

  componentWillUnmount() {
    this._unsubscribeFocus();
    this._unsubscribeBlur();
  }

  handleCreateDeck = () => {
    const {inputTitle} = this.state;

    saveDeckTitle(inputTitle)
      .then(() => {
        this.props.navigation.navigate("IndividualDeck", {deckTitle: inputTitle});
      })
  }

  handleInputChange = (inputTitle) => {
    const {currentTitles} = this.state;
    console.log("input change: ", inputTitle);
    this.setState(() => ({inputTitle}));
    
    if(currentTitles && currentTitles.includes(inputTitle)){
      this.setState(() => ({titleExisted: true}))
    } else {
      this.setState(() => ({titleExisted: false}))
    }
  }

  render() {
    const {currentTitles, inputTitle, titleExisted} = this.state;
    console.log("Current titles fetched: ", currentTitles);
    return (
      <KeyboardAvoidingView style={styles.container}>

        <SafeAreaView style={styles.inputContainer}>
          <TextInput 
            value={inputTitle}
            style={styles.input}
            onChangeText={this.handleInputChange}
            placeholder="Enter Deck Title"
          />
        </SafeAreaView>
        
        {titleExisted && <Text style={styles.warning}>Deck with the same title exist</Text>}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            onPress={this.handleCreateDeck} 
            style={styles.button} 
            disabled={titleExisted || inputTitle.length === 0}>
            <Text style={styles.buttonText}>Create Deck</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    flex: 0.5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  buttonContainer: {
    flex: 0.4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 12
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 12
  },
  warning: {
    textAlign: "center",
    color: "red",
    fontSize: 12,
    fontStyle: "italic"
  },  
  input: {
    flex: 1,
    textAlign: "center",
    alignSelf: "flex-end",
    height: 80,
    marginBottom: 12,
    padding: 8,
    borderColor: gray,
    backgroundColor: white,
    fontSize: 32
  },
  button: {
    width: 200,
    height: 60,
    backgroundColor: colorAccent,
    justifyContent: "center",
    alignItems: "center",
    margin: 20
  },
  buttonText: {
    color: white,
    textAlign: 'center',
    fontSize: 16
  }
})

export default NewDeck;