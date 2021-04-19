import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { colorAccent, colorActive, white } from '../assets/colors';
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

      getDeck(deckTitle)
        .then((deck) => {
          console.log("deck fetched: ", deck)
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
        <View style={[styles.container, {flex: 0.5}]}>
          <Text style={styles.title}>{this.state.deckTitle}</Text>
          <Text style={{margin:20, fontSize: 24}}>{this.state.questions.length} Questions</Text>
        </View>
        <View style={[styles.container, {flex: 0.5}]}>
          <TouchableOpacity onPress={this.routeToQuiz} style={styles.button}>
            <Text style={styles.buttonText}>Start Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.routeToNewQuestion} style={styles.button}>
            <Text style={styles.buttonText}>New Question</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    color: colorActive,
    fontSize: 48,
    margin:20
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

export default IndividualDeck;