// Alternativa que funciona en web menos segura
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import React, { createContext, useState, useContext } from 'react'
import { Platform } from 'react-native'
import { isTokenValid, login, register, update } from '../api/AuthEndpoints'
import { AppContext } from '../context/AppContext'

const AuthorizationContext = createContext()

const AuthorizationContextProvider = props => {
  const { setLoading, setError, processError } = useContext(AppContext)
  const [loggedInUser, setLoggedInUser] = useState(null)

  const signOut = (onSuccess = null, onError = null) => {
    try {
      setLoggedInUser(null)
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        SecureStore.deleteItemAsync('user')
      } else {
        AsyncStorage.removeItem('user')
      }
      if (onSuccess) { onSuccess() }
    } catch (err) {
      if (onError) { onError() }
    }
  }
  const signUp = async (data, onSuccess = null, onError = null) => {
    try {
      const registeredUser = await register(data)
      axios.defaults.headers.common = { Authorization: `bearer ${registeredUser.token}` }
      setLoggedInUser(registeredUser)
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        SecureStore.setItemAsync('user', JSON.stringify(registeredUser))
      } else {
        AsyncStorage.setItem('user', JSON.stringify(registeredUser))
      }
      if (onSuccess) { onSuccess(registeredUser) }
    } catch (error) {
      processError(error, onError, 'register')
    }
  }

  const updateProfile = async (data, onSuccess = null, onError = null) => {
    try {
      const updatedUser = await update(data)
      setLoggedInUser(updatedUser)
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        SecureStore.setItemAsync('user', JSON.stringify(updatedUser))
      } else {
        AsyncStorage.setItem('user', JSON.stringify(updatedUser))
      }
      if (onSuccess) { onSuccess(updatedUser) }
    } catch (error) {
      processError(error, onError, 'updateProfile')
    }
  }

  const signIn = async (data, onSuccess = null, onError = null) => {
    try {
      const loggedInUser = await login(data)
      axios.defaults.headers.common = { Authorization: `bearer ${loggedInUser.token}` }
      setLoggedInUser(loggedInUser)
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        SecureStore.setItemAsync('user', JSON.stringify(loggedInUser))
      } else {
        AsyncStorage.setItem('user', JSON.stringify(loggedInUser))
      }
      if (onSuccess) {
        onSuccess(loggedInUser)
      }
    } catch (error) {
      processError(error, onError, 'login')
    }
  }
  const getToken = async (onSuccess = null, onError = null) => {
    setLoading(true)
    try {
      let user
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        user = await SecureStore.getItemAsync('user')
      } else {
        user = await AsyncStorage.getItem('user')
      }
      if (user) {
        try {
          user = JSON.parse(user)
          const returnedUser = await isTokenValid(user.token)
          axios.defaults.headers.common = { Authorization: `bearer ${returnedUser.token}` }
          setLoggedInUser(returnedUser)
          if (onSuccess) { onSuccess(returnedUser) }
        } catch (err) {
          signOut()
          if (onError) {
            onError(err)
          }
        }
      }
    } catch (err) {
      setError(err)
      if (onError) { onError(err) }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthorizationContext.Provider value={{
      loggedInUser,
      signIn,
      signOut,
      signUp,
      getToken,
      updateProfile
    }}
    >
      {props.children}
    </AuthorizationContext.Provider>
  )
}

export { AuthorizationContext }
export default AuthorizationContextProvider
