import React from "react";
import { FlatList, Text, View } from "react-native";

import { SearchBar } from '../components/SearchBar';
import { SearchItem } from '../components/List';
import { getRecentSearch } from "../util/recentSearch";

class Search extends React.Component {
    state = {
        query: '',
        recentSearch: [],
    };

    componentDidMount() {
        getRecentSearch().then(recentSearch => {
            this.setState({ recentSearch });
        });
    }

    render() {
        return (
            <FlatList
                data={this.state.recentSearch}
                renderItem={({ item }) => (
                    <SearchItem
                        name={item}
                        onPress={() => {
                            this.props.navigation.navigate('Details', { city: item })
                        }}
                    />
                )}
                keyExtractor={item => item}
                ListHeaderComponent={(
                    <View>
                        <SearchBar
                            onSearch={() => {
                                this.props.navigation.navigate('Details', { city: this.state.query });
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