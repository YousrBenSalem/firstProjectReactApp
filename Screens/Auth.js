import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ImageBackground,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import firebase from "../Config";

export default function Auth({ navigation, props, route }) {
  const auth = firebase.auth();
  const [email, setEmail] = useState("yousrbensalem@gmail.com");
  const [pwd, setPwd] = useState("123456789");

  const navigateToRegister = () => {
    navigation.navigate("Register"); // Replace with your register screen name
  };

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.container}
    >
      <View style={styles.authContainer}>
        <Text style={styles.title}>Authentification</Text>
        <TextInput
          keyboardType="email-address"
          onChangeText={(txt) => setEmail(txt)}
          style={styles.textInput}
          placeholder="Email"
        />
        <TextInput
          onChangeText={(txt) => setPwd(txt)}
          secureTextEntry={true}
          style={styles.textInput}
          placeholder="Password"
        />
        <View style={styles.buttons}>
          <Button
            onPress={() => {
              auth
                .signInWithEmailAndPassword(email, pwd)
                .then(() =>
                  navigation.navigate("Home", {
                    currentid: auth.currentUser.uid,
                  })
                )
                .catch((err) => alert(err));
            }}
            title="Login"
          />
          <Button
            onPress={() => BackHandler.exitApp()}
            title="Cancel"
            color="#FF5252" // Use a different color for cancel button
          />
        </View>
        <TouchableOpacity onPress={navigateToRegister}>
          <Text style={styles.createAccount}>Create a new account</Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  authContainer: {
    width: "90%",
    height: 400,
    borderRadius: 20,
    backgroundColor: "#0003",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    color: "#6200EE",
    fontStyle: "italic",
    fontWeight: "bold",
    marginBottom: 15,
  },
  textInput: {
    textAlign: "center",
    color: "black",
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 20,
    width: "75%",
    height: 60,
    backgroundColor: "#FFF4",
    paddingLeft: 10,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  createAccount: {
    marginTop: 25,
    color: "#6200EE", // Purple color
    fontWeight: "bold",
    textAlign: "center",
  },
});
