import React from 'react'
import { Platform, View } from 'react-native'
import TextRegular from './TextRegular'

export default function SystemInfo () {
  return (
        <View >
            <TextRegular>Platform: {Platform.OS}.</TextRegular>
            <TextRegular>{Platform.Version ? `Version: ${Platform.Version}` : null}</TextRegular>
            {/* eslint-disable-next-line no-undef */}
            <TextRegular>Mode: {__DEV__ ? 'Development' : 'Production'}</TextRegular>
        </View>
  )
}
