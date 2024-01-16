import { StyleSheet, Text, View } from "react-native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import React from "react";
import Groupe from "./Groupe";
import ListProfils from "./ListProfils";
import Profils from "./Profils";
import Chat from "./Chat";

const Tab = createMaterialBottomTabNavigator();

const Home = (props) => {
  const currentid = props.route.params.currentid;
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Groupe"
        component={Groupe}
        initialParams={{ currentid }}
      />
      <Tab.Screen
        name="MyProfile"
        component={Profils}
        initialParams={{ currentid }}
      />
      <Tab.Screen
        name="ListProfils"
        component={ListProfils}
        initialParams={{ currentid }}
      />
    
    </Tab.Navigator>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
});
