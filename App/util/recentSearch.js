import AsyncStorage from '@react-native-async-storage/async-storage';

export const addRecentSearch = async (item) => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const data = await AsyncStorage.multiGet(keys);
        const cities = data.map(([_, value]) => JSON.parse(value));
        const existingItem = cities.find(city => city === item);
        if (!existingItem) {
            await AsyncStorage.setItem(Date.now().toString(), JSON.stringify(item));
        }
    } catch (err) {
        console.log(`AddRecentSearch error: ${err}`);
    }
};

export const getRecentSearch = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const data = await AsyncStorage.multiGet(keys);
        const cities = data.map(([_, value]) => JSON.parse(value));

        return cities;
    } catch (err) {
        console.log(`GetRecentSearch: ${err}`);

        return [];
    }
}

export const removeAllItems = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        keys.forEach(key => {
            AsyncStorage.removeItem(key);
        });
    } catch (err) {
        console.log(`RemoveAllItems: ${err}`);
    }
}

