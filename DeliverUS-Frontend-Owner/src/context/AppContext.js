import React, { useState, createContext } from 'react'
import { LoginError, ValidationError } from '../api/helpers/Errors'

const AppContext = createContext()

const AppContextProvider = props => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [ready, setReady] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [loginErrors, setLoginErrors] = useState({})

  const processError = (error, onError, formName) => {
    if (error instanceof ValidationError || error instanceof LoginError) {
      setValidationErrors({ ...validationErrors, [formName]: error.errors })
    } else {
      setError(error)
    }
    if (onError) { onError(error) }
  }

  return (
        <AppContext.Provider value={{
          loading,
          setLoading,
          error,
          setError,
          ready,
          setReady,
          validationErrors,
          setValidationErrors,
          loginErrors,
          setLoginErrors,
          processError
        }}
        >
            {props.children}
        </AppContext.Provider>
  )
}
export { AppContext }
export default AppContextProvider
