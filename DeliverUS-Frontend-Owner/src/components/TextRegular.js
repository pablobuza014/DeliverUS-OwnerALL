import React from 'react'
import { StyleSheet, Text } from 'react-native'
export default function TextRegular (props) {
  const { textStyle, ...inputProps } = props

  return (
          <Text style={[styles.text, textStyle]} {...inputProps}>
            {props.children}
          </Text>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    fontFamily: 'Montserrat_400Regular'
  }
})
