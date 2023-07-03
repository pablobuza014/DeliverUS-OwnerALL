import React from 'react'
import { Image, Pressable, StyleSheet, View } from 'react-native'
import TextSemiBold from './TextSemibold'
import * as GlobalStyles from '../styles/GlobalStyles'

// Props: defaultImageUri: {uri: xxx}, imageUri: {uri: xxx}, onPress: () => {}, title: String, badgeText: String, touchable: boolean
// Style props: cardStyle, imageContainerStyle, imageStyle, bodyStyle, titleStyle
export default function ImageCard (props) {
  const renderImageCardBody = (props) => {
    return (
      <View style={styles.card} >
        <View>
          <Image style={styles.image} source={props.imageUri} />
          {/* Solution for windows server <Image style={styles.image} source={props.imageUri?.uri.replace(/\\/g, '/')} /> */}
        </View>
        <View style={styles.cardBody}>
            <TextSemiBold textStyle={styles.cardTitle}>{props.title}</TextSemiBold>
            {props.children}
        </View>
      </View>
    )
  }

  return (
    props.onPress
      ? <Pressable onPress={props.onPress} style={({ pressed }) => [
        {
          backgroundColor: pressed
            ? GlobalStyles.brandPrimaryTap
            : GlobalStyles.brandBackground
        },
        styles.wrapperCustom
      ]}>
          {renderImageCardBody(props)}
        </Pressable>
      : <>
          {renderImageCardBody(props)}
        </>
  )
}

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    marginHorizontal: '1%',
    height: 310,
    padding: 2,
    alignItems: 'flex-start',
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15
  },
  image: {
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    height: 123,
    width: 123
  },
  cardBody: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flex: 4,
    position: 'relative',
    height: 123
  },
  cardTitle: {
    fontSize: 15
  }
})
