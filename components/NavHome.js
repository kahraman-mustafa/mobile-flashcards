import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform, StatusBar } from 'react-native';
import DeckList from "./DeckList";
import NewDeck from "./NewDeck";
import IndividualDeck from "./IndividualDeck";
import NewQuestion from "./NewQuestion.js";
import Quiz from "./Quiz";
import { colorActive, white } from '../assets/colors';

function CustomStatusBar ({backgroundColor, ...props}){
  return (
    <View style={{backgroundColor, height: Constants.statusBarHeight}}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  )
}

// Config for TabNav
const RouteConfigs = {
  DeckList:{
    name: "DeckList",
    component: DeckList,
    options: {
      tabBarIcon: ({tintColor, focused}) => (
        <Ionicons 
          name={focused ? "ios-list-circle" : "ios-list-circle-outline"} 
          size={30} color={tintColor} />
      ), 
      title: 'DeckList'
    }
  }, 
  NewDeck:{
    component: NewDeck,
    name: "New Deck",
    options: {
      tabBarIcon: ({tintColor, focused}) => (
        <Ionicons 
          name={focused ? "ios-add-circle" : "ios-add-circle-outline"} 
          size={30} color={tintColor} />
      ),
      title: 'New Deck'
    }
  }
}

const TabNavigatorConfig = {
  navigationOptions: {
    header: null
  },
  tabBarOptions: {
    activeTintColor: Platform.OS === "ios" ? colorActive : white,
    style: {
      height: 56,
      backgroundColor: Platform.OS === "ios" ? white : colorActive,
      shadowColor: "rgba(0, 0, 0, 0.24)",
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowRadius: 6,
      shadowOpacity: 1
    }
  }
};

const Tab = Platform.OS === 'ios'
  ? createBottomTabNavigator() 
  : createMaterialTopTabNavigator();

const TabNav = () =>(
  <Tab.Navigator {...TabNavigatorConfig}>
      <Tab.Screen {...RouteConfigs['DeckList']} />
      <Tab.Screen {...RouteConfigs['NewDeck']} />
  </Tab.Navigator>
)

// Config for StackNav
const StackNavigatorConfig = {
  screenOptions: {
    headerMode: "screen"
  }
}

const StackConfig = {
  TabNav:{
    name: "Home",
    component: TabNav,
    options: {
      headerShown: false
    }
  }, 
  IndividualDeck:{
    name: "IndividualDeck",
    component: IndividualDeck,
    options: {
      headerTintColor: white,
      headerStyle:{
        backgroundColor: colorActive
      }
    }
  },
  NewQuestion:{
    name: "NewQuestion",
    component: NewQuestion,
    options: {
      headerTintColor: white,
      headerStyle:{
        backgroundColor: colorActive
      }
    }
  },
  Quiz:{
    name: "Quiz",
    component: Quiz,
    options: {
      headerTintColor: white,
      headerStyle:{
        backgroundColor: colorActive
      }
    }
  }
}

const Stack = createStackNavigator();

const MainNav = () =>(
  <Stack.Navigator {...StackNavigatorConfig}>
    <Stack.Screen {...StackConfig['TabNav']} />
    <Stack.Screen {...StackConfig['IndividualDeck']} />
    <Stack.Screen {...StackConfig['NewQuestion']} />
    <Stack.Screen {...StackConfig['Quiz']} />
  </Stack.Navigator>
)

export default function NavHome() {
  return (
    <View style={{flex:1}}>
      <CustomStatusBar backgroundColor={colorActive} barStyle='light-content'/>
      <NavigationContainer >
          <MainNav />
      </NavigationContainer>
    </View>
  );
}

