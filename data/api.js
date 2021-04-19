import AsyncStorage from "@react-native-async-storage/async-storage"

const DECKS_STORAGE_KEY = "MobileFlascards:decks";

const dummyDeckData = {
  "Deck1": {
    title: "Deck1",
    questions: [
      {
        question: "question1",
        answer: "answer1",
      },
      {
        question: "question2",
        answer: "answer2",
      }
    ]
  },
  "Deck2": {
    title: "Deck2",
    questions: [
      {
        question: "question3",
        answer: "answer3",
      }
    ]
  },
  "Deck3": {
    title: "Deck3",
    questions: [
      {
        question: "question3",
        answer: "answer3",
      }
    ]
  },
  "Deck4": {
    title: "Deck4",
    questions: [
      {
        question: "question3",
        answer: "answer3",
      }
    ]
  },
  "Deck5": {
    title: "Deck5",
    questions: [
      {
        question: "question3",
        answer: "answer3",
      }
    ]
  },
  "Deck6": {
    title: "Deck6",
    questions: [
      {
        question: "question3",
        answer: "answer3",
      }
    ]
  },
  "Deck7": {
    title: "Deck7",
    questions: [
      {
        question: "question3",
        answer: "answer3",
      }
    ]
  },
};

export function setDummyDeckData(){
  return AsyncStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(dummyDeckData));
}

export function getDeck(title){
  return AsyncStorage.getItem(DECKS_STORAGE_KEY)
    .then((results) => {
      const data = JSON.parse(results);
      //console.log("In api.js, returning deck: ", data);
      return data[title];
    })
}

export function clearDatabase(){
  return AsyncStorage.clear();
}

export function getDecks(){
  return AsyncStorage.getItem(DECKS_STORAGE_KEY)
    .then((results) => {
      // if there are no saved deck data yet, returns empty array
      if(results){
        //console.log("In api.js, returning results: ", JSON.parse(results));
        return JSON.parse(results);
      } else {
        //console.log("In api.js, returning empty: ", []);
        return [];
      }
    })
}

export function getDeckTitles(){
  return AsyncStorage.getItem(DECKS_STORAGE_KEY)
    .then((results) => {
      // if there are no saved deck data yet, returns the dummy data
      if(results){
        const decks = JSON.parse(results);
        return Object.keys(decks);
      } else {
        return [];
      }
    })
}

export function saveDeckTitle(title){
  return AsyncStorage.mergeItem(DECKS_STORAGE_KEY, JSON.stringify({
    // create an empty deck object with id and title of title
    [title]: {
      title: title,
      questions: [],
    }
  }))
}

export function addCardToDeck(title, cardObject){
  return AsyncStorage.getItem(DECKS_STORAGE_KEY)
      .then((results) =>{
          const data = JSON.parse(results);
          // Add new cards to related deck in the deck list
          data[title].questions.push(cardObject);
          // Save new state of deck list to database
          AsyncStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(data));
      })
}