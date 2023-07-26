
import { ScrollView, Button  } from "native-base";
import React,{useContext, useEffect} from 'react'
import {View} from 'react-native';
import { AuthContext } from '../service/AuthContext'
import { Pressable, Text, Box, HStack, Spacer, Flex, Center, NativeBaseProvider,Badge } from 'native-base';

export default function Inicio({navigation}) {
  const {userRolesPermisos,userToken}=useContext(AuthContext);
  
  return (
    <ScrollView contentContainerStyle={{ flexGrow:1 }}>
      <Center flex={1}>

        {
          userRolesPermisos.includes("Ingreso de Kilometraje")?(
            <Pressable onPress={() => navigation.navigate("IngresoKilometraje")} >
              {({
                isHovered,
                isPressed
              }) => {
              return <Box maxW="96" borderWidth="1" borderColor="warning.300" shadow="3" bg={isPressed ? 'warning.400' : isHovered ? 'warning.400' : 'warning.100'} p="5" rounded="8" style={{
                transform: [{
                  scale: isPressed ? 0.96 : 1
                }]
              }}>
                  <Text color="warning.900" mt="3" fontWeight="medium" fontSize="xl">
                    Ingresar Kilometraje de Vehículo
                  </Text>
                  <Text mt="2" fontSize="sm" color="warning.800">
                    Los usuarios que tengan permiso de Ingreso de Kilometraje, pueden acceder.
                  </Text>
                </Box>;
          }}
          </Pressable>
          ):<></>
          
        }


        {
          userRolesPermisos.includes("Ingreso de Combustible")?(
            <Pressable pt={"3"}  onPress={() =>navigation.navigate("TabCombustible")}>
              {({
                isHovered,
                isPressed
              }) => {
              return <Box maxW="96" borderWidth="1" borderColor="primary.300" shadow="3" bg={isPressed ? 'primary.400' : isHovered ? 'primary.400' : 'primary.100'} p="5" rounded="8" style={{
                transform: [{
                  scale: isPressed ? 0.96 : 1
                }]
              }}>
                  <Text color="primary.900" mt="3" fontWeight="medium" fontSize="xl">
                    Despacho de combustible
                  </Text>
                  <Text mt="2" fontSize="sm" color="primary.800">
                    Los usuarios que tengan permiso de Ingreso de Combustible, pueden acceder.
                  </Text>
                </Box>;
          }}
          </Pressable>
          ):<></>
          
        }


      </Center>
    </ScrollView>

  )
}
