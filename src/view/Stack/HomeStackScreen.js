import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Inicio from '../Inicio';
import { API_NAME } from "@env";
import { Pressable } from 'react-native';
import Perfil from '../auth/Perfil';
import Ingresar from '../kilometraje/Ingresar';
import { Icon } from 'native-base';
import { FontAwesome } from '@native-base/icons';


const HomeStack = createNativeStackNavigator();

export default function HomeStackScreen({navigation}) {
    return (
        <HomeStack.Navigator screenOptions={{
            headerStyle: {
              backgroundColor: '#f97316',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
            <HomeStack.Screen
                name="Home"
                component={Inicio}
                options={{
                    title: API_NAME,
                    headerRight: () => (
                        <Pressable onPress={() => navigation.navigate('Perfil')}>
                            <Icon as={FontAwesome} name="user-o" size={25} color="white"></Icon>
                        </Pressable>
                    )
                }}

            />
            <HomeStack.Screen name="Perfil" component={Perfil} />

            
            <HomeStack.Screen name="IngresoKilometraje" component={Ingresar} />


        </HomeStack.Navigator>
    );
}
