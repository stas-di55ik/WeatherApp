import React from "react";
import { weatherApi } from "../util/weatherAPI";
import * as Location from 'expo-location';

import { Container } from '../components/Container';
import { ActivityIndicator, ScrollView, SafeAreaView } from "react-native";
import { WeatherIcon } from '../components/WeatherIcon';
import { BasicRow } from '../components/List';
import { H1, H2 } from '../components/Text';

const city = 'Kyiv';

export default class Details extends React.Component {
    state = {
        currentWeather: {},
        loadingCurrentWeather: true,
    };

    componentDidMount() {
        // navigator.geolocation.getCurrentPosition(postion => {
        //     console.log(`Position: ${position}`);
        //     this.getCurrentWeather({ coords: position.coords });
        //     this.getForecast({ coords: info.coords });
        // });

        // this.getLocation();

        const weatherResponse = this.getCurrentWeather({ city });
        const forecastResponse = this.getForecast({ city });
    }

    getLocation = async () => {
        try {
            const status = await Location.requestForegroundPermissionsAsync();
            console.log(status.granted);
            if (status.granted) {
                await Location.enableNetworkProviderAsync();
                IntentLauncher.startActivityAsync(
                    IntentLauncher.ACTION_MANAGE_ALL_APPLICATIONS_SETTINGS
                );
                const location = await Location.getCurrentPositionAsync({});
                console.log(`Location: ${JSON.stringify(location)}`);

                return location;
            }
        } catch (error) {
            console.log(error);
        }
    };

    getCurrentWeather = ({ city /*zipcode*/, coords }) => {
        return weatherApi('/weather', { city, coords })
            .then(response => {
                console.log(`Weather response:\n${JSON.stringify(response)}`);
                this.props.navigation.setParams({ title: response.name });
                this.setState({ currentWeather: response, loadingCurrentWeather: false });
            })
            .catch(err => console.log(`Weather error:\n${err}`));
    };

    getForecast = ({ city /*zipcode*/, coords }) => {
        return weatherApi('/forecast', { city, coords })
            .then(response => console.log(`Forecast response:\n${JSON.stringify(response)}`))
            .catch(err => console.log(`Forecast error:\n${err}`));
    };

    render() {
        if (this.state.loadingCurrentWeather) {
            <Container>
                <ActivityIndicator color='#fff' size='large' />
            </Container>
        } else {
            const { weather, main } = this.state.currentWeather;

            return (
                <Container>
                    <ScrollView>
                        <SafeAreaView>
                            <WeatherIcon icon={weather[0].icon} />
                            <H1>{`${Math.round(main.temp)}°C`}</H1>
                            <BasicRow>
                                <H2>{`Humidity: ${main.humidity}%`}</H2>
                            </BasicRow>
                            <BasicRow>
                                <H2>{`Low: ${Math.round(main.temp_min)}°C`}</H2>
                                <H2>{`High: ${Math.round(main.temp_max)}°C`}</H2>
                            </BasicRow>
                        </SafeAreaView>
                    </ScrollView>
                </Container>
            );
        }
    }
}
