
import React,{useContext, useEffect,useState} from 'react'
import { Box, Text, Heading, VStack, FormControl, Input,  Button,  Center, useToast,Checkbox,ScrollView } from "native-base";
import {API_URL} from "@env";

import { BottomSheet,ListItem } from '@rneui/themed';

import { AuthContext } from '../../service/AuthContext'


export default function Ingresar({ navigation, route }) {
  
  const {userRolesPermisos,userToken}=useContext(AuthContext);

   const [cargando, setcargando] = useState(false);
    const toast = useToast();
    const [vehiculo, setVehiculo] = useState('');
    const [kilometraje, setKilometraje] = useState('');
    const [msgkm, setMsgkm] = useState('');
    const [estadokm, setEstadokm] = useState(true);
    const [nombreEstacion, setnombreEstacion] = useState('Selecionar parqueadero');
    const [isVisible, setIsVisible] = useState(false);
    const [estaciones, setestaciones] = useState([]);
    const [cargandoEstaciones, setcargandoEstaciones] = useState(false);
    const [service, setService] = useState();

    const  acceder= async()=>{
      setMsgkm('')
        setcargando(true);
        try {
            const res=await fetch(API_URL+"ingresar-kilometraje",{
                method:'POST',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
                body:JSON.stringify({
                    "vehiculo":vehiculo,
                    "kilometraje":kilometraje,
                    "ingreso":estadokm?'SI':'NO',
                    "parqueadero":service
                })
            });
            
            const data=await res.json();
            
            console.log(data)
            if(data.errors){
                Object.entries(data.errors).forEach(([key, value]) => {
                    toast.show({'description':value.toString()})
                });
            }
            

            if(data.message==='no'){
              toast.show({'description':'No existe vehiculo con esa información.'})   
              setMsgkm(data.msg)
            }


            if(data.message==='km'){
              toast.show({'description':data.msg})   
              setMsgkm(data.msg)
            }

            if(data.message==='si'){
              navigation.navigate({
                name: 'Home'
            })
                toast.show({'description':'Kilometraje ingresado exitosamente'})    
            }

        } catch (error) {
          console.log(error)
            toast.show({'description':error.toString()})
        }finally {
            setcargando(false);
        }
    }


    const consultarEstaciones = async () => {
      try {
        const res = await fetch(API_URL + "ingresar-kilometraje-mis-estaciones", {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`
          }
        });
        const data = await res.json();
        
        setestaciones(data);
  
        if (data.errors) {
          Object.entries(data.errors).forEach(([key, value]) => {
            toast.show({ 'description': value.toString() })
          });
        }
  
      } catch (error) {
        toast.show({ 'description': error.toString() })
      } finally {
        setcargandoEstaciones(true);
      }
    }



    useEffect(() => {
      consultarEstaciones();
    }, []);
  
    function asignarEstacion(id,nombre){
      console.log(id)
      setService(id);
      setnombreEstacion(nombre);
      setIsVisible(false);
    }

        return (
          <ScrollView contentContainerStyle={{ flexGrow:1 }}>
            
            <Center w="100%">
            <Box safeArea p="2" py="8" w="90%" maxW="290">
              <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
              color: "warmGray.50"
            }}>
                Ingresar kilometraje de vehículo
              </Heading>
              <Heading mt="1" _dark={{
              color: "warmGray.200"
            }} color="coolGray.600" fontWeight="medium" size="xs">
                complete los datos
              </Heading>
      
              <VStack space={3} mt="5">
              

                  {
                    cargandoEstaciones && estaciones.length>0?<>

                <Checkbox shadow={2} isChecked={estadokm} value={estadokm} accessibilityLabel="" onChange={(e)=>setEstadokm(!estadokm)} >
                                  Ingresar con kilometraje.!
                </Checkbox>


                      <Button
                          variant={"outline"}
                          onPress={() => setIsVisible(true)}
                        >{nombreEstacion}</Button>

                        <BottomSheet modalProps={{}} isVisible={isVisible} onBackdropPress={() => setIsVisible(false)}>

                          {estaciones.map((l, i) => (
                            <ListItem
                              key={i}
                              onPress={() => asignarEstacion(l.id,l.nombre)}
                            >
                              <ListItem.Content>
                                <ListItem.Title>{l.nombre}</ListItem.Title>
                              </ListItem.Content>
                            </ListItem>
                          ))}
                          <ListItem
                            key={"aa"}
                            containerStyle={{ backgroundColor: 'red' }}
                            onPress={() => setIsVisible(false)}
                          >
                            <ListItem.Content>
                              <ListItem.Title style={{ color: "white" }}>{"Cancelar"}</ListItem.Title>
                            </ListItem.Content>
                          </ListItem>
                        </BottomSheet>

                        <FormControl>
                          <FormControl.Label>N° movil o Placa de Vehículo</FormControl.Label>
                          <Input onChangeText={setVehiculo} value={vehiculo} />
                        </FormControl>
                        {
                          estadokm?<FormControl>
                          <FormControl.Label>Kilometraje recorrido</FormControl.Label>
                          <Input type="text" keyboardType="numeric" onChangeText={setKilometraje} value={kilometraje}/>
                          <FormControl.HelperText>
                          {msgkm}
                        </FormControl.HelperText>
                        </FormControl>:<></>
                        }
                        
                      
                        <Button mt="2" colorScheme="warning" isLoading={cargando} onPress={acceder}>
                            Ingresar
                        </Button>

                        
                    </>:<Text color="darkBlue.600">No tiene un parqueadero asignados, por el cual no puede ingresar un kilometraje.</Text>
                  }
                


                
              </VStack>
            </Box>
          </Center>
          </ScrollView>
        );
}
