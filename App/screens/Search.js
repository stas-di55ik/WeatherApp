import React from "react";
import { FlatList, Text, View } from "react-native";

import { SearchBar } from '../components/SearchBar';
import { SearchItem } from '../components/List';

class Search extends React.Component {
    state = {
        query: '',
    };

    render() {
        return (
            <FlatList
                data={[{ id: 1, name: 'Kyiv' }, { id: 2, name: 'Lviv' }]}
                renderItem={({ item }) => (
                    <SearchItem
                        name={item.name}
                        onPress={() => this.props.navigation.navigate('Details', { city: item.name })}
                    />
                )}
                keyExtractor={item => item.id.toString()}
                ListHeaderComponent={(
                    <View>
                        <SearchBar
                            onSearch={() => {
                                this.props.navigation.navigate('Details', {
                                    city: this.state.query
                                });
                            }}
                            searchButtonEnabled={this.state.query.length >= 3}
                            placeholder='City'
                            onChangeText={query => this.setState({ query })}
                        />
                        <Text style={{
                            marginHorizontal: 10,
                            fontSize: 16,
                            color: '#aaa',
                            marginTop: 10,
                            marginBottom: 5
                        }}>
                            Recents
                        </Text>
                    </View>
                )}
            />
        )
    }
};

export default Search;