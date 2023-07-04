import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import OrdersScreen from '../restaurants/OrdersScreen'
import OrderDetailScreen from './OrderDetailScreen'
import UpdateOrderScreen from '../orders/UpdateOrderScreen'
import ConfirmUpdateOrderScreen from '../orders/ConfirmUpdateOrderScreen'

const Stack = createNativeStackNavigator()

export default function OrdersStack () {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='OrdersScreen'
        component={OrdersScreen}
        options={{
          title: 'My Orders'
        }} />
      <Stack.Screen
        name='OrderDetailScreen'
        component={OrderDetailScreen}
        options={{
          title: 'Order Detail'
        }} />
        <Stack.Screen
          name='UpdateOrderScreen'
          component={UpdateOrderScreen}
          option={{
            title: 'Update Order'
          }}/>
        <Stack.Screen
          name='ConfirmUpdateOrderScreen'
          component={ConfirmUpdateOrderScreen}
          option={{
            title: 'Confirm Update Order'
          }}/>
    </Stack.Navigator>
  )
}
