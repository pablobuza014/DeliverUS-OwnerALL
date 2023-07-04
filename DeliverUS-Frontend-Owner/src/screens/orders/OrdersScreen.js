/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, FlatList, View, Pressable } from 'react-native'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import { getAll, remove } from '../../api/OrderEndpoints'
import * as GlobalStyles from '../../styles/GlobalStyles'
import { showMessage } from 'react-native-flash-message'
import { AuthorizationContext } from '../../context/AuthorizationContext'
import ImageCard from '../../components/ImageCard'
import orderLogo from '../../../assets/adaptive-icon.png'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import DeleteModal from '../../components/DeleteModal'

export default function OrdersScreen ({ navigation, route }) {
  const [orders, setOrders] = useState([])
  const { loggedInUser } = useContext(AuthorizationContext)

  const [orderToBeDeleted, setOrderToBeDeleted] = useState(null)

  useEffect(() => {
    if (loggedInUser) {
      fetchOrders()
    } else {
      setOrders(null)
    }
  }, [loggedInUser, route])

  const fetchOrders = async () => {
    try {
      const fetchedOrders = await getAll()
      setOrders(fetchedOrders)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving orders. ${error} `,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const renderOrder = ({ item }) => {
    return (
      <ImageCard
        imageUri={item.restaurant.logo ? { uri: process.env.API_BASE_URL + '/' + item.restaurant.logo } : orderLogo}
        title={'order' + item.id}
        onPress={() => {
          navigation.navigate('OrderDetailScreen', { id: item.id })
        }}
      >
        <TextSemiBold>Price:
          <TextSemiBold textStyle={{ color: GlobalStyles.brandPrimary }}>{item.price}€</TextSemiBold>
        </TextSemiBold>
        <TextSemiBold>ShippingCosts:
          <TextSemiBold textStyle={{ color: GlobalStyles.brandPrimary }}>{item.shippingCosts}€</TextSemiBold>
        </TextSemiBold>
        <TextRegular numberOfLines={1}>Status: {item.status}</TextRegular>
        <TextRegular numberOfLines={1}>Address: {item.address}</TextRegular>
        <TextRegular numberOfLines={1}>Created At: {new Date(item.createdAt).toLocaleString()}</TextRegular>

        <View style={styles.actionButtonsContainer}>
          {item.status === 'pending' &&
            <>
              <Pressable
                onPress={() =>
                  navigation.navigate('UpdateOrderScreen', { id: item.id })
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
                  <MaterialCommunityIcons name='pencil' color={'white'} size={20} />
                  <TextRegular textStyle={styles.text}>
                    EDIT
                  </TextRegular>
                </View>
              </Pressable>

              <Pressable
                onPress={() => { setOrderToBeDeleted(item) }}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? GlobalStyles.brandPrimaryTap
                      : GlobalStyles.brandPrimary
                  },
                  styles.actionButton
                ]}>
                <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
                  <MaterialCommunityIcons name='delete' color={'white'} size={20} />
                  <TextRegular textStyle={styles.text}>
                    DELETE
                  </TextRegular>
                </View>
              </Pressable>
            </>
          }
        </View>
      </ImageCard>
    )
  }

  const renderEmptyOrdersList = () => {
    return (
      <TextRegular textStyle={styles.emptyList}>
        No orders were retreived. Are you logged in?
      </TextRegular>
    )
  }

  const removeOrder = async (order) => {
    try {
      await remove(order.id)
      await fetchOrders()
      setOrderToBeDeleted(null)
      showMessage({
        message: `Order ${order.name} succesfully removed`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    } catch (error) {
      console.log(error)
      setOrderToBeDeleted(null)
      showMessage({
        message: `Order ${order.name} could not be removed.`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  return (
    <>
      <FlatList
        style={styles.container1}
        data={orders}
        renderItem={renderOrder}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={renderEmptyOrdersList}
      />
      <DeleteModal
        isVisible={orderToBeDeleted !== null}
        onCancel={() => setOrderToBeDeleted(null)}
        onConfirm={() => removeOrder(orderToBeDeleted)}>
        <TextRegular>The order will be deleted.</TextRegular>
      </DeleteModal>
    </>
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
  button: {
    borderRadius: 8,
    height: 40,
    margin: 12,
    padding: 10,
    width: '100%'
  },
  text: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center'
  },
  emptyList: {
    textAlign: 'center',
    padding: 50
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    bottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '90%',
    marginLeft: '20%'
  },
  actionButton: {
    borderRadius: 5,
    height: 35,
    marginTop: 1,
    margin: '1%',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    width: '30%'
  }
})
