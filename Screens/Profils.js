import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Button,
  ImageBackground,
  TouchableHighlight,
} from "react-native";
import firebase from "../Config";
import * as ImagePicker from "expo-image-picker";

const Profils = (props) => {
  var currentid = props.route.params.currentid;
  // Placeholder data, replace with actual data from your user
  const user = {
    image: require("../assets/profile_image.jpg"),
  };

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [tel, setTel] = useState("");
  const [urlImage, seturlImage] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      seturlImage(result.assets[0].uri);
    }
  };
  const imageToBlob = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob"; //bufferArray
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    return blob;
  };
  const uploadImageLocalToFirebaseStorage = async (uriLocal) => {
    // Convert image to blob
    const blob = await imageToBlob(uriLocal);

    // Upload blob to firebase storage
    const storage = firebase.storage();
    const ref_mesimages = storage.ref("Mesimages");
    const ref_image = ref_mesimages.child("image" + currentid + ".jpg");
    ref_image.put(blob);

    // récuperer l'url
    const url = ref_image.getDownloadURL();
    return url;
  };

  const database = firebase.database();
  useEffect(() => {
    const refProfiles = database.ref("profil");

    const onDataChange = (snapshot) => {
      const profilesList = [];
      snapshot.forEach((childSnapshot) => {
        const key = childSnapshot.key;
        const data = childSnapshot.val();
        profilesList.push({ key, ...data });
      });
      setProfiles(profilesList);
    };
    refProfiles.on("value", onDataChange);
    return () => {
      refProfiles.off("value", onDataChange);
    };
  }, [database]);

  const handleValidation = async () => {
    try {
      if (!urlImage) {
        console.error("Image not selected");
        return;
      }

      const refProfiles = database.ref("profil" + currentid);
      const key = refProfiles.push().key;
      const url = await uploadImageLocalToFirebaseStorage(urlImage);
      refProfiles.child(key).set({
        url: url,
        name: name,
        surname: surname,
        numero: tel,
        id: currentid,
      });

      setName("");
      setSurname("");
      setTel("");
      seturlImage("");
    } catch (error) {
      console.error("Error during validation:", error);
      // Handle the error as needed
    }
  };

  const handleDelete = (key) => {
    const refProfile = database.ref(`profil/${key}`);
    refProfile.remove();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile</Text>
      <TouchableHighlight onPress={pickImage}>
        <Image
          source={urlImage ? { uri: urlImage } : user.image}
          style={styles.profileImage}
        />
      </TouchableHighlight>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Surname"
        value={surname}
        onChangeText={(text) => setSurname(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={tel}
        onChangeText={(text) => setTel(text)}
      />

      <Button onPress={handleValidation} title="Save" />

      {/* Pass profile data and functions to ListProfile component */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 50,
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
});

export default Profils;
