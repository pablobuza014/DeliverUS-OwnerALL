import React from 'react'
import AppContextProvider from './src/context/AppContext'
import AuthorizationContextProvider from './src/context/AuthorizationContext'
import Layout from './src/screens/Layout'

export default function App () {
  return (
    <AppContextProvider>
    <AuthorizationContextProvider>
      <Layout />
    </AuthorizationContextProvider>
    </AppContextProvider>
  )
}
