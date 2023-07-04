/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, ImageBackground, Image } from 'react-native'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import { getDetail } from '../../api/OrderEndpoints'
import { showMessage } from 'react-native-flash-message'
import * as GlobalStyles from '../../styles/GlobalStyles'
import ImageCard from '../../components/ImageCard'
import defaultProductImage from '../../../assets/product.jpeg'

export default function OrderDetailScreen ({ route }) {
  const [order, setOrder] = useState({})
  const [restaurant, setRestaurant] = useState({})

  useEffect(() => {
    fetchOrderDetail()
  }, [route])

  const fetchOrderDetail = async () => {
    try {
      const fetchedOrder = await getDetail(route.params.id)
      setOrder(fetchedOrder)
      setRestaurant(fetchedOrder.restaurant)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving your orders. ${error}`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        textStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const renderHeader = () => {
    return (
      <ImageBackground source={(restaurant?.heroImage) ? { uri: process.env.API_BASE_URL + '/' + restaurant.heroImage, cache: 'force-cache' } : undefined} style={styles.imageBackground}>
          <View style={styles.restaurantHeaderContainer}>
            <TextSemiBold textStyle={styles.textTitle}>{restaurant.name}</TextSemiBold>
            <Image style={styles.image} source={restaurant.logo ? { uri: process.env.API_BASE_URL + '/' + restaurant.logo, cache: 'force-cache' } : undefined} />
          </View>
        </ImageBackground>
    )
  }

  const renderProduct = ({ item }) => {
    return (
      <ImageCard
        imageUri={item.image ? { uri: process.env.API_BASE_URL + '/' + item.image } : defaultProductImage}
        title={item.name}
      >
        <TextRegular numberOfLines={2}>{item.description}</TextRegular>
        <TextSemiBold>{item.price.toFixed(2)}€</TextSemiBold>
        <View>
              <TextRegular>Cantidad: <TextSemiBold>{item.OrderProducts.quantity}</TextSemiBold>
                <TextRegular textStyle={{ paddingLeft: 50 }}>
                  Precio total: <TextSemiBold>{item.OrderProducts.quantity * item.price} €</TextSemiBold>
                </TextRegular>
              </TextRegular>
            </View>
      </ImageCard>
    )
  }

  return (
    <FlatList
      ListHeaderComponent={renderHeader}
      style={styles.container1}
      data={order.products}
      renderItem={renderProduct}
      keyExtractor={item => item.id.toString()}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 50
  },
  container1: {
    flex: 1
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
  restaurantHeaderContainer: {
    height: 250,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'column',
    alignItems: 'center'
  },
  textTitle: {
    fontSize: 18,
    color: 'white',
    paddingTop: 20
  }
})
