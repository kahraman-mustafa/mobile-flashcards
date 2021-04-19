import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Permissions from 'expo-permissions'
import * as Notifications from 'expo-notifications'

const NOTIFICATION_KEY = 'MobileFlascards:quizNotification'

function createNotification () {
  return {
    title: 'Take a quick quiz!',
    body: "👋 Don't forhet to review your decks today!",
    ios: {
      sound: true,
    },
    android: {
      sound: true,
      priority: 'high',
      sticky: false,
      vibrate: true,
    }
  }
}

export function clearLocalNotification () {
  return AsyncStorage.removeItem(NOTIFICATION_KEY)
    .then(Notifications.cancelAllScheduledNotificationsAsync)
}
  
export function setLocalNotification () {
  AsyncStorage.getItem(NOTIFICATION_KEY)
    .then(JSON.parse)
    .then((data) => {
      if (data === null) {
        Permissions.askAsync(Permissions.NOTIFICATIONS)
          .then(({ status }) => {
            if (status === 'granted') {
              Notifications.cancelAllScheduledNotificationsAsync();
              const today = new Date();
              let tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1, 20, 0, 0);
              console.log("Notification time: ", tomorrow);
              Notifications.scheduleLocalNotificationAsync(
                createNotification(),
                {
                  time: tomorrow,
                  repeat: 'day',
                }
              );

              AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(true));
            }
          })
      }
    })
}

export function timeToString (time) {
  const date = new Date(time)
  const todayUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()))
  return todayUTC.toISOString().split('T')[0]
}