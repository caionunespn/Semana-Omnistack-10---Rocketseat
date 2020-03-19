import React, {useEffect, useState} from 'react';
import { requestPermissionsAsync, getCurrentPositionAsync} from 'expo-location';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native';
import MapView, {Marker, Callout} from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../services/api';

function Main({navigation}) {

   const [currentRegion, setCurrentRegion] = useState(null);
   const [devs, setDevs] = useState([]);
   const [searchTerm, setSearchTerm] = useState("");

   useEffect(() => {
      async function loadInitialLocation(){
         const {granted} = await requestPermissionsAsync();
         
         if(granted) {
            const {coords} = await getCurrentPositionAsync({
               enableHighAccuracy: true,
            });

            const {latitude, longitude} = coords;

            setCurrentRegion({
               latitude, 
               longitude, 
               latitudeDelta: 0.02, 
               longitudeDelta: 0.02
            })
         }
      }

      loadInitialLocation();
   });

   async function getDevs(){
      const { latitude, longitude } = currentRegion;
      const result = await api.get("/search", {
         params: {
            latitude,
            longitude,
            techs: searchTerm
         }
      });

      setDevs(result.data);
   }

   function handleRegionChanged(region) {
      setCurrentRegion(region);
   }

   if(!currentRegion){
      return null;
   }

   return (
      <>
         <MapView onRegionChangeComplete={handleRegionChanged} initialRegion={currentRegion} style={styles.map}>
            {devs.map(dev => (
               <Marker key={dev._id} coordinate={{latitude: dev.location.coordinates[1], longitude: dev.location.coordinates[0]}}>
               <Image source={{uri: dev.avatarUrl}} style={styles.avatar} />
               <Callout onPress={() => {
                  navigation.navigate("Profile", { githubUsername: dev.githubUsername})
               }}>
                  <View style={styles.callout}>
                     <Text style={styles.devName}>{dev.name}</Text>
                     <Text style={styles.devBio}>{dev.bio}</Text>
                     <Text style={styles.devTechs}>{dev.techs.join(", ")}</Text>
                  </View>
               </Callout>
            </Marker>
            ))}
         </MapView>
         <View style={styles.searchForm}>
            <TextInput 
               value={searchTerm}
               onChangeText={text => setSearchTerm(text)}
               style={styles.searchInput} 
               placeholder="Buscar devs por tecnologias"
               placeholderTextColor="#999"
               autoCapitalize="words"
               autoCorrect={false}
            />
            <TouchableOpacity style={styles.loadButton} onPress={getDevs}>
               <MaterialIcons name="my-location" size={20} color="#FFF"/>
            </TouchableOpacity>
         </View>
      </>
   );
}

const styles = StyleSheet.create({
   map: {
      flex: 1
   },
   avatar: {
      width: 54,
      height: 54,
      borderRadius: 4,
      borderWidth: 4,
      borderColor: "#FFF"
   },
   callout: {
      width: 260
   },
   devName: {
      fontWeight: "bold",
      fontSize: 16,
   }, 
   devBio: {
      color: "#666",
      marginTop: 5,
   },
   devTechs: {
      marginTop: 5
   },
   searchForm: {
      position: "absolute",
      top: 20,
      left: 20,
      right: 20,
      zIndex: 5,
      flexDirection: "row",
   },
   searchInput: {
      flex: 1,
      height: 50,
      backgroundColor: "#FFF",
      color: "#333",
      borderRadius: 25,
      paddingHorizontal: 20,
      fontSize: 16,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowOffset: {
         width: 4, 
         height: 4
      },
      elevation: 2
   }, 
   loadButton: {
      width: 50,
      height: 50,
      backgroundColor: "#8E4DFF",
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 15
   }
});

export default Main;
