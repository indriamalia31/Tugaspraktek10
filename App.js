import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  ActivityIndicator, 
  SafeAreaView, 
  Keyboard, 
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Animated
} from 'react-native';


const weatherMap = {
  0: { label: 'Cerah', emoji: '☀️', bg: ['#4ea8de', '#90e0ef'] },
  1: { label: 'Utamanya Cerah', emoji: '🌤️', bg: ['#4ea8de', '#90e0ef'] },
  2: { label: 'Berawan Sebagian', emoji: '⛅', bg: ['#48cae4', '#ade8f4'] },
  3: { label: 'Mendung', emoji: '☁️', bg: ['#6c757d', '#adb5bd'] },
  45: { label: 'Berkabut', emoji: '🌫️', bg: ['#d3d3d3', '#e0e0e0'] },
  48: { label: 'Kabut Rime Deposisi', emoji: '🌫️', bg: ['#d3d3d3', '#e0e0e0'] },
  51: { label: 'Gerimis Ringan', emoji: '🌧️', bg: ['#4a5759', '#dedbd2'] },
  53: { label: 'Gerimis Sedang', emoji: '🌧️', bg: ['#4a5759', '#dedbd2'] },
  55: { label: 'Gerimis Lebat', emoji: '🌧️', bg: ['#4a5759', '#dedbd2'] },
  61: { label: 'Hujan Ringan', emoji: '🌧️', bg: ['#3a5a40', '#a3b18a'] },
  63: { label: 'Hujan Sedang', emoji: '🌧️', bg: ['#283618', '#606c38'] },
  65: { label: 'Hujan Deras', emoji: '⛈️', bg: ['#1d2d44', '#3e5c76'] },
  71: { label: 'Hujan Salju Ringan', emoji: '❄️', bg: ['#e0f7fa', '#ffffff'] },
  95: { label: 'Badai Petir', emoji: '🌩️', bg: ['#111827', '#374151'] },
};

export default function App() {
  
  const [textInput, setTextInput] = useState('Surabaya');
  const [searchInput, setSearchInput] = useState('Surabaya');

  const [weatherData, setWeatherData] = useState(null);
  const [status, setStatus] = useState('loading'); 
  const [errorMessage, setErrorMessage] = useState('');

  const [history, setHistory] = useState(['Medan', 'Bandung', 'Yogyakarta', 'Bali', 'Pekanbaru']);

  const [refreshing, setRefreshing] = useState(false);
 
  const fadeAnim = useRef(new Animated.Value(0)).current;
 
  const triggerFadeIn = () => {
    fadeAnim.setValue(0); 
    Animated.timing(fadeAnim, {
      toValue: 1,         
      duration: 800,      
      useNativeDriver: true,
    }).start();
  };

  
  useEffect(() => {
    if (!textInput.trim()) {
      setSearchInput('');
      setStatus('empty');
      setWeatherData(null);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      setSearchInput(textInput);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [textInput]);

  
  useEffect(() => {
    if (!searchInput) return;

    const abortController = new AbortController();
    
    async function fetchWeather() {
      if (!refreshing) setStatus('loading');
      setErrorMessage('');
      
      try {
        // Langkah 1: Geocoding
        const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchInput)}&count=1&language=id`;
        const geoResponse = await fetch(geocodeUrl, { signal: abortController.signal });
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
          setStatus('error');
          setErrorMessage('Kota tidak ditemukan. Coba nama kota lain!');
          setRefreshing(false);
          return;
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        // Langkah 2: Forecast
        const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
        const forecastResponse = await fetch(forecastUrl, { signal: abortController.signal });
        const forecastData = await forecastResponse.json();

        if (!forecastData.current_weather) {
          setStatus('error');
          setErrorMessage('Gagal mengambil data cuaca terbaru.');
          setRefreshing(false);
          return;
        }

        
        setWeatherData({
          cityName: name,
          country: country,
          temperature: forecastData.current_weather.temperature,
          weathercode: forecastData.current_weather.weathercode,
          isDay: forecastData.current_weather.is_day,
        });
        
        setStatus('success');
        setRefreshing(false);
        triggerFadeIn(); 

        
        setHistory((prevHistory) => {
          const filtered = prevHistory.filter(item => item.toLowerCase() !== name.toLowerCase());
          return [name, ...filtered].slice(0, 5);
        });

      } catch (error) {
        if (error.name !== 'AbortError') {
          setStatus('error');
          setErrorMessage('Terjadi kesalahan jaringan. Periksa koneksi internetmu!');
          setRefreshing(false);
        }
      }
    }

    fetchWeather();

    return () => abortController.abort();
  }, [searchInput, refreshing]);

  
  const onRefresh = () => {
    setRefreshing(true); 
  };

  
  const handleHistoryTap = (cityName) => {
    setTextInput(cityName);
  };


  const currentCuaca = weatherData ? (weatherMap[weatherData.weathercode] || { label: 'Tidak Diketahui', emoji: '❓', bg: ['#7f8c8d', '#95a5a6'] }) : null;
  const dynamicBackground = weatherData && weatherData.isDay === 0 ? '#1a1a2e' : (currentCuaca ? currentCuaca.bg[0] : '#f4f4f9');
  const dynamicTextColor = weatherData && weatherData.isDay === 0 ? '#ffffff' : '#333333';
  const chipBgColor = weatherData && weatherData.isDay === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.06)';

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.container, { backgroundColor: dynamicBackground }]}>
        
        
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor={weatherData && weatherData.isDay === 0 ? "#ffffff" : "#4ea8de"}
              colors={["#4ea8de"]}
            />
          }
        >
          
          <Text style={[styles.appTitle, { color: dynamicTextColor }]}>☀️ WeatherFinder</Text>
          
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder="Cari nama kota... (misal: Surabaya)"
              placeholderTextColor="#999"
              value={textInput}
              onChangeText={(text) => setTextInput(text)}
            />
          </View>

          {history.length > 0 && (
            <View style={styles.historyContainer}>
              <Text style={[styles.historyTitle, { color: dynamicTextColor }]}>Documented History:</Text>
              <View style={styles.chipsRow}>
                {history.map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={[styles.chip, { backgroundColor: chipBgColor }]}
                    onPress={() => handleHistoryTap(item)}
                  >
                    <Text style={[styles.chipText, { color: dynamicTextColor }]}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.contentContainer}>
            
            {status === 'empty' && (
              <View style={styles.centerBox}>
                <Text style={styles.hintEmoji}>🔍</Text>
                <Text style={[styles.hintText, { color: dynamicTextColor }]}>
                  Ketik nama kota di atas untuk melihat perkiraan cuaca saat ini.
                </Text>
              </View>
            )}

            {status === 'loading' && !refreshing && (
              <View style={styles.centerBox}>
                <ActivityIndicator size="large" color={weatherData && weatherData.isDay === 0 ? "#ffffff" : "#4ea8de"} />
                <Text style={[styles.loadingText, { color: dynamicTextColor }]}>Mengambil data cuaca...</Text>
              </View>
            )}

            {status === 'error' && (
              <View style={styles.errorCard}>
                <Text style={styles.errorEmoji}>⚠️</Text>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            {status === 'success' && weatherData && (
              <Animated.View style={[
                styles.weatherCard, 
                { 
                  backgroundColor: weatherData.isDay === 0 ? '#16213e' : '#ffffff',
                  opacity: fadeAnim 
                }
              ]}>
                <Text style={[styles.locationText, { color: dynamicTextColor }]}>
                  {weatherData.cityName}, <Text style={styles.countryText}>{weatherData.country}</Text>
                </Text>
                
                <Text style={styles.weatherEmoji}>{currentCuaca?.emoji}</Text>
                
                <Text style={[styles.tempText, { color: dynamicTextColor }]}>
                  {Math.round(weatherData.temperature)}°C
                </Text>
                
                <Text style={[styles.descText, { color: weatherData.isDay === 0 ? '#a2a8d3' : '#666666' }]}>
                  {currentCuaca?.label} {weatherData.isDay === 1 ? '☀️ (Siang)' : '🌙 (Malam)'}
                </Text>
              </Animated.View>
            )}

          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  searchContainer: {
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyContainer: {
    marginBottom: 15,
  },
  historyTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    opacity: 0.8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  contentContainer: {
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerBox: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  hintEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  hintText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
  },
  errorCard: {
    backgroundColor: '#ffe3e3',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffb3b3',
    width: '100%',
  },
  errorEmoji: {
    fontSize: 30,
    marginBottom: 5,
  },
  errorText: {
    color: '#d00000',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  weatherCard: {
    width: '100%',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  locationText: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 5,
  },
  countryText: {
    fontWeight: '400',
    opacity: 0.8,
  },
  weatherEmoji: {
    fontSize: 80,
    marginVertical: 15,
  },
  tempText: {
    fontSize: 54,
    fontWeight: 'bold',
  },
  descText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 5,
  },
});