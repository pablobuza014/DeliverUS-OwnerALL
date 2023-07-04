import React, { useEffect, useState } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native'
import * as ExpoImagePicker from 'expo-image-picker'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import InputItem from '../../components/InputItem'
import TextRegular from '../../components/TextRegular'
import * as GlobalStyles from '../../styles/GlobalStyles'
import defaultProductImage from '../../../assets/product.jpeg'
import { showMessage } from 'react-native-flash-message'
import DropDownPicker from 'react-native-dropdown-picker'
import * as yup from 'yup'
import { ErrorMessage, Formik } from 'formik'
import TextError from '../../components/TextError'
import { getProductCategories, getDetail, update } from '../../api/ProductEndpoints'
import { prepareEntityImages } from '../../api/helpers/FileUploadHelper'
import { buildInitialValues } from '../Helper'

export default function EditProductScreen ({ navigation, route }) {
  const [open, setOpen] = useState(false)
  const [productCategories, setProductCategories] = useState([])
  const [backendErrors, setBackendErrors] = useState()
  const [product, setProduct] = useState({})

  const [initialProductValues, setInitialProductValues] = useState({ name: null, highlight: false, promoted: false, Fats: 25.00, Proteins: 50.00, Carbohydrates: 25.00, description: null, price: null, order: null, restaurantId: route.params.id, productCategoryId: null, availability: null, image: null })
  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .max(255, 'Name too long')
      .required('Name is required'),
    Fats: yup
      .number()
      .max(100, '100g max')
      .positive('Please provide a positive fats value')
      .required('Fats are required'),
    Proteins: yup
      .number()
      .max(100, '100g max')
      .positive('Please provide a positive proteins value')
      .required('Proteins are required'),
    Carbohydrates: yup
      .number()
      .max(100, '100g max')
      .positive('Please provide a positive carbohydrates value')
      .required('Carbohidrates are required'),
    price: yup
      .number()
      .positive('Please provide a positive price value')
      .required('Price is required'),
    order: yup
      .number()
      .nullable()
      .positive('Please provide a positive order value')
      .integer('Please provide an integer order value'),
    availability: yup
      .boolean(),
    productCategoryId: yup
      .number()
      .positive()
      .integer()
      .required('Product category is required'),
    highlight: yup
      .boolean(),
    promoted: yup
      .boolean()
  })

  useEffect(() => {
    async function fetchProductCategories () {
      try {
        const fetchedProductCategories = await getProductCategories()
        const fetchedProductCategoriesReshaped = fetchedProductCategories.map((e) => {
          return {
            label: e.name,
            value: e.id
          }
        })
        setProductCategories(fetchedProductCategoriesReshaped)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving product categories. ${error} `,
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }
    fetchProductCategories()
  }, [])

  useEffect(() => {
    async function fetchProductDetail () {
      try {
        const fetchedProduct = await getDetail(route.params.id)
        const preparedProduct = prepareEntityImages(fetchedProduct, ['image'])
        setProduct(preparedProduct)
        const initialValues = buildInitialValues(preparedProduct, initialProductValues)
        setInitialProductValues(initialValues)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving product details (id ${route.params.id}). ${error}`,
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }
    fetchProductDetail()
  }, [route])

  const pickImage = async (onSuccess) => {
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    })
    if (!result.canceled) {
      if (onSuccess) {
        onSuccess(result)
      }
    }
  }

  const updateProduct = async (values) => {
    setBackendErrors([])
    try {
      const updatedProduct = await update(product.id, values)
      showMessage({
        message: `Product ${updatedProduct.name} succesfully updated`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
      navigation.navigate('RestaurantDetailScreen', { id: updatedProduct.restaurantId })
    } catch (error) {
      console.log(error)
      setBackendErrors(error.errors)
    }
  }
  return (
    <Formik
      enableReinitialize
      validationSchema={validationSchema}
      initialValues={initialProductValues}
      onSubmit={updateProduct}>
      {({ handleSubmit, setFieldValue, values }) => (
        <ScrollView>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: '60%' }}>
              <InputItem
                name='name'
                label='Name:'
              />
              <InputItem
                name='Fats'
                label='Fats:'
              />
              <InputItem
                name='Proteins'
                label='Proteins:'
              />
              <InputItem
                name='Carbohydrates'
                label='Carbohydrates:'
              />
              <InputItem
                name='description'
                label='Description:'
              />
              <InputItem
                name='price'
                label='Price:'
              />
              <InputItem
                name='order'
                label='Order/position to be rendered:'
              />

              <DropDownPicker
                open={open}
                value={values.productCategoryId}
                items={productCategories}
                setOpen={setOpen}
                onSelectItem={item => {
                  setFieldValue('productCategoryId', item.value)
                }}
                setItems={setProductCategories}
                placeholder="Select the product category"
                containerStyle={{ height: 40, marginTop: 20, marginBottom: 20 }}
                style={{ backgroundColor: GlobalStyles.brandBackground }}
                dropDownStyle={{ backgroundColor: '#fafafa' }}
              />
              <ErrorMessage name={'productCategoryId'} render={msg => <TextError>{msg}</TextError> }/>

              <TextRegular>Is it available?</TextRegular>
              <Switch
                trackColor={{ false: GlobalStyles.brandSecondary, true: GlobalStyles.brandPrimary }}
                thumbColor={values.availability ? GlobalStyles.brandSecondary : '#f4f3f4'}
                // onValueChange={toggleSwitch}
                value={values.availability}
                style={styles.switch}
                onValueChange={value =>
                  setFieldValue('availability', value)
                }
              />
              <ErrorMessage name={'availability'} render={msg => <TextError>{msg}</TextError> }/>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextRegular style= {{ marginTop: 30, marginRight: 10 }}>Do you want to highlight the product?</TextRegular>
                <Switch
                  trackColor={{ false: GlobalStyles.brandSecondary, true: GlobalStyles.brandPrimary }}
                  thumbColor={values.highlight ? GlobalStyles.brandSecondary : '#f4f3f4'}
                  value={values.highlight}
                  style={[styles.switch, { marginTop: 30 }]}
                  onValueChange={value => setFieldValue('highlight', value)}
                />
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextRegular style= {{ marginTop: 30, marginRight: 10 }}>Do you want to promote the product?</TextRegular>
                <Switch
                  trackColor={{ false: GlobalStyles.brandSecondary, true: GlobalStyles.brandPrimary }}
                  thumbColor={values.promoted ? GlobalStyles.brandSecondary : '#f4f3f4'}
                  value={values.promoted}
                  style={[styles.switch, { marginTop: 30 }]}
                  onValueChange={value => setFieldValue('promoted', value)}
                />
              </View>

              <Pressable onPress={() =>
                pickImage(
                  async result => {
                    await setFieldValue('image', result)
                  }
                )
              }
                style={styles.imagePicker}
              >
                <TextRegular>Product image: </TextRegular>
                <Image style={styles.image} source={values.image ? { uri: values.image.assets[0].uri } : defaultProductImage} />
              </Pressable>

              {backendErrors &&
                backendErrors.map((error, index) => <TextError key={index}>{error.param}-{error.msg}</TextError>)
              }

            <Pressable
                onPress={handleSubmit}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? GlobalStyles.brandSuccessTap
                      : GlobalStyles.brandSuccess
                  },
                  styles.button
                ]}>
              <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
                <MaterialCommunityIcons name='content-save' color={'white'} size={20}/>
                <TextRegular textStyle={styles.text}>
                  Save
                </TextRegular>
              </View>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    height: 40,
    padding: 10,
    width: '100%',
    marginTop: 20,
    marginBottom: 20
  },
  text: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginLeft: 5

  },
  imagePicker: {
    height: 40,
    paddingLeft: 10,
    marginTop: 20,
    marginBottom: 80
  },
  image: {
    width: 100,
    height: 100,
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 5
  },
  switch: {
    marginTop: 5
  }
})
