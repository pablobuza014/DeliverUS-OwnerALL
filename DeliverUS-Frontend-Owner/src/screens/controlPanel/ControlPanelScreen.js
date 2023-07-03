import React from 'react'
import { StyleSheet, View } from 'react-native'
import TextRegular from '../../components/TextRegular'

export default function ControlPanelScreen () {
  return (
        <View style={styles.container}>
            <TextRegular>Control Panel</TextRegular>
        </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
