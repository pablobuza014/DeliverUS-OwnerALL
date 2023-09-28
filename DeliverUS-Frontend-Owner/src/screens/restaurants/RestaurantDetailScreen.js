/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, ImageBackground, Image, Pressable } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { getDetail } from '../../api/RestaurantEndpoints'
import { remove, highlight, promote } from '../../api/ProductEndpoints'
import ImageCard from '../../components/ImageCard'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import * as GlobalStyles from '../../styles/GlobalStyles'
import DeleteModal from '../../components/DeleteModal'
import ConfirmationModal from '../../components/ConfirmationModal'
import defaultProductImage from '../../../assets/product.jpeg'
import { brandPrimary, brandSuccess } from '../../styles/GlobalStyles'

export default function RestaurantDetailScreen ({ navigation, route }) {
  const [restaurant, setRestaurant] = useState({})
  const [productToBeDeleted, setProductToBeDeleted] = useState(null)
  const [productToBePromoted, setProductToBePromoted] = useState(null)
  const [productToBeHighlighted, setProductToBeHighlighted] = useState(null)

  useEffect(() => {
    fetchRestaurantDetail()
  }, [route])

  const AnimatedText = () => {
    const [color, setColor] = useState('blue')

    useEffect(() => {
      const interval = setInterval(() => {
        setColor((prevColor) => (prevColor === 'black' ? 'blue' : 'black'))
      }, 750) // Change color every x milliseconds

      return () => clearInterval(interval) // Clean up the interval when the component unmounts
    }, [])

    return <TextRegular style={[styles.text, { color, fontSize: 20, fontWeight: 'bold', marginTop: 10, marginBottom: 10 }]}>
      {restaurant.messageToFans}</TextRegular>
  }

  const renderHeader = () => {
    return (
      <View>
        <ImageBackground
          source={
            restaurant?.heroImage
              ? { uri: process.env.API_BASE_URL + '/' + restaurant.heroImage, cache: 'force-cache' }
              : undefined
          }
          style={styles.imageBackground}
        >
          <View style={styles.restaurantHeaderContainer}>
            <Image
              style={styles.image}
              source={restaurant.logo ? { uri: process.env.API_BASE_URL + '/' + restaurant.logo, cache: 'force-cache' } : undefined}
            />
            <TextRegular textStyle={styles.description}>{restaurant.description}</TextRegular>
            <TextRegular textStyle={styles.description}>
              {restaurant.restaurantCategory ? restaurant.restaurantCategory.name : ''}
            </TextRegular>
          </View>
        </ImageBackground>

        { /* LLamada al texto animado (Animación) */}
            <AnimatedText>
            </AnimatedText>

        <Pressable
          onPress={() => navigation.navigate('CreateProductScreen', { id: restaurant.id })
          }
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? GlobalStyles.brandGreenTap
                : GlobalStyles.brandGreen
            },
            styles.button
          ]}>
          <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
            <MaterialCommunityIcons name='plus-circle' color={'white'} size={20} />
            <TextRegular textStyle={styles.text}>
              Create product
            </TextRegular>
          </View>
        </Pressable>
      </View>
    )
  }

  const renderProduct = ({ item }) => {
    const Fats = item.Fats
    const Proteins = item.Proteins
    const Carbohydrates = item.Carbohydrates
    const Calories = 9 * Fats + 4 * Proteins + 4 * Carbohydrates
    return (
      <ImageCard styles
        imageUri={item.image ? { uri: process.env.API_BASE_URL + '/' + item.image } : defaultProductImage}
        title={(item.name)}
      >
        <TextRegular>{item.description}</TextRegular>
        <TextSemiBold textStyle={styles.price}>{item.price.toFixed(2)}€</TextSemiBold>

        {<TextSemiBold style={{ marginTop: 10, fontWeight: 'bold' }}>Nutritional composition:</TextSemiBold>}
        <View style={{ flexDirection: 'column', alignSelf: 'left', paddingLeft: 10 }}>
          {<View style={{ flexDirection: 'row' }}><TextSemiBold>Fats: </TextSemiBold><TextRegular>{item.Fats.toFixed(2)}</TextRegular></View>}
          {<View style={{ flexDirection: 'row' }}><TextSemiBold>Proteins: </TextSemiBold><TextRegular>{item.Proteins.toFixed(2)}</TextRegular></View>}
          {<View style={{ flexDirection: 'row' }}><TextSemiBold>Carbohydrates: </TextSemiBold><TextRegular>{item.Carbohydrates.toFixed(2)}</TextRegular></View>}
          {<View style={{ flexDirection: 'row' }}><TextSemiBold>Calories: </TextSemiBold><TextRegular>{Calories.toFixed(2)}</TextRegular></View>}
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }} >
          <TextRegular> </TextRegular>
            {item.promoted &&
              <TextRegular style={[styles.badge, { width: 100, color: brandSuccess, borderColor: brandSuccess }]}>Promoted!</TextRegular>
            }
            {!item.promoted &&
              <TextRegular style={[styles.badge, { width: 100, color: brandPrimary, borderColor: brandPrimary }]}>Not promoted</TextRegular>
            }
        </View>
        <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }} >
          <TextRegular> </TextRegular>
            {item.highlight &&
              <TextRegular style={[styles.badge, { width: 100, color: '#907F00', borderColor: '#907F00' }]}>Favorite ON!</TextRegular>
            }
            {!item.highlight &&
              <TextRegular style={[styles.badge, { width: 100, color: '#000000', borderColor: '#000000' }]}>Not favorite</TextRegular>
            }
        </View>

        { /* FAVORITE ITEMS */ }
        <View style={{ marginTop: 10, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }} >
          <Pressable
            onPress={() => { setProductToBeHighlighted(item) }}
              style={() => [
                {
                  backgroundColor: item.highlight ? GlobalStyles.yellow : GlobalStyles.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 4,
                  borderWidth: item.highlight ? 4 : 0, // tamaño de relleno. Se rellena sólo si el producto está destacado.
                  height: 30,
                  width: 30
                }
              ]}>
              <MaterialCommunityIcons name='star' color={'black'} size={20}
              />
          </Pressable>
          {!item.availability &&
        <TextSemiBold style={{ fontStyle: 'italic', fontWeight: 'bold', marginTop: 4, color: GlobalStyles.red, alignItems: 'center', justifyContent: 'space-between' }}>Not available</TextSemiBold>
        }
        </View>

         <View style={styles.actionButtonsContainer}>
        <Pressable
          onPress={() => navigation.navigate('EditProductScreen', { id: item.id })
          }
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? GlobalStyles.brandBlueTap
                : GlobalStyles.brandBlue
            },
            styles.actionButton
          ]}>

          <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
            <MaterialCommunityIcons name='pencil' color={'white'} size={20}/>
            <TextRegular textStyle={styles.text}>
              Edit
            </TextRegular>
          </View>
        </Pressable>

        <Pressable
          onPress={() => { setProductToBeDeleted(item) }}
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? GlobalStyles.brandPrimaryTap
                : GlobalStyles.brandPrimary
            },
            styles.actionButton
          ]}>
          <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
            <MaterialCommunityIcons name='delete' color={'white'} size={20}/>
            <TextRegular textStyle={styles.text}>
              Delete
            </TextRegular>
          </View>
        </Pressable>
        <Pressable
              onPress={() => { setProductToBePromoted(item) }}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? GlobalStyles.brandSuccessTap
                    : GlobalStyles.brandSuccess
                },
                styles.actionButton
              ]}>
            <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
              <MaterialCommunityIcons name='alert-octagram' color={'white'} size={20}/>
              <TextRegular textStyle={styles.text}>
                Promote
              </TextRegular>
            </View>
          </Pressable>
        </View>
      </ImageCard>
    )
  }

  const renderEmptyProductsList = () => {
    return (
      <TextRegular textStyle={styles.emptyList}>
        This restaurant has no products yet.
      </TextRegular>
    )
  }

  const fetchRestaurantDetail = async () => {
    try {
      const fetchedRestaurant = await getDetail(route.params.id)
      setRestaurant(fetchedRestaurant)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving restaurant details (id ${route.params.id}). ${error}`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const removeProduct = async (product) => {
    try {
      await remove(product.id)
      await fetchRestaurantDetail()
      setProductToBeDeleted(null)
      showMessage({
        message: `Product ${product.name} succesfully removed`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    } catch (error) {
      console.log(error)
      setProductToBeDeleted(null)
      showMessage({
        message: `Product ${product.name} could not be removed.`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const promoteProduct = async (product) => {
    try {
      await promote(product.id)
      await fetchRestaurantDetail()
      setProductToBePromoted(null)
      showMessage({
        message: `Product ${product.name} succesfully promoted`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    } catch (error) {
      console.log(error)
      setProductToBePromoted(null)
      showMessage({
        message: `Product ${product.name} could not be promoted.`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const highlightProduct = async (product) => {
    try {
      await highlight(product.id)
      await fetchRestaurantDetail()
      setProductToBeHighlighted(null)
      showMessage({
        message: `Product ${product.name} succesfully highlighted`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    } catch (error) {
      console.log(error)
      setProductToBeHighlighted(null)
      showMessage({
        message: `Product ${product.name} could not be highlighted.`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyProductsList}
        style={styles.container}
        data={restaurant.products}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
      />
      <DeleteModal
        isVisible={productToBeDeleted !== null}
        onCancel={() => setProductToBeDeleted(null)}
        onConfirm={() => removeProduct(productToBeDeleted)}
      >
        <TextRegular>If the product belongs to an order, it cannot be deleted.</TextRegular>
      </DeleteModal>
      <ConfirmationModal
        isVisible={productToBePromoted !== null}
        onCancel={() => setProductToBePromoted(null)}
        onConfirm={() => promoteProduct(productToBePromoted)}
        >
          <TextRegular>The product will be promoted, unpromoting the previously promoted product.</TextRegular>
      </ConfirmationModal>
      <ConfirmationModal
        isVisible={productToBeHighlighted !== null}
        onCancel={() => setProductToBeHighlighted(null)}
        onConfirm={() => highlightProduct(productToBeHighlighted)}
        >
          <TextRegular>The product will be highlighted. Remember, a maximum of 5 products can be highlighted.</TextRegular>
      </ConfirmationModal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    padding: 15,
    marginBottom: 5,
    backgroundColor: GlobalStyles.brandSecondary
  },
  restaurantHeaderContainer: {
    height: 250,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'column',
    alignItems: 'center'
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center'
  },
  image: {
    height: 100,
    width: 100,
    margin: 10
  },
  description: {
    color: 'white'
  },
  textTitle: {
    fontSize: 25,
    color: 'white'
  },
  emptyList: {
    textAlign: 'center',
    padding: 50
  },
  button: {
    borderRadius: 8,
    height: 40,
    marginTop: 12,
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    width: '80%'
  },
  text: {
    fontSize: 16,
    color: 'white',
    alignSelf: 'center',
    marginLeft: 5
  },
  availability: {
    textAlign: 'right',
    marginRight: 5,
    color: GlobalStyles.brandSecondary
  },
  actionButton: {
    borderRadius: 8,
    height: 40,
    marginTop: 0,
    margin: '1%',
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'column',
    width: '40%'
  },
  actionButtonsContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    bottom: 25,
    position: 'relative',
    width: '60%',
    justifyContent: 'space-between'
  },
  badge: {
    textAlign: 'center',
    borderWidth: 2,
    width: 45,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 10
  },
  priceDiscounted: {
    marginLeft: 10,
    color: GlobalStyles.brandPrimary
  }
})
