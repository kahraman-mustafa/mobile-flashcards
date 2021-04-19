import React, { Component } from "react";
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {getDecks, getDummyDeckData} from "../data/api";
import {gray, colorPrimary, colorActive, colorText, colorActiveText, black, white, red, lightPurp} from "../assets/colors"
import AppLoading from 'expo-app-loading';
import TextButton from "./TextButton";

function Item({ item, onPress, backgroundColor, textColor }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.item]}>
      <Text style={[styles.title]}>{item.title}</Text>
      <Text style={styles.text}>{item.questions.length} cards</Text>
    </TouchableOpacity>
  )
}

class DeckList extends Component {

  state = {
    ready: false,
    selectedTitle: "",
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
      .then(() => this.setState({
        ready: true
      }))
  }

  fetchDummyData = () => {
    const dummyDeckData = getDummyDeckData();
    const deckList = Object.keys(dummyDeckData).map((title) => ({
      title: title,
      questions: dummyDeckData[title].questions
    }));
    this.setState(() => ({deckList}))
  }

  onSelectDeck = (item) => {
    console.log("Item selected: ", item.title);
    this.setState(() => ({selectedTitle: item.title}));
    this.props.navigation.navigate("IndividualDeck", {deckTitle: item.title});
  }

  renderItem = ({ item }) => {
    const {selectedTitle} = this.state;

    //console.log("Deck: ", item);

    const backgroundColor = item.title === selectedTitle ? white : white;
    const color = item.title === selectedTitle ? black : black;

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
    const {ready, selectedTitle, deckList} = this.state;

    //console.log("Deck list: ", deckList);

    if (ready === false){
      return <AppLoading />
    }

    if(deckList.length === 0){
      return (
        <View style={styles.center}>
          <Text style={{textAlign: "center"}}>There is no deck yet</Text>
          <TextButton onPress={this.fetchDummyData} style={{margin:20}}>
            Fetch Dummy Data
          </TextButton>
        </View>
      )
    }

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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  item: {
    padding: 20,
    marginVertical: 12,
    marginHorizontal: 24,
    borderRadius: 8,
    borderColor: black,
    backgroundColor: colorPrimary,
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

export default DeckList;