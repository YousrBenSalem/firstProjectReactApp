import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  Image,
} from "react-native";
import { Button, Dialog } from "react-native-paper";
import firebase from "../Config";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ListProfils = ({ props, route }) => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const refProfiles = firebase.database().ref("profil");
  const [profiles, setProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);
  const [currentitem, setCurrentItem] = useState({
    name: "",
    surname: "",
    numero: "",
  });

  useEffect(() => {
    const fetchData = () => {
      refProfiles.on("value", (snapshot) => {
        let d = [];
        snapshot.forEach((un_profil) => {
          d.push({ ...un_profil.val(), id: un_profil.key });
        });
        setData(d);

        // onDataChange logic here
        const profilesList = [];
        snapshot.forEach((childSnapshot) => {
          const key = childSnapshot.key;
          const data = childSnapshot.val();
          profilesList.push({ key, ...data });
        });
        setProfiles(profilesList);
      });
    };
    fetchData();

    return () => {
      refProfiles.off();
    };
  }, []); // Add an empty dependency array

  const handleCall = (phoneNumber) => {
    // Implement phone call functionality using react-native-call or other libraries
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}
    >
      <TouchableHighlight
        onPress={() => {
          setCurrentItem(item);
          setDialogVisible(true);
        }}
      >
        {/* Display profile details */}
        <Image
          source={{ uri: item.url }}
          style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
        />
      </TouchableHighlight>
      <Text style={{ width: 200 }}>
        {item.name} {item.surname}
      </Text>

      {/* Call icon */}
      <TouchableOpacity onPress={() => handleCall(item.numero)}>
        <Icon name="call" size={30} color="#00F" style={{ marginLeft: 10 }} />
      </TouchableOpacity>

      {/* Chat icon */}
      <TouchableOpacity
        onPress={() => {
          console.log("Item to be sent to Chat screen:", item);
          navigation.navigate("chat", { profile: item });
        }}
      >
        <Icon name="chat" size={30} color="#0F0" style={{ marginLeft: 10 }} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
  const filteredData = data.filter((item) => {
    const fullName = `${item.name} ${item.surname}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>List of Profiles</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.input}
        placeholder="Search by Name"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <Dialog visible={dialogVisible} onDismiss={hideDialog}>
        <Dialog.Title>Details</Dialog.Title>
        <Dialog.Content>
          <Text>{currentitem.name}</Text>
          <Text>{currentitem.surname}</Text>
          <Text>{currentitem.tel}</Text>

          <Image
            resizeMode="center"
            style={{ width: 80, height: 80 }}
            source={{ uri: currentitem.url }}
          ></Image>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>Call</Button>
          <Button onPress={hideDialog}>Cancel</Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
});

export default ListProfils;
