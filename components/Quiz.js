import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import TextButton from "./TextButton";
import {getDeck} from "../data/api";

class Quiz extends Component {
  state = {
    deckTitle: "",
    questions: []
  }

  componentDidMount(){
    if(this.props.route.params){
      const { deckTitle } = this.props.route.params;
      this.setState(() => ({deckTitle}));
      getDeck(deckTitle).then((deck) => {
        this.setState(() => ({questions: deck.questions}));
      })
    } else {
      // Do nothing
    }
  }

  routeToIndividualDeck = () => {
    this.props.navigation.navigate("IndividualDeck", {deckTitle: this.state.deckTitle});
  }

  routeToResetQuiz = () => {
    this.props.navigation.push("Quiz", {deckTitle: this.state.deckTitle});
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{textAlign: "center"}}>Quiz</Text>
        <TextButton onPress={this.routeToIndividualDeck} style={{margin:20}}>
            Back to Individual Deck
        </TextButton>
        <TextButton onPress={this.routeToResetQuiz} style={{margin:20}}>
            To Restart Quiz
        </TextButton>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
})

export default Quiz;