# mobile-flashcards
This is the final version of assessment project for Udacity's React Native course, prepared by Mustafa Kahraman.

This app is created by using Create React Native App. App can be installed by running against `npm install` and can be launched by running against `npm start`.

App is tested on real Android and iOS devices using Expo Go client.

Animations are added both in DeckList view to be displayed when pressing a deck item and in Quiz view to be displayed when flipping card by pressing Display Answer/Question button.
But because TouchableOpacity is also used in DeckList, animation at there is overriden. Animation in the Quiz view when flipping is more observable.

Notification is set to be shown on next day at 20:00 PM. When the user completes a quiz, notification will is cleared and set to next day again.
