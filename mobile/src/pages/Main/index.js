import React, { useState, useEffect } from 'react';
import { Image, View, Text, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import {
  requestPermissionsAsync,
  getCurrentPositionAsync,
} from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';

import api from '../../services/api';

import styles from './styles';

export default function Main({ navigation }) {
  const [devs, setDevs] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [techs, setTechs] = useState('');

  useEffect(() => {
    async function loadInitialPosition() {
      const { granted } = await requestPermissionsAsync();

      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true,
        });

        const { latitude, longitude } = coords;

        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        });
      }
    }

    loadInitialPosition();
  }, []);

  async function loadDevs() {
    const { latitude, longitude } = currentRegion;

    const { data } = await api.get('/search', {
      params: {
        latitude,
        longitude,
        techs,
      },
    });

    setDevs(data);
  }

  function handleRegionChanged(region) {
    setCurrentRegion(region);
  }

  if (!currentRegion) {
    return <View />;
  }

  return (
    <>
      <MapView
        style={styles.map}
        initialRegion={currentRegion}
        onRegionChangeComplete={handleRegionChanged}
      >
        {devs.map(dev => (
          <Marker
            key={dev._id}
            coordinate={{
              longitude: dev.location.coordinates[0],
              latitude: dev.location.coordinates[1],
            }}
          >
            <Image
              style={styles.avatar}
              source={{
                uri: dev.avatar_url,
              }}
            />
            <Callout
              onPress={() =>
                navigation.navigate('Profile', {
                  github_username: dev.github_username,
                })
              }
            >
              <View style={styles.callout}>
                <Text style={styles.devName}>{dev.name}</Text>
                <Text style={styles.devBio}>{dev.bio}</Text>
                <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <View style={styles.searchForm}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar devs por techs"
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
          value={techs}
          onChangeText={setTechs}
        />
        <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
          <Text>
            <MaterialIcons name="my-location" size={20} color="#fff" />
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

Main.propTypes = {
  navigation: PropTypes.shape().isRequired,
};
