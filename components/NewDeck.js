import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import TextButton from "./TextButton";

class NewDeck extends Component {

  routeToIndividualDeck = () => {
    this.props.navigation.navigate("IndividualDeck");
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{textAlign: "center"}}>New Deck</Text>
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

export default NewDeck;