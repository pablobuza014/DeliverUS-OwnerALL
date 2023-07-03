/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, FlatList, Pressable, View, ActivityIndicator } from 'react-native'

import { getAll, remove, promote, sortingProducts } from '../../api/RestaurantEndpoints'
import ImageCard from '../../components/ImageCard'
import TextSemiBold from '../../components/TextSemibold'
import TextRegular from '../../components/TextRegular'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as GlobalStyles from '../../styles/GlobalStyles'
import { AuthorizationContext } from '../../context/AuthorizationContext'
import { showMessage } from 'react-native-flash-message'
import DeleteModal from '../../components/DeleteModal'
import ConfirmationModal from '../../components/ConfirmationModal'
import { brandPrimary, brandSuccess } from '../../styles/GlobalStyles'
import restaurantLogo from '../../../assets/restaurantLogo.jpeg'

export default function RestaurantsScreen ({ navigation, route }) {
  const [restaurants, setRestaurants] = useState([])
  const [restaurantToBeDeleted, setRestaurantToBeDeleted] = useState(null)
  const { loggedInUser } = useContext(AuthorizationContext) // AuthorizationContext almacena la información sobre el usuario que ha iniciado sesión.
  const [restaurantToBePromoted, setRestaurantToBePromoted] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  /* useEffect(() => {
    if (loggedInUser) {
      fetchRestaurants()
    } else {
      setRestaurants(null)
    }
  }, [loggedInUser, route]) */

  useEffect(() => {
    console.log('Loading restaurants, please wait 5 seconds')
    setTimeout(() => {
      if (loggedInUser) {
        fetchRestaurants()
      } else {
        setRestaurants([])
      }
      setIsLoading(false)
      console.log('Restaurants loaded')
    }, 650)
  }, [loggedInUser, route])

  const handlePress = async (restaurant) => {
    try {
      const sortingRestaurant = await sortingProducts(restaurant.id)
      if (sortingRestaurant) {
        await fetchRestaurants()
        showMessage({
          message: `Restaurant ${restaurant.name} succesfully changed sorting method`,
          type: 'success',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    } catch (error) {
      showMessage({
        message: `Error while changing products order of the restaurant ${restaurant.name}. ${error.message}`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const renderTitleWithDiscount = (item) => {
    return (<>
        <TextSemiBold style = {{ fontSize: 20 }}>{item.name}</TextSemiBold>
        {(item.discountCode && item.discount) &&
          <TextSemiBold style={{ marginLeft: 5, color: GlobalStyles.brandPrimary }}>
            ({item.discount}% of discount using the code {item.discountCode})</TextSemiBold>}
      </>)
  }

  const renderRestaurant = ({ item }) => {
    return (
      <ImageCard
        imageUri={item.logo ? { uri: process.env.API_BASE_URL + '/' + item.logo } : restaurantLogo}
        title={renderTitleWithDiscount(item)} // No puede ponerse item.renderTitleWithDiscount

        onPress={() => {
          navigation.navigate('RestaurantDetailScreen', { id: item.id })
        }}
      >

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }} >
        <TextRegular numberOfLines={2}>{item.description}</TextRegular>
            {item.isEconomic &&
                <TextRegular textStyle={[styles.badge, { color: brandSuccess, borderColor: brandSuccess }] }>€</TextRegular>
            }
            {!item.isEconomic &&
            <TextRegular textStyle={[styles.badge, { color: brandPrimary, borderColor: brandPrimary }] }>€€</TextRegular>
            }
        </View>

        {item.averageServiceMinutes !== null &&
          <TextSemiBold>Avg. service time: <TextSemiBold textStyle={{ color: brandPrimary }}>{item.averageServiceMinutes} min.</TextSemiBold></TextSemiBold>
        }

        <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }} >
            <TextSemiBold>Shipping: <TextSemiBold textStyle={{ color: brandPrimary }}>{item.shippingCosts.toFixed(2)}€</TextSemiBold></TextSemiBold>
            {item.promoted &&
              <TextRegular style={[styles.badge, { width: 100, color: brandSuccess, borderColor: brandSuccess }]}>Promoted!</TextRegular>
            }
            {!item.promoted &&
              <TextRegular style={[styles.badge, { width: 100, color: brandPrimary, borderColor: brandPrimary }]}>Not promoted</TextRegular>
            }
        </View>

        <View style={{ marginTop: 10, flexDirection: 'row', alignSelf: 'flex-end' }} >
          <TextRegular textStyle={{ textAlign: 'right' }}>Currently sorting products<TextSemiBold style = {{ fontSize: 15, fontWeight: 'bold' }}> by {item.sortByPrice ? 'price' : 'default'}</TextSemiBold></TextRegular>
        </View>

        <View style={{ marginTop: 20, ...styles.actionButtonsContainer }}>
        <Pressable
            onPress={() => navigation.navigate('EditRestaurantScreen', { id: item.id })
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
            onPress={() => { setRestaurantToBeDeleted(item) }}
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
              onPress={() => { setRestaurantToBePromoted(item) }}
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
        <Pressable
            onPress={ async () => await handlePress(item) }
            style={() => [
              {
                backgroundColor: item.sortByPrice
                  ? GlobalStyles.brandSuccessDisabled
                  : GlobalStyles.brandSuccess
              },
              styles.actionButton
            ]}>
            <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
              <MaterialCommunityIcons name='sort' color={'white'} size={20} />
              <TextRegular textStyle={styles.text}>
                Sort by: {item.sortByPrice ? 'default' : 'price'}
                </TextRegular>
            </View>
          </Pressable>
        </View>
      </ImageCard>
    )
  }

  const renderEmptyRestaurantsList = () => {
    return (
      <TextRegular textStyle={styles.emptyList}>
        No restaurants were retreived. Are you logged in?
      </TextRegular>
    )
  }

  const renderHeader = () => {
    return (
      <>
      {loggedInUser &&
      <Pressable
        onPress={() => navigation.navigate('CreateRestaurantScreen')
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
          <MaterialCommunityIcons name='plus-circle' color={'white'} size={20}/>
          <TextRegular textStyle={styles.text}>
            Create restaurant
          </TextRegular>
        </View>
      </Pressable>
    }
    </>
    )
  }

  const fetchRestaurants = async () => {
    try {
      const fetchedRestaurants = await getAll()
      setRestaurants(fetchedRestaurants)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving restaurants. ${error} `,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const removeRestaurant = async (restaurant) => {
    try {
      await remove(restaurant.id)
      await fetchRestaurants()
      setRestaurantToBeDeleted(null)
      showMessage({
        message: `Restaurant ${restaurant.name} succesfully removed`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    } catch (error) {
      console.log(error)
      setRestaurantToBeDeleted(null)
      showMessage({
        message: `Restaurant ${restaurant.name} could not be removed.`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const promoteRestaurant = async (restaurant) => {
    try {
      await promote(restaurant.id)
      await fetchRestaurants()
      setRestaurantToBePromoted(null)
      showMessage({
        message: `Restaurant ${restaurant.name} succesfully promoted`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    } catch (error) {
      console.log(error)
      setRestaurantToBePromoted(null)
      showMessage({
        message: `Restaurant ${restaurant.name} could not be promoted.`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  return (
    <>
      {isLoading
        ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color = {GlobalStyles.blue} />
          <TextRegular style = {{ color: GlobalStyles.blue, fontSize: 15 }}>Loading restaurants, please wait...</TextRegular>
        </View>
          )
        : (
        <>
          <FlatList
            style={styles.container}
            data={restaurants}
            renderItem={renderRestaurant}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={renderEmptyRestaurantsList}
          />
          <DeleteModal
            isVisible={restaurantToBeDeleted !== null}
            onCancel={() => setRestaurantToBeDeleted(null)}
            onConfirm={() => removeRestaurant(restaurantToBeDeleted)}
          >
            <TextRegular>The products of this restaurant will be deleted as well</TextRegular>
            <TextRegular>If the restaurant has orders, it cannot be deleted.</TextRegular>
          </DeleteModal>
          <ConfirmationModal
            isVisible={restaurantToBePromoted !== null}
            onCancel={() => setRestaurantToBePromoted(null)}
            onConfirm={() => promoteRestaurant(restaurantToBePromoted)}
          >
            <TextRegular>Other promoted restaurant, if any, will be unpromoted</TextRegular>
          </ConfirmationModal>
        </>
          )}
    </>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    paddingVertical: 20
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
  actionButton: {
    borderRadius: 8,
    height: 40,
    marginTop: 20,
    margin: '1%',
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'column',
    width: '50%'
  },
  actionButtonsContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    bottom: 25,
    position: 'relative',
    width: '45%',
    justifyContent: 'space-between'
  },
  text: {
    fontSize: 16,
    color: 'white',
    alignSelf: 'center',
    marginLeft: 5
  },
  emptyList: {
    textAlign: 'center',
    padding: 50
  },
  badge: {
    textAlign: 'center',
    borderWidth: 2,
    width: 45,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 10
  }
})
