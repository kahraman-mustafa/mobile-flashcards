import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {getDeck} from "../data/api";
import TextButton from "./TextButton";

class IndividualDeck extends Component {

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

  routeToNewQuestion = () => {
    this.props.navigation.navigate("NewQuestion", {deckTitle: this.state.deckTitle})
  }

  routeToQuiz = () => {
    this.props.navigation.navigate("Quiz", {deckTitle: this.state.deckTitle})
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{textAlign: "center"}}>{this.state.deckTitle}</Text>
        <Text>{this.state.questions.length} Questions</Text>
        <TextButton onPress={this.routeToQuiz} style={{margin:20}}>
            To Quiz
        </TextButton>
        <TextButton onPress={this.routeToNewQuestion} style={{margin:20}}>
            To New Question
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

export default IndividualDeck;