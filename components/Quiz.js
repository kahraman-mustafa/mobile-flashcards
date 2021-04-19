import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import TextButton from "./TextButton";
import {getDeck} from "../data/api";
import {clearLocalNotification, setLocalNotification} from "../utils/helpers";
import { black, green, paleRed, colorActive, colorAccent, white, red, gray, colorPrimary } from '../assets/colors';

class Quiz extends Component {

  state = {
    deckTitle: "",
    questions: [],
    totalCards: 0,
    cardsLeft: 0,
    numCorrect: 0,
    numIncorrect: 0,
    displayAnswer: false,
    bounceValue: new Animated.Value(1)
  }

  resetVariables = (totalCards) => {
    this.setState(() => ({
      cardsLeft: totalCards,
      numCorrect: 0,
      numIncorrect: 0,
      displayAnswer: false,
    }))
  }

  updateState = () => {
    if(this.props.route.params){
      const { deckTitle } = this.props.route.params;
      
      getDeck(deckTitle).then((deck) => {
        console.log("In Quiz: Deck ", JSON.stringify(deck.questions));
        this.setState(() => ({
          deckTitle: deckTitle,
          questions: deck.questions,
          totalCards: deck.questions.length,
        }))
        this.resetVariables(deck.questions.length);
      })
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

  routeToIndividualDeck = () => {
    this.props.navigation.navigate("IndividualDeck", {deckTitle: this.state.deckTitle});
  }

  routeToResetQuiz = () => {
    this.resetVariables()
    this.props.navigation.push("Quiz", {deckTitle: this.state.deckTitle});
  }

  routeToNewQuestion = () => {
    this.props.navigation.navigate("NewQuestion", {deckTitle: this.state.deckTitle})
  }

  handleCorrect = () => {
    this.setState((state) => ({
      cardsLeft: state.cardsLeft - 1,
      numCorrect: state.numCorrect + 1,
    }))
  }

  handleIncorrect = () => {
    this.setState((state) => ({
      cardsLeft: state.cardsLeft - 1,
      numIncorrect: state.numIncorrect + 1,
    }))
  }

  handleDisplayAnswer = () => {
    const {bounceValue, displayAnswer} = this.state;
    Animated.sequence([
      Animated.timing(bounceValue, {duration:200, toValue:1.5, useNativeDriver: true}),
      Animated.spring(bounceValue, {toValue:1, friction:4, useNativeDriver: true})
    ]).start()
    this.setState(() => ({displayAnswer: !displayAnswer}));
  }

  render() {
    const {totalCards, cardsLeft, numCorrect, numIncorrect, questions, displayAnswer, bounceValue} = this.state;

    // When there is no card to show
    if(totalCards === 0){
      return (
        <View style={styles.container}>
          <Text style={{textAlign: "center"}}>There is no question yet</Text>
          <TextButton onPress={this.routeToNewQuestion} style={{margin:20}}>
            Create Questions
          </TextButton>
        </View>
      )
    }

    if(cardsLeft > 0){
      // There are questions to answer, show quiz screen
      return (
        <View style={styles.container}>

          <View style={[styles.container, {flex: 0.6}]}>
            <View style={{flexDirection: "row", justifyContent: "space-between", marginHorizontal: 12}}>
              <Text>Total Cards: {totalCards}</Text>
              <Text>Cards Left: {cardsLeft}</Text>
            </View>
            <View style={[styles.container, {
              flex: 0.75, 
              margin: 16,
              backgroundColor: displayAnswer ? colorActive : colorPrimary}]}>
              <Animated.Text style={[styles.text, 
                  {color: displayAnswer ? white : black, 
                    transform: [{scale: bounceValue}]}]}>
                {displayAnswer
                  ? questions[totalCards-cardsLeft].answer
                  : questions[totalCards-cardsLeft].question
                }
              </Animated.Text>
            </View>
            <TextButton onPress={this.handleDisplayAnswer}>
              Display {displayAnswer ? "Question" : "Answer"}
            </TextButton>
          </View>

          <View style={[styles.container, {flex: 0.4, alignItems: "center"}]}>
            <TouchableOpacity onPress={this.handleCorrect} style={[styles.button, {backgroundColor: green}]}>
              <Text style={styles.buttonText}>CORRECT</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.handleIncorrect} style={[styles.button, {backgroundColor: paleRed}]}>
              <Text style={styles.buttonText}>INCORRECT</Text>
            </TouchableOpacity>
          </View>

        </View>
      )
    } else {
      // No question left, quiz ended, show final screen, clear notifications
      // Clear local notification
      clearLocalNotification().then(setLocalNotification);
      return (
        <View style={styles.container}>
          <View style={[styles.container, {flex: 0.6}]}>
            <Text style={styles.title}>Quiz Statistics</Text>
            <Text style={styles.text}>Total Questions: {totalCards}</Text>
            <Text style={styles.text}>Correct Answers: {numCorrect}</Text>
            <Text style={styles.text}>Incorrect Answers: {numIncorrect}</Text>
            <Text style={[styles.title, {fontSize: 24}]}>You Answered %{Math.round(numCorrect/totalCards*100)} Correctly</Text>
          </View>
          <View style={[styles.container, {flex: 0.4, alignItems: "center"}]}>
            <TouchableOpacity onPress={this.routeToResetQuiz} style={styles.button}>
              <Text style={styles.buttonText}>Restart Quiz</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.routeToIndividualDeck} style={styles.button}>
              <Text style={styles.buttonText}>Back to Deck</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    padding: 8
  },
  title: {
    textAlign: "center",
    color: colorActive,
    fontSize: 48,
    margin:20
  },
  text: {
    textAlign: 'center',
    color: black,
    fontSize: 16,
    marginVertical: 4
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

export default Quiz;