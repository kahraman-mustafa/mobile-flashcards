import React, { Component } from "react";
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity } from "react-native";
import {getDecks} from "../data/api";
import {gray, colorPrimary, colorActive, colorText, colorActiveText} from "../assets/colors"

function Item({ item, onPress, backgroundColor, textColor }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
      <Text style={[styles.title, textColor]}>{item.title}</Text>
      <Text style={styles.text}>{item.questions.length} cards</Text>
    </TouchableOpacity>
  )
}

class FlatListExample extends Component {

  state = {
    selectedTitle: null,
    deckList: []
  }

  componentDidMount(){
    getDecks()
      .then((deckListData) => {
        const deckList = Object.keys(deckListData).map((title) => ({
          title: title,
          questions: deckListData[title].questions
        }));
    
        this.setState(() => ({deckList}))
      })
  }

  onSelectDeck = (item) => {
    console.log("Item selected: ", item.title);
    this.setState(() => ({selectedTitle: item.title}))
  }

  renderItem = ({ item }) => {
    const {selectedTitle} = this.state;

    //console.log("Deck: ", item);

    const backgroundColor = item.title === selectedTitle ? colorActive : colorPrimary;
    const color = item.title === selectedTitle ? colorActiveText : colorText;

    return (
      <Item
        item={item}
        onPress={() => this.onSelectDeck(item)}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
  };

  render() {
    const {selectedTitle, deckList} = this.state;

    //console.log("Deck list: ", deckList);

    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={deckList}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.title}
          extraData={selectedTitle}
        />
      </SafeAreaView>
    );
  }
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 20,
    marginVertical: 12,
    marginHorizontal: 24,
    borderRadius: 8
  },
  title: {
    fontSize: 32,
    textAlign: "center"
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: gray,
    textAlign: "center"
  },
});

export default FlatListExample;