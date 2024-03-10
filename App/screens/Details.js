import React from "react";
import { weatherApi } from "../util/weatherAPI";
import * as Location from 'expo-location';

import { Container } from '../components/Container';
import { ActivityIndicator, ScrollView, SafeAreaView, View } from "react-native";
import { WeatherIcon } from '../components/WeatherIcon';
import { BasicRow } from '../components/List';
import { H1, H2, P } from '../components/Text';

import { format } from 'date-fns';

const city = 'Kyiv';

const groupForecastByDay = list => {
    const data = {};
    list.forEach(item => {
        const [day] = item.dt_txt.split(' ');
        if (data[day]) {
            if (data[day].temp_max < item.main.temp_max) {
                data[day].temp_max = item.main.temp_max;
            }
            if (data[day].temp_min > item.main.temp_min) {
                data[day].temp_min = item.main.temp_min;
            }
        } else {
            data[day] = {
                temp_min: item.main.temp_min,
                temp_max: item.main.temp_max
            };
        }
    });
    const formattedList = Object.keys(data).map(key => {
        return {
            day: key,
            ...data[key]
        };
    });

    return formattedList;
};

export default class Details extends React.Component {
    state = {
        currentWeather: {},
        loadingCurrentWeather: true,
        forecast: [],
        loadingForecast: true,
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
            // console.log(status.granted);
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
                // console.log(`Weather response:\n${JSON.stringify(response)}`);
                this.props.navigation.setParams({ title: response.name });
                this.setState({ currentWeather: response, loadingCurrentWeather: false });
            })
            .catch(err => console.log(`Weather error:\n${err}`));
    };

    getForecast = ({ city /*zipcode*/, coords }) => {
        return weatherApi('/forecast', { city, coords })
            .then(response => {
                this.setState({
                    loadingForecast: false,
                    forecast: groupForecastByDay(response.list)
                });
            })
            .catch(err => console.log(`Forecast error:\n${err}`));
    };

    render() {
        if (this.state.loadingCurrentWeather || this.state.loadingForecast) {
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

                            <View style={{ paddingHorizontal: 10, marginTop: 20 }}>
                                {this.state.forecast.map(day => (
                                    <BasicRow
                                        key={day.day}
                                        style={{ justifyContent: 'space-between' }}
                                    >
                                        <P>{format(new Date(day.day), 'eeee, MMM dd')}</P>
                                        <View style={{ flexDirection: 'row' }}>
                                            <P>{Math.round(day.temp_min)}</P>
                                            <P style={{ fontWeight: '700', marginLeft: 10 }}>{Math.round(day.temp_max)}</P>
                                        </View>
                                    </BasicRow>
                                ))}
                            </View>
                        </SafeAreaView>
                    </ScrollView>
                </Container>
            );
        }
    }
}
