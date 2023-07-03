import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useContext, useEffect } from 'react'
import * as GlobalStyles from '../styles/GlobalStyles'
import RestaurantsStack from './restaurants/RestaurantsStack'
import ProfileStack from './profile/ProfileStack'
import ControlPanelScreen from './controlPanel/ControlPanelScreen'

// eslint-disable-next-line camelcase
import { useFonts, Montserrat_400Regular, Montserrat_600SemiBold } from '@expo-google-fonts/montserrat'
import FlashMessage, { showMessage } from 'react-native-flash-message'
import { AuthorizationContext } from '../context/AuthorizationContext'
import { AppContext } from '../context/AppContext'
import { ApiError } from '../api/helpers/Errors'

const Tab = createBottomTabNavigator()

export default function Layout () {
  const { getToken, signOut } = useContext(AuthorizationContext)
  const { error, setError } = useContext(AppContext)

  const init = async () => {
    await getToken(
      (recoveredUser) => showMessage({
        message: `Session recovered. You are logged in as ${recoveredUser.firstName}`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      }),
      (error) => showMessage({
        message: `Session could not be recovered. Please log in. ${error} `,
        type: 'warning',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    )
  }

  useEffect(() => {
    if (error) {
      showMessage({
        message: error.message,
        type: 'danger',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
      if (error instanceof ApiError && (error.code === 403 || error.code === 401)) {
        signOut()
      }
      setError(null)
    }
  }, [error])

  useEffect(() => {
    init()
  }, [])

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold
  })
  return (
    <>
    {fontsLoaded &&
     <NavigationContainer theme={GlobalStyles.navigationTheme}>

      <Tab.Navigator screenOptions={({ route }) => ({
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({ color, size }) => {
          let iconName
          if (route.name === 'My Restaurants') {
            iconName = 'silverware-fork-knife'
          } else if (route.name === 'Control Panel') {
            iconName = 'view-dashboard'
          } else if (route.name === 'Profile') {
            iconName = 'account-circle'
          }
          return <MaterialCommunityIcons name={iconName} color={color} size={size} />
        },
        headerShown: false
      })}>
        <Tab.Screen
          name='My Restaurants'
          component={RestaurantsStack}
        />
        <Tab.Screen
          name='Control Panel'
          component={ControlPanelScreen} />
        <Tab.Screen
          name='Profile'
          component={ProfileStack} />
      </Tab.Navigator>
      <FlashMessage position="top" />

    </NavigationContainer>
    }
    </>
  )
}
