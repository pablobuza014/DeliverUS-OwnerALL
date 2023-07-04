/* eslint-disable react/prop-types */
import React, { useEffect, useState, useContext } from 'react'
import { StyleSheet, View, ImageBackground, Image, FlatList, Pressable } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { getDetail } from '../../api/RestaurantEndpoints'
import ImageCard from '../../components/ImageCard'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import * as GlobalStyles from '../../styles/GlobalStyles'
import { AuthorizationContext } from '../../context/AuthorizationContext'
import { ScrollView } from 'react-native-web'
import { Formik } from 'formik'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { create } from '../../api/OrderEndpoints'
import * as yup from 'yup'
import TextError from '../../components/TextError'
import InputItem from '../../components/InputItem'

export default function ConfirmOrderScreen ({ navigation, route }) {
  const [backendErrors, setBackendErrors] = useState()

  const [products, setProducts] = useState([])
  const [restaurants, setRestaurant] = useState({})
  const { loggedInUser } = useContext(AuthorizationContext)

  const initialOrderValues = { address: loggedInUser.address, restaurantId: route.params.id, products: [] }
  const validationSchema = yup.object().shape({
    products: yup
      .array(yup.object({ quantity: yup.number().required().min(0).integer() })),
    address: yup
      .string()
      .max(255, 'Address too long')
      .required('Address is required')
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const fetchRestaurantDetail = await getDetail(route.params.id)
      setProducts(fetchRestaurantDetail.products)
      setRestaurant(fetchRestaurantDetail)
      for (let index = 0; index < route.params.quantities.length; ++index) {
        if (route.params.quantities[index] > 0) {
          const product = { productId: fetchRestaurantDetail.products[index].id, quantity: route.params.quantities[index] }
          initialOrderValues.products.push(product)
        }
      }
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving the order (id ${route.params.id}). ${error}`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const renderHeader = () => {
    return (
      <View>
        <ImageBackground source={(restaurants?.heroImage) ? { uri: process.env.API_BASE_URL + '/' + restaurants.heroImage, cache: 'force-cache' } : undefined} style={styles.imageBackground}>
          <View style={styles.restaurantHeaderContainer}>
            <TextSemiBold textStyle={styles.textTitle}>{restaurants.name}</TextSemiBold>
            <Image style={styles.image} source={restaurants.logo ? { uri: process.env.API_BASE_URL + '/' + restaurants.logo, cache: 'force-cache' } : undefined} />
          </View>
        </ImageBackground>

        <TextRegular textStyle={{ paddingLeft: 50, alignSelf: 'center' }}>
          <TextSemiBold textStyle={styles.text}>Please, confirm or dismiss your order right below</TextSemiBold>
        </TextRegular>

        <TextRegular textStyle={{ paddingLeft: 50, alignSelf: 'center' }}>
          Precio total pedido: <TextSemiBold textStyle={styles.money}>{route.params.totalPrice.toFixed(2)} €</TextSemiBold>
        </TextRegular>
      </View>
    )
  }

  const renderProduct = ({ item, index }) => {
    if (route.params.quantities[index] > 0) {
      return (
        <View style={{ flex: 5, padding: 10 }}>
          <ImageCard
            imageUri={item.image ? { uri: process.env.API_BASE_URL + '/' + item.image } : undefined}
            title={item.name}
          >
            <TextRegular numberOfLines={2}>{item.description}</TextRegular>
            <TextSemiBold textStyle={styles.price}>{item.price.toFixed(2)}€</TextSemiBold>
            <View>
              <TextRegular>Cantidad: <TextSemiBold>{route.params.quantities[index]}</TextSemiBold>
                <TextRegular textStyle={{ paddingLeft: 50 }}>
                  Precio total: <TextSemiBold>{route.params.prices[index].toFixed(2)} €</TextSemiBold>
                </TextRegular>
              </TextRegular>
            </View>
          </ImageCard>
        </View>
      )
    }
  }

  const createOrder = async (values) => {
    setBackendErrors([])
    try {
      const createdOrder = await create(values)
      showMessage({
        message: `Order ${createdOrder.id} successfully created. Go to My Orders to check it out!`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        textStyle: GlobalStyles.flashTextStyle
      })
      navigation.navigate('OrdersScreen', { dirty: true })
    } catch (error) {
      console.log(error)
      setBackendErrors(error.errors)
    }
  }

  return (
    <Formik
      initialValues={initialOrderValues}
      validationSchema={validationSchema}
      onSubmit={createOrder}>
      {({ handleSubmit }) => (
        <ScrollView>

          <FlatList
            ListHeaderComponent={renderHeader}
            style={styles.container}
            data={products}
            renderItem={renderProduct}
            keyExtractor={item => item.id.toString()}
          />

          <View style={{ alignItems: 'center' }}>
            <View style={{ width: '60%' }}>
              <InputItem
                name='address'
                label='Address' />

              {backendErrors &&
                backendErrors.map((error, index) => <TextError key={index}>{error.msg}</TextError>)}

              <Pressable
                onPress={() =>
                  handleSubmit()
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
                  <MaterialCommunityIcons name='content-save' color={'white'} size={20} />
                  <TextRegular textStyle={styles.text}>
                    Confirm order
                  </TextRegular>
                </View>
              </Pressable>

              <Pressable
                onPress={() =>
                  navigation.navigate('RestaurantsScreen')
                }
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? GlobalStyles.brandPrimaryTap
                      : GlobalStyles.brandPrimary
                  },
                  styles.button
                ]}>
                <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
                  <MaterialCommunityIcons name='delete' color={'white'} size={20} />
                  <TextRegular textStyle={styles.text}>
                    Discard order
                  </TextRegular>
                </View>
              </Pressable>
            </View>
          </View>

        </ScrollView>
      )}
    </Formik>
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
  text: {
    fontSize: 25,
    color: 'black',
    alignSelf: 'center',
    marginLeft: 5
  },
  money: {
    fontSize: 15,
    color: 'black',
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
    marginTop: 10,
    marginLeft: 5
  },
  textTitle: {
    fontSize: 18,
    color: 'white',
    paddingTop: 20
  }
})
