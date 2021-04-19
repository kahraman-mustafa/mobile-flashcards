import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import TextButton from "./TextButton";

class NewQuestion extends Component {

  state = {
    deckTitle: "",
  }

  componentDidMount(){
    if(this.props.route.params){
      const { deckTitle } = this.props.route.params;
      this.setState(() => ({deckTitle}));
    } else {
      // Do nothing
    }
  }

  routeToIndividualDeck = () => {
    this.props.navigation.navigate("IndividualDeck", {deckTitle: this.state.deckTitle});
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{textAlign: "center"}}>New Question to {this.state.deckTitle}</Text>
        <TextButton onPress={this.routeToIndividualDeck} style={{margin:20}}>
            To Individual Deck
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

export default NewQuestion;