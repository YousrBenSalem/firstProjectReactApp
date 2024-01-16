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

import firebase from "../Config";
import React, { useState } from "react";

export default function Register({ navigation, props }) {
  const auth = firebase.auth();
  const [pwdConfirmation, setPwdConfirmation] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [username, setUsername] = useState("");

  const navigateToAuth = () => {
    // Navigate to the register page
    navigation.navigate("Auth"); // 'Register' should be replaced with the name of your register screen
  };
  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.container}
    >
      <View
        style={{
          width: "90%",
          height: 500,
          borderRadius: 20,
          backgroundColor: "#0003",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 32,
            color: "purple",
            fontStyle: "italic",
            fontWeight: "bold",
            marginBottom: 15,
          }}
        >
          Register
        </Text>
        <TextInput
          onChangeText={(txt) => {
            setUsername(txt);
          }}
          style={styles.textinput}
          placeholder="Username"
        ></TextInput>
        <TextInput
          keyboardType="email-address"
          onChangeText={(txt) => {
            setEmail(txt);
          }}
          style={styles.textinput}
          placeholder="Email"
        ></TextInput>
        <TextInput
          onChangeText={(txt) => {
            setPwd(txt);
          }}
          secureTextEntry={true}
          style={styles.textinput}
          placeholder="Password"
        ></TextInput>
        <TextInput
          onChangeText={(txt) => {
            setPwdConfirmation(txt);
          }}
          secureTextEntry={true}
          style={styles.textinput}
          placeholder="Confirm Password"
        ></TextInput>
        <View
          style={{
            width: "100%",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <View style={styles.buttons}>
            <Button
              onPress={() => {
                if (pwd === pwdConfirmation) {
                  auth
                    .createUserWithEmailAndPassword(email, pwd)
                    .then(() => {
                      // navigation
                      navigation.replace("Home");
                    })
                    .catch((err) => {
                      alert(err);
                    });
                }
              }}
              style={{ margin: 10 }}
              title="validate"
            ></Button>
            <Button
              onPress={() => {
                //fermer l'application
                BackHandler.exitApp();
              }}
              title="Cancel"
            ></Button>
          </View>
        </View>
        <TouchableOpacity onPress={navigateToAuth}>
          <Text
            style={{
              marginTop: 25,
              marginRight: 25,
              width: "100%",
              color: "purple",
              fontWeight: "bold",
              textAlign: "right",
            }}
          >
            {" "}
            Already have an account!
          </Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textinput: {
    textAlign: "center",
    color: "black",
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 20,
    width: "75%",
    height: 60,
    backgroundColor: "#fff4",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#0005",
    alignItems: "center", // alignement horizontale
    justifyContent: "center",
  },
});
