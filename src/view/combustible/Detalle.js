import React, {useState, useEffect,useContext} from 'react';

import {
  View,
  PermissionsAndroid
} from 'react-native';

import { Center, ScrollView, useToast, Box, Text, Stack, Heading, HStack, Button, Pressable, Avatar, FormControl, Input } from 'native-base'
import { Spacer, Flex, Badge, NativeBaseProvider } from "native-base";


import { API_URL } from "@env";
import { AuthContext } from '../../service/AuthContext';
import ImagePicker from 'react-native-image-crop-picker';
import * as Animatable from 'react-native-animatable';
import ReactNativeBlobUtil from 'react-native-blob-util'

import Geolocation from 'react-native-geolocation-service';


// Function to get permission for location
const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    // console.log('granted', granted);
    if (granted === 'granted') {
      // console.log('You can use Geolocation');
      return true;
    } else {
      // console.log('You cannot use Geolocation');
      return false;
    }
  } catch (err) {
    return false;
  }
};


const App = ({ route, navigation }) => {

  const urlFotoCamara = "https://pixsector.com/cache/d01b7e30/av7801257c459e42a24b5.png";
  const {
    id,
    concepto,
    numero,
    codigo,
    vehiculo,
    fecha,
    ultimoKilometraje,
    observaciones
  } = route.params;


  // state to hold location
  const [location, setLocation] = useState(false);

  const { userToken } = useContext(AuthContext);
  const toast = useToast();
  let [service, setService] = React.useState("");
  const [cargando, setcargando] = useState(false);

  const [imageData, setimageData] = useState('');
  const [imagePath, setimagePath] = useState(urlFotoCamara);
  const [mostrarBotonFinalizar, setmostrarBotonFinalizar] = useState(false);
  const [isVisible, setIsVisible] = useState(false);




  // function to check permissions and get Location
  const getLocation = () => {
    const result = requestLocationPermission();
    result.then(res => {
      
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            
            setLocation(position);
          },
          error => {
      
            setLocation(false);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    });
    
  };


  const tomarFoto = async () => {
    try {
      await ImagePicker.openCamera({
        width: 300,
        height: 400,
        includeBase64: true,
        cropping: true
      }).then(image => {
        setimageData(image.data)
        setimagePath(image.path)
      });
    } catch (error) {

    }
  }

  const enviarFotox = async () => {
    setcargando(true)

    try {
      const res = await ReactNativeBlobUtil.fetch('POST', API_URL + "dc-enviarFoto", {
        'Authorization': `Bearer ${userToken}`,
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      }, [
        { name: 'foto', filename: 'avatar.png', data: imageData },
        { name: 'id', data: id.toString() },
        { name: 'valorConsumido', data: service.toString() },
        { name: 'lat', data: String(location.coords.latitude) },
        { name: 'lng', data: String(location.coords.longitude) },

      ]);

      const data = await res.json();
      console.log(data)

      if (data === 'ok') {
        toast.show({ 'description': 'Despacho finalizado' });
        setimageData('');
        setService('');
        setcargando(false);
        setmostrarBotonFinalizar(true);
        setimagePath(urlFotoCamara);

        navigation.navigate({
            name: 'InicioCombustible',
            params: { estado: (Math.random() + 1).toString(36).substring(7) }
        })

      }
      if (data === 'no') {
        toast.show({ 'description': 'Ocurrio un error, vuelva intentar.' })
      }
      if (data.errors) {
        Object.entries(data.errors).forEach(([key, value]) => {
          toast.show({ 'description': value.toString() })
        });
      }

    } catch (error) {
      toast.show({ 'description': error.toString() })
    } finally {
      setcargando(false);
    }

  }


  useEffect(()=>{
    getLocation()
  },[location])


  if(location){
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
     
      <Box alignItems="center"  pt="2">
            <Pressable onPress={() => {}} rounded="8" overflow="hidden" borderWidth="1" borderColor="coolGray.300" maxW="96" shadow="3" bg="coolGray.100" p="5">
              <Box>
                <HStack alignItems="center">
                  <Badge colorScheme="darkBlue" _text={{
                  color: "white"
                }} variant="solid" rounded="4">
                    {fecha}
                  </Badge>
                  <Spacer />
                  <Text fontSize={10} color="coolGray.800">
                  Código: {codigo}
                  </Text>
                </HStack>
                <Text color="coolGray.800" mt="3" fontWeight="medium" fontSize="sm">
                  N° de Despacho de Combustible: {numero}
                </Text>
                <Text mt="2" fontSize="sm" color="coolGray.700">
                Concepto: {concepto}
                </Text>
                <Text mt="2" fontSize="sm" color="coolGray.700">
                Vehículo: {vehiculo}
                </Text>
                <Text mt="2" fontSize="sm" color="coolGray.700">
                
                Descripcion: {observaciones}
                </Text>
                <Flex>
                  <Text mt="2" fontSize={12} fontWeight="medium" color="darkBlue.600">
                    Último Kilometraje: {ultimoKilometraje}
                  </Text>
                </Flex>
              </Box>
            </Pressable>
        </Box>


      <Center flex={1}>
        

        <Box w="95%" >
        <FormControl mb="5">
          <FormControl.Label>Captura una foto de evidencia.</FormControl.Label>
        </FormControl>


            <Pressable onPress={tomarFoto} style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? 'rgb(210, 230, 255)'
                  : 'white'
              },
            ]}>
              <Center mt={2}>
                <Animatable.View animation="pulse" easing="ease-out" iterationCount={5}>
                  <Avatar bg="dark.500" source={{
                    uri: imagePath
                  }} size="2xl">
                    foto
                    <Avatar.Badge bg={imageData.length > 0 ? 'success.500' : 'danger.500'} />
                  </Avatar>
                </Animatable.View>
                <Text>{imageData.length > 0 ? 'Cambiar foto' : 'Tomar foto'}</Text>
              </Center>
            </Pressable>


            {
              mostrarBotonFinalizar ? (
                <Button mt="2" colorScheme="danger" onPress={() => navigation.navigate({
                    name: 'InicioCombustible',
                    params: { estado: (Math.random() + 1).toString(36).substring(7) }
                  })
                }>
                  Finalizar despacho
                </Button>
              ) : (
                <>
                <FormControl mb="5">
                  <FormControl.Label>Ingrese valor consumido.</FormControl.Label>
                  <Input keyboardType='decimal-pad' onChangeText={setService} value={service} />
                  
                </FormControl>

                <Button mt="2" colorScheme="warning" onPress={enviarFotox} isLoadingText={"Enviando..."} isLoading={cargando}>
                  Enviar
                </Button>
                </>
              )
            }

          </Box> 

      </Center>
    </ScrollView>
    );
  }else{
    return (
      <View>
        <Text>UBICACIÓN DE SU DISPOSITIVO NO ACTIVADO</Text>
      </View>
    );
  }
  
};


export default App;