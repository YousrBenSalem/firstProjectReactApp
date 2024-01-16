import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  getDatabase,
  ref,
  push,
  onValue,
  serverTimestamp,
} from "firebase/database";
import firebaseApp from "../Config";

const database = getDatabase(firebaseApp);

const Chat = ({ route, navigation }) => {
  const { profile } = route.params;
  console.log("Received profile in Chat screen:", profile);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const currentUser = firebaseApp.auth().currentUser;
  const chatRef = ref(
    database,
    "messages/" + currentUser.uid + "_" + profile.id
  );

  useEffect(() => {
    const unsubscribe = onValue(chatRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const messagesArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setMessages(messagesArray);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      push(chatRef, {
        senderId: currentUser.uid,
        receiverId: profile.id,
        content: newMessage,
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={
        item.senderId === currentUser.uid
          ? styles.sentMessageRow
          : styles.receivedMessageRow
      }
    >
      <Text style={styles.messageContent}>{item.content}</Text>
    </View>
  );

  return (
    <ImageBackground
      source={require("..//assets/background.jpg")}
      style={{ flex: 1 }}
    >
      <StatusBar style="auto" />
      <Text style={styles.title}>Discussion</Text>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <View style={styles.container}>
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder=" your message..."
              value={newMessage}
              onChangeText={(text) => setNewMessage(text)}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      <StatusBar style="auto" />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "flex-end",
  },
  sentMessageRow: {
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#F5EEF8",
    alignSelf: "flex-end",
    maxWidth: "70%",
  },
  receivedMessageRow: {
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#E6E6E6",
    alignSelf: "flex-start",
    maxWidth: "70%",
  },
  messageContent: {
    fontSize: 16,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D7DBDD",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    fontSize: 16,
    backgroundColor: "white",
  },
  sendButton: {
    backgroundColor: "#997A8D",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  sendButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  title: {
    fontSize: 30,
    color: "#460F31",
    fontWeight: "bold",
    marginTop: 50,
    marginBottom: 30,
    textAlign: "center",
  },
});

export default Chat;
