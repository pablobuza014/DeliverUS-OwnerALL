import React, { useEffect, useState, useContext } from 'react'
import { StyleSheet, View, FlatList, ImageBackground, Image, Pressable } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { getDetail } from '../../api/RestaurantEndpoints'
import * as OrderEndpoints from '../../api/OrderEndpoints'
import ImageCard from '../../components/ImageCard'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import * as GlobalStyles from '../../styles/GlobalStyles'
import defaultProductImage from '../../../assets/product.jpeg'
import { AuthorizationContext } from '../../context/AuthorizationContext'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { TextInput } from 'react-native-web'

export default function UpdateOrderScreen ({ navigation, route }) {
  const [restaurant, setRestaurant] = useState({})
  const [prices, setPrices] = useState([])
  const [quantities, setQuantities] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [address, setAddress] = useState({})
  const [validateQuantity, setValidateQuantity] = useState(true)
  const [validateQuantity2, setValidateQuantity2] = useState(false)
  const { loggedInUser } = useContext(AuthorizationContext)

  useEffect(() => {
    fetchRestaurantDetail()
  }, [route, loggedInUser])

  useEffect(() => {
    fetchPrices()
  }, [prices])

  useEffect(() => {
    setValidateQuantity(quantities.reduce((total, quantity) => total && quantity >= 0, true))
  }, [quantities])

  useEffect(() => {
    setValidateQuantity2(quantities.reduce((total, quantity) => total || quantity > 0, false))
  }, [quantities])

  const fetchRestaurantDetail = async () => {
    try {
      const fetchedOrderDetail = await OrderEndpoints.getDetail(route.params.id)
      const restaurant = await getDetail(fetchedOrderDetail.restaurantId)
      const quantitiesOrder = []
      const pricesOrder = []
      let presente = false
      for (let i = 0; i < restaurant.products.length; i++) {
        for (const product of fetchedOrderDetail.products) {
          if (product.id === (restaurant.products[i].id)) {
            presente = true
            quantitiesOrder.push(product.OrderProducts.quantity)
            pricesOrder.push(product.OrderProducts.quantity * restaurant.products[i].price)
            break
          }
        }
        if (!presente) {
          quantitiesOrder.push(0)
          pricesOrder.push(0)
        }
        presente = false
      }
      setQuantities(quantitiesOrder)
      setPrices(pricesOrder)
      setRestaurant(restaurant)
      setAddress(fetchedOrderDetail.address)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving restaurant details (id ${route.params.id}). ${error}`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const fetchPrices = async () => {
    const fetchedOrderDetail = await OrderEndpoints.getDetail(route.params.id)
    const restaurant = await getDetail(fetchedOrderDetail.restaurantId)
    let price = prices.reduce((total, price) => total + price, 0)
    if (price < 10) {
      price += restaurant.shippingCosts
    }
    setTotalPrice(price)
  }

  const renderHeader = () => {
    return (
      <View>
        <ImageBackground source={(restaurant?.heroImage) ? { uri: process.env.API_BASE_URL + '/' + restaurant.heroImage, cache: 'force-cache' } : undefined} style={styles.imageBackground}>
          <View style={styles.restaurantHeaderContainer}>
            <TextSemiBold textStyle={styles.textTitle}>{restaurant.name}</TextSemiBold>
            <Image style={styles.image} source={restaurant.logo ? { uri: process.env.API_BASE_URL + '/' + restaurant.logo, cache: 'force-cache' } : undefined} />
          </View>
        </ImageBackground>

        <>
          {loggedInUser &&
            <Pressable
              onPress={() => {
                if (validateQuantity && validateQuantity2) {
                  navigation.navigate('ConfirmUpdateOrderScreen',
                    { quantities, prices, id: route.params.id, totalPrice, address, restaurantId: restaurant.id })
                }
              }}
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
                  UPDATE ORDER
                </TextRegular>
              </View>
            </Pressable>
          }
        </>

        <>
          {!validateQuantity &&
            <TextRegular textStyle={{ paddingLeft: 50, alignSelf: 'center', color: 'red' }}>
              The quantity of each product must be positive
            </TextRegular>
          }
          {!validateQuantity2 && loggedInUser &&
            <TextRegular textStyle={{ paddingLeft: 50, alignSelf: 'center', color: 'red' }}>
              You must pick at least 1 product
            </TextRegular>
          }
          {loggedInUser &&
            <TextRegular textStyle={{ paddingLeft: 50, alignSelf: 'center' }}>
              Precio total pedido: <TextSemiBold textStyle={styles.money}>{totalPrice.toFixed(2)} €</TextSemiBold>
            </TextRegular>
          }
        </>
      </View>
    )
  }

  function updateQuantityPrice ({ index, quantity, item }) {
    // update quantity
    const auxQuantity = [...quantities]
    auxQuantity[index] = quantity
    setQuantities(auxQuantity)
    // update price
    const auxPrice = [...prices]
    auxPrice[index] = item.price * quantity
    setPrices(auxPrice)
  }

  const renderProduct = ({ item, index }) => {
    return (
      <ImageCard
        imageUri={item.image ? { uri: process.env.API_BASE_URL + '/' + item.image } : defaultProductImage}
        title={item.name}
      >
        <TextRegular numberOfLines={2}>{item.description}</TextRegular>
        <TextSemiBold>{item.price.toFixed(2)}€</TextSemiBold>

        {!item.availability &&
          <TextRegular textStyle={styles.availability}>Not available</TextRegular>
        }

        {loggedInUser && item.availability &&
          <View style={{ alignItems: 'flex-start' }}>
            <TextRegular textStyle={{ paddingLeft: 50 }}>
              Precio total: <TextSemiBold>{prices[index].toFixed(2)} €</TextSemiBold>
            </TextRegular>

            <TextInput
              style={styles.input}
              name='quantity'
              keyboardtype='numeric'
              placeholder={quantities[index]}
              onChangeText={quantity => updateQuantityPrice({ quantity, index, item })}
            />

            {quantities[index] < 0 &&
              <TextRegular textStyle={{ paddingLeft: 50, alignSelf: 'center', color: 'red' }}>
                The quantity of this product must be positive
              </TextRegular>
            }
          </View>
        }
      </ImageCard>
    )
  }

  return (
    <FlatList
    ListHeaderComponent={renderHeader}
    style={styles.container}
    data={restaurant.products}
    renderItem={renderProduct}
    keyExtractor={item => item.id.toString()}
    stickyHeaderIndices={[0]}
  />
  )
}

const styles = StyleSheet.create({
  FRHeader: {
    justifyContent: 'center',
    alignItems: 'left',
    margin: 50
  },
  container: {
    flex: 1
  },
  textTitle: {
    fontSize: 18,
    color: 'white',
    paddingTop: 20
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
  emptyList: {
    textAlign: 'center',
    padding: 50
  },
  button: {
    borderRadius: 8,
    height: 40,
    marginTop: 12,
    marginBottom: 12,
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    width: '80%'
  },
  money: {
    fontSize: 15,
    color: 'black',
    alignSelf: 'center',
    marginLeft: 5
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
  input: {
    borderRadius: 8,
    height: 15,
    borderWidth: 1,
    padding: 15,
    marginTop: 10
  }
}
)
