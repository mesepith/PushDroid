import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, StatusBar, Alert, Button, Linking } from 'react-native';
import messaging from '@react-native-firebase/messaging';

const App = () => {
  useEffect(() => {

    requestUserPermission();
    checkNotificationPermission();
    // Initialize notifications
    initNotifications();

   // Foreground message handler
   const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
    Alert.alert('A new notification arrived!', JSON.stringify(remoteMessage.notification));
  });

  // Define background and quit state handler
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Received in background:', remoteMessage);
  });

    return () => {
      unsubscribeOnMessage();
    };
  }, []);

   // Requesting notification permission
   const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };
  async function checkNotificationPermission() {
    const hasPermission = await messaging().hasPermission();
    if (hasPermission !== messaging.AuthorizationStatus.AUTHORIZED) {
      Alert.alert(
        "Enable Notifications",
        "Notifications are disabled. Would you like to enable them in settings?",
        [
          { text: "No", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() }
        ]
      );
    }
  }

   // Initialize notifications
   const initNotifications = async () => {
    // Getting the FCM token
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('Your Firebase Token is:', fcmToken);
    } else {
      console.log('Failed to get the token');
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <Text style={styles.welcome}>Welcome to PushDroid!</Text>
        <Text style={styles.instructions}>Firebase push notifications should be working now.</Text>
        <Button title="Get FCM Token" onPress={() => messaging().getToken().then(token => console.log('Token:', token))} />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default App;
