const apiKey = '5417d80020b2462d12e4dff73155542e';

export const weatherApi = (path, city) => {
    const suffix = `q=${city}&`;
    // https://api.openweathermap.org/data/2.5/weather?q=Kyiv&appid=5417d80020b2462d12e4dff73155542e&units=imperial
    // https://api.openweathermap.org/data/2.5/forecast?q=Kyiv&appid=5417d80020b2462d12e4dff73155542e&units=imperial
    return fetch(`https://api.openweathermap.org/data/2.5${path}?${suffix}appid=${apiKey}&units=metric`)
        .then(response => response.json());
};
