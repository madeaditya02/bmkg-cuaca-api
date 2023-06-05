const { datetimeStr, dateStr } = require('../util.js')
const w_key = {
    "0": ["Cerah", "Clear Skies"],
    "1": ["Cerah Berawan", "Partly Cloudy"],
    "2": ["Cerah Berawan", "Partly Cloudy"],
    "3": ["Berawan", "Mostly Cloudy"],
    "4": ["Berawan Tebal", "Overcast"],
    "5": ["Udara Kabur", "Haze"],
    "10": ["Asap", "Smoke"],
    "45": ["Kabut", "Fog"],
    "60": ["Hujan Ringan", "Light Rain"],
    "61": ["Hujan Sedang", "Rain"],
    "63": ["Hujan Lebat", "Heavy Rain"],
    "80": ["Hujan Lokal", "Isolated Shower"],
    "95": ["Hujan Petir", "Severe Thunderstorm"],
    "97": ["Hujan Petir", "Severe Thunderstorm"],
}
const wd_key = {
    N: "North",
    NNE: "North-Northeast",
    NE: "Northeast",
    ENE: "East-Northeast",
    E: "East",
    ESE: "East-Southeast",
    SE: "Southeast",
    SSE: "South-Southeast",
    S: "South",
    SSW: "South-Southwest",
    SW: "Southwest",
    WSW: "West-Southwest",
    W: "West",
    WNW: "West-Northwest",
    NW: "Northwest",
    NNW: "North-Northwest",
    VARIABLE: "berubah-ubah",
}
const extracts = {
    humidity($, district) {
        return {
            // id: 'hu',
            description: 'Kelembapan Udara',
            description_en: 'Humidity',
            type: 'hourly',
            data: district.find('parameter[id="hu"] timerange').toArray().map((el) => {
                return {
                    h: el.attribs.h,
                    utc_datetime: el.attribs.datetime,
                    ...datetimeStr(el.attribs.datetime),
                    value: $(el).find('value').text() + '%'
                }
            })
        }
    },
    max_humidity($, district) {
        return {
            // id: 'humax',
            description: 'Kelembapan Udara Maksimum',
            description_en: 'Max Humidity',
            type: 'daily',
            data: district.find('parameter[id="humax"] timerange').toArray().map(el => {
                return {
                    h: el.attribs.h,
                    ...dateStr(el.attribs.day),
                    value: $(el).find('value').text() + '%'
                }
            })
        }
    },
    min_humidity($, district) {
        return {
            // id: 'humin',
            description: 'Kelembapan Udara Minimum',
            description_en: 'Min Humidity',
            type: 'daily',
            data: district.find('parameter[id="humin"] timerange').toArray().map(el => {
                return {
                    h: el.attribs.h,
                    ...dateStr(el.attribs.day),
                    value: $(el).find('value').text() + '%'
                }
            })
        }
    },
    max_temperature($, district) {
        return {
            // id: 'tmax',
            description: 'Suhu Udara Maksimum',
            description_en: 'Max Temperature',
            type: 'daily',
            data: district.find('parameter[id="tmax"] timerange').toArray().map(el => {
                return {
                    h: el.attribs.h,
                    ...dateStr(el.attribs.day),
                    celcius: $(el).find('value[unit="C"]').text(),
                    fahrenheit: $(el).find('value[unit="F"]').text()
                }
            })
        }
    },
    min_temperature($, district) {
        return {
            // id: 'tmin',
            description: 'Suhu Udara Minimum',
            description_en: 'Min Temperature',
            type: 'daily',
            data: district.find('parameter[id="tmin"] timerange').toArray().map(el => {
                return {
                    h: el.attribs.h,
                    ...dateStr(el.attribs.day),
                    celcius: $(el).find('value[unit="C"]').text(),
                    fahrenheit: $(el).find('value[unit="F"]').text()
                }
            })
        }
    },
    temperature($, district) {
        return {
            // id: 't',
            description: 'Suhu Udara',
            description_en: 'Temperature',
            type: 'hourly',
            data: district.find('parameter[id="t"] timerange').toArray().map((el) => {
                return {
                    h: el.attribs.h,
                    utc_datetime: el.attribs.datetime,
                    ...datetimeStr(el.attribs.datetime),
                    celcius: $(el).find('value[unit="C"]').text(),
                    fahrenheit: $(el).find('value[unit="F"]').text()
                }
            })
        }
    },
    weather($, district) {
        return {
            // id: 'weather',
            description: 'Cuaca',
            description_en: 'Weather',
            type: 'hourly',
            data: district.find('parameter[id="weather"] timerange').toArray().map((el) => {
                const key = $(el).find('value').text()
                return {
                    h: el.attribs.h,
                    utc_datetime: el.attribs.datetime,
                    ...datetimeStr(el.attribs.datetime),
                    weather_code: key,
                    description: w_key[key][0],
                    description_en: w_key[key][1],
                }
            })
        }
    },
    wind_direction($, district) {
        return {
            // id: 'wd',
            description: 'Arah Angin',
            description_en: 'Wind Direction',
            type: 'hourly',
            data: district.find('parameter[id="wd"] timerange').toArray().map((el) => {
                const data = {}
                el.childNodes.forEach((val) => {
                    if (val.type == 'tag') {
                        data[val.attribs.unit] = val.firstChild.data
                    }
                })
                data['CARD_description'] = wd_key[data.CARD]
                return {
                    h: el.attribs.h,
                    utc_datetime: el.attribs.datetime,
                    ...datetimeStr(el.attribs.datetime),
                    ...data
                }
            })
        }
    },
    wind_speed($, district) {
        return {
            // id: 'ws',
            description: 'Kecepatan Angin',
            description_en: 'Wind Speed',
            type: 'hourly',
            data: district.find('parameter[id="ws"] timerange').toArray().map((el) => {
                const data = {}
                el.childNodes.forEach((val) => {
                    if (val.type == 'tag') {
                        data[val.attribs.unit.toLowerCase()] = val.firstChild.data
                    }
                })
                data['CARD_description'] = wd_key[data.CARD]
                return {
                    h: el.attribs.h,
                    utc_datetime: el.attribs.datetime,
                    ...datetimeStr(el.attribs.datetime),
                    unit: data
                }
            })
        }
    },
}

module.exports = extracts