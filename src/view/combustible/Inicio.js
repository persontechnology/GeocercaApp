import React, { useContext, useState, useEffect } from "react";
import { RefreshControl } from "react-native";
import { Pressable, Text, Alert, Box, VStack, HStack, Spacer, Flex, Badge, useToast, ScrollView, View } from "native-base";
import { AuthContext } from "../../service/AuthContext";
import { API_URL } from "@env";

export default function Index({ navigation, route }) {
    const { userId, userToken, userNombres } = useContext(AuthContext);
    const [refreshing, setRefreshing] = useState(false);
    const toast = useToast();
    const [data, setdata] = useState([])


    const acceder = async () => {
        setRefreshing(true);
        try {
            const res = await fetch(API_URL + "dc-consulta", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify()
            });
            const data = await res.json();
            setdata(data)

        } catch (error) {
            toast.show({ 'description': error.toString() })
            console.log(error.toString())
        } finally {

            setRefreshing(false)
        }
    }


    useEffect(() => {
        acceder();
        // actualizar listado
        if (route.params?.estado) {
            acceder();
        }
    }, [route.params?.estado])

    return (
        <ScrollView refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={acceder} />
        } >
            <View px={"3"}>

                <Box>
                    {
                        refreshing ? <></> : <View>
                            <View my={1}>
                                <Alert w="100%" variant={"subtle"} colorScheme="success" status="success" >
                                    <VStack space={1} flexShrink={1} w="100%">
                                        <HStack flexShrink={1} space={1} alignItems="center" justifyContent="space-between">
                                            <HStack space={1} flexShrink={1} alignItems="center">
                                                <Text color={"coolGray.800"}>
                                                    Hola, tienes {data.length} Ordenes de Combustibles.
                                                </Text>
                                            </HStack>
                                        </HStack>
                                    </VStack>
                                </Alert>
                            </View>
                            {
                                data.map(function (dc, i) {
                                    return (
                                        <Pressable key={i} my={1} onPress={
                                            () => {
                                                navigation.navigate("DetalleCombustible", dc)
                                            }

                                        }>
                                            {({
                                                isHovered,
                                                isPressed
                                            }) => {
                                                return <Box borderColor="coolGray.300" shadow="3" bg={isPressed ? "success.200" : "warning.50"} p="3" rounded="8" style={{
                                                    transform: [{
                                                        scale: isPressed ? 0.96 : 1
                                                    }]
                                                }}>
                                                    <HStack alignItems="center">


                                                        <Text fontSize={'md'} color="coolGray.800">
                                                            N°: {dc.numero}
                                                        </Text>
                                                        <Spacer />
                                                        <Badge colorScheme={'warning'} _text={{
                                                            color: "white"
                                                        }} variant="solid" rounded="4">
                                                            {dc.fecha}
                                                        </Badge>
                                                    </HStack>
                                                    <Text color="coolGray.800" fontWeight="medium" fontSize="md">
                                                        Concepto: {dc.concepto}
                                                    </Text>
                                                    <Text fontSize="xs" color="coolGray.700">
                                                        Código: {dc.codigo}
                                                    </Text>
                                                    <Flex>
                                                        <HStack space={"1"}>

                                                            <Text fontSize={12} fontWeight="medium" color={'yellow.600'}>
                                                                Vehículo: {dc.vehiculo}
                                                            </Text>
                                                        </HStack>
                                                    </Flex>
                                                </Box>;
                                            }}
                                        </Pressable>
                                    )
                                })
                            }
                        </View>
                    }
                </Box>
            </View>
        </ScrollView>
    );
};