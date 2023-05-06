
import { ScrollView, Button, Center,  } from "native-base";
import React,{useContext, useEffect} from 'react'
import {View} from 'react-native';
import { AuthContext } from '../service/AuthContext'


export default function Inicio({navigation}) {
  const {userRolesPermisos,userToken}=useContext(AuthContext);
  
  return (
    <ScrollView contentContainerStyle={{ flexGrow:1 }}>
      <Center flex={1}>
        {
          userRolesPermisos.includes("Ingreso de Kilometraje")?(
            <Button mt="2" size={'lg'} variant={'subtle'} colorScheme="emerald"  onPress={()=>{
              navigation.navigate("IngresoKilometraje")
            }}>
                    Ingresar Kilometraje de Vehículo
            </Button>
          ):<></>
          
        }


        {
          userRolesPermisos.includes("Ingreso de Combustible")?(
            <Button mt="2" size={'lg'} variant={'subtle'} colorScheme="primary"  onPress={()=>{
              navigation.navigate("TabCombustible")
            }}>
                    Ingresar Combustible de Vehículo
            </Button>
          ):<></>
          
        }


      </Center>
    </ScrollView>

  )
}
