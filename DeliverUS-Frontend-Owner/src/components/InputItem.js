import { ErrorMessage, useFormikContext } from 'formik'
import React from 'react'
import { TextInput, StyleSheet, View } from 'react-native'
import TextError from './TextError'
import TextRegular from './TextRegular'

export default function InputItem (props) {
  const { label, name, ...inputProps } = props
  const formik = useFormikContext()

  return (
    <>
       <View style={styles.layout}>
          <View style={styles.labelWrapper}>
            <TextRegular>{label}</TextRegular>
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
                {...inputProps}
                name={name}
                style={styles.input}
                onChangeText={formik ? formik.handleChange(name) : undefined}
                onBlur={formik ? formik.handleBlur(name) : undefined}
                value={formik && formik.values[name] ? formik.values[name].toString() : undefined}
            />
          </View>
        </View>
        {formik && <ErrorMessage name={name} render={msg => <TextError>{msg}</TextError> }/>}
    </>
  )
}

const styles = StyleSheet.create({
  layout: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%'
  },
  labelWrapper: {
    width: '100%',
    textAlign: 'left',
    paddingLeft: 13,
    marginTop: 10,
    marginBottom: 5
  },
  inputWrapper: {
    width: '100%'
  },
  input: {
    borderRadius: 8,
    height: 40,
    borderWidth: 1,
    padding: 10
  }
})
