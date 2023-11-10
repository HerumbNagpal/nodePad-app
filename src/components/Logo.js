import React from 'react'
import { Image, StyleSheet } from 'react-native'

export default function Logo() {
  return <Image source={require('../assets/logo.png')} style={styles.image} />
}

const styles = StyleSheet.create({
  image: {
    position : 'absolute',
    top : 40,
    width: 150, 
    height: 150,
    marginBottom: 8,
    // marginTop : 40
  },
})