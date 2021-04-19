import React, { Component } from 'react';
import { StyleSheet, View, Text, SafeAreaView, KeyboardAvoidingView, TouchableOpacity, TextInput } from 'react-native';
import TextButton from "./TextButton";
import {addCardToDeck} from "../data/api";
import { colorAccent, gray, white } from '../assets/colors';

class NewQuestion extends Component {

  state = {
    deckTitle: "",
    inputQuestion: "",
    inputAnswer: "",
  }

  updateState = () => {
    if(this.props.route.params){
      const { deckTitle } = this.props.route.params;
      this.setState(() => ({deckTitle}));
    } else {
      // Do nothing
    }
  }

  componentDidMount(){
    this.updateState();

    this._unsubscribeFocus = this.props.navigation.addListener('focus', () => {
      // user has navigated to this screen
      console.log("New Question got Focus");
      this.updateState();
    });

    this._unsubscribeBlur = this.props.navigation.addListener("didBlur", () => {
      // user has navigated away from this screen
      console.log("New Question lost Focus");
    });
  }

  componentWillUnmount() {
    this._unsubscribeFocus();
    this._unsubscribeBlur();
  }


  handleAddCardToDeck = () => {
    const {inputQuestion, inputAnswer, deckTitle} = this.state;

    addCardToDeck(deckTitle, {question: inputQuestion, answer: inputAnswer})
      .then(() => {
        this.props.navigation.navigate("IndividualDeck", {deckTitle: this.state.deckTitle});
      })
  }

  handleInputQuestionChange = (inputQuestion) => {
    this.setState(() => ({inputQuestion}));
  }

  handleInputAnswerChange = (inputAnswer) => {
    this.setState(() => ({inputAnswer}));
  }

  render() {
    const {inputQuestion, inputAnswer, deckTitle} = this.state;

    return (
      <KeyboardAvoidingView style={styles.container}>
        <Text style={{textAlign: "center", marginVertical: 16}}>
          Add Card to {deckTitle}
        </Text>
        <SafeAreaView style={{flex: 0.6, justifyContent: "center"}}>
          <SafeAreaView style={styles.inputContainer}>
            <TextInput 
              value={inputQuestion}
              style={styles.input}
              onChangeText={this.handleInputQuestionChange}
              placeholder="Enter Question"
            />
          </SafeAreaView>
          <SafeAreaView style={styles.inputContainer}>
            <TextInput 
              value={inputAnswer}
              style={styles.input}
              onChangeText={this.handleInputAnswerChange}
              placeholder="Enter Answer"
            />
          </SafeAreaView>
        </SafeAreaView>
          
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            onPress={this.handleAddCardToDeck} 
            style={styles.button} 
            disabled={inputQuestion.length === 0 || inputAnswer.length === 0}>
            <Text style={styles.buttonText}>Add Card to Deck</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    padding: 12,
  },
  inputContainer: {
    flex: 0.4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
    marginHorizontal: 8,
  },
  input: {
    flex: 1,
    textAlign: "center",
    height: 100,
    marginBottom: 12,
    padding: 8,
    borderColor: gray,
    backgroundColor: white,
    fontSize: 24
  },
  buttonContainer: {
    flex: 0.4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 12
  },
  warning: {
    textAlign: "center",
    color: "red",
    fontSize: 12,
    fontStyle: "italic"
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

export default NewQuestion;