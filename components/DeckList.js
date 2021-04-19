import React, { Component } from "react";
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Animated, TouchableWithoutFeedbackComponent } from "react-native";
import {getDecks, setDummyDeckData, clearDatabase} from "../data/api";
import {gray, colorPrimary, colorActive, colorText, colorActiveText, black, white, red, lightPurp} from "../assets/colors"
import AppLoading from 'expo-app-loading';
import TextButton from "./TextButton";

function Item({ item, onPress, fadeAnim, backgroundColor, textColor }) {
  return (
    
    <TouchableOpacity onPress={onPress}>
      <Animated.View style={[styles.item, {opacity: fadeAnim}]}>
        <Text style={[styles.title]}>{item.title}</Text>
        <Text style={styles.text}>{item.questions.length} cards</Text>
      </Animated.View>
    </TouchableOpacity>
  )
}

class DeckList extends Component {

  state = {
    ready: false,
    selectedTitle: "",
    deckList: [],
    fadeAnim: new Animated.Value(1)
  }

  updateState = () => {
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

  componentDidMount(){
    this.updateState();

    this._unsubscribeFocus = this.props.navigation.addListener('focus', () => {
      // user has navigated to this screen
      console.log("DeckList got Focus");
      this.updateState();
    });

    this._unsubscribeBlur = this.props.navigation.addListener("didBlur", () => {
      // user has navigated away from this screen
      console.log("DeckList lost Focus");
    });
  }

  componentWillUnmount() {
    this._unsubscribeFocus();
    this._unsubscribeBlur();
  }

  fetchDummyData = () => {
    setDummyDeckData().then(() => {
      getDecks().then((dummyDeckData) => {
        const deckList = Object.keys(dummyDeckData).map((title) => ({
          title: title,
          questions: dummyDeckData[title].questions
        }));
        this.setState(() => ({deckList}))
      })
    });
  }

  fadeOut = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(this.state.fadeAnim, {
      toValue: 0.5,
      duration: 100,
      useNativeDriver: true
    }).start();
  };

  fadeIn = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(this.state.fadeAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true
    }).start();
  };

  onSelectDeck = (item) => {
    //console.log("Item selected: ", item.title);
    this.fadeOut(),
    this.fadeIn(),
    this.fadeOut(),
    this.fadeIn()
    this.setState(() => ({selectedTitle: item.title}));
    this.props.navigation.navigate("IndividualDeck", {deckTitle: item.title});
  }

  renderItem = ({ item }) => {
    const {selectedTitle, fadeAnim} = this.state;

    //console.log("Deck: ", item);

    const backgroundColor = item.title === selectedTitle ? white : white;
    const color = item.title === selectedTitle ? black : black;

    return (
      <Item
        item={item}
        onPress={() => this.onSelectDeck(item)}
        fadeAnim={fadeAnim}
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