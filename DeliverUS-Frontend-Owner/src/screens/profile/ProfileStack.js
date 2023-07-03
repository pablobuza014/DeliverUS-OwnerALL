import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useContext } from 'react'
import { AuthorizationContext } from '../../context/AuthorizationContext'
import LoginScreen from './LoginScreen'
import ProfileScreen from './ProfileScreen'
import RegisterScreen from './RegisterScreen'

const Stack = createNativeStackNavigator()

export default function ProfileStack () {
  const { loggedInUser } = useContext(AuthorizationContext)

  return (
    <Stack.Navigator>
           {!loggedInUser
             ? (
                <>
                    <Stack.Screen name='LoginScreen' options={{ title: 'Log in to access to your profile' }} component={LoginScreen} />
                    <Stack.Screen name='RegisterScreen' options={{ title: 'Register' }} component={RegisterScreen} />
                </>
               )
             : (
                    <Stack.Screen name='ProfileScreen' options={{ title: 'Profile' }} component={ProfileScreen} />
               )
            }
    </Stack.Navigator>

  )
}
