import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import CreateProductScreen from './CreateProductScreen'
import CreateRestaurantScreen from './CreateRestaurantScreen'
import EditProductScreen from './EditProductScreen'
import EditRestaurantScreen from './EditRestaurantScreen'
import RestaurantDetailScreen from './RestaurantDetailScreen'
import RestaurantsScreen from './RestaurantsScreen'
import CreateRestaurantCategoryScreen from './CreateRestaurantCategoryScreen'

const Stack = createNativeStackNavigator()

export default function RestaurantsStack () {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='RestaurantsScreen'
        component={RestaurantsScreen}
        options={{
          title: 'My Restaurants'
        }} />
      <Stack.Screen
        name='RestaurantDetailScreen'
        component={RestaurantDetailScreen}
        options={{
          title: 'Restaurant Detail'
        }} />
      <Stack.Screen
        name='CreateRestaurantScreen'
        component={CreateRestaurantScreen}
        options={{
          title: 'Create Restaurant'
        }} />
        <Stack.Screen
        name='CreateProductScreen'
        component={CreateProductScreen}
        options={{
          title: 'Create Product'
        }} />
        <Stack.Screen
        name='EditRestaurantScreen'
        component={EditRestaurantScreen}
        options={{
          title: 'Edit Restaurant'
        }} />
        <Stack.Screen
        name='EditProductScreen'
        component={EditProductScreen}
        options={{
          title: 'Edit Product'
        }} />
        <Stack.Screen
        name='CreateRestaurantCategoryScreen'
        component={CreateRestaurantCategoryScreen}
        options={{
          title: 'Create Restaurant Category'
        }} />
    </Stack.Navigator>
  )
}
