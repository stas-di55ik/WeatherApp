import React from 'react';
import { TouchableOpacity, Image } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Details from "./screens/Details";
import Search from "./screens/Search";

const HeaderRightButton = ({ onPress, navigation, style, icon }) => (
    <TouchableOpacity onPress={onPress}>
        <Image
            source={icon}
            resizeMode='contain'
            style={[
                {
                    marginRight: 10,
                    width: 20,
                    height: 20,
                    tintColor: '#fff',
                },
                style
            ]}
        />
    </TouchableOpacity>
);

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Details"
                    component={Details}
                    options={({ navigation, route }) => ({
                        headerTitle: route.params && route.params.city ? route.params.city : 'Default Title',
                        headerRight: () => (
                            <HeaderRightButton
                                icon={require('./assets/search.png')}
                                onPress={() => navigation.navigate('Search')} navigation={navigation}
                            />
                        ),
                        headerStyle: {
                            backgroundColor: '#3145b7',
                        },
                        headerTintColor: '#fff',
                    })}
                />


                <Stack.Screen
                    name="Search"
                    component={Search}
                    options={({ navigation }) => ({
                        headerRight: () => (
                            <HeaderRightButton
                                icon={require('./assets/close.png')}
                                onPress={() => navigation.pop()} navigation={navigation}
                            />
                        ),
                        headerLeft: null,
                        headerStyle: {
                            backgroundColor: '#3145b7',
                        },
                        headerTintColor: '#fff',
                    })}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
