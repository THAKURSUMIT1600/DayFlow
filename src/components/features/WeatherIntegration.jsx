import React, { useState, useEffect } from "react";
import {
  Cloud,
  Sun,
  CloudRain,
  Snowflake,
  Wind,
  Thermometer,
  MapPin,
  Loader2,
} from "lucide-react";
import Card from "../ui/Card.jsx";
import Button from "../ui/Button.jsx";
import { useWeekend } from "../../hooks/useWeekend.js";
import "./WeatherIntegration.css";

const FREE_WEATHER_API_BASE_URL = "https://api.open-meteo.com/v1/forecast";

const WEATHER_RECOMMENDATIONS = {
  sunny: {
    recommended: ["outdoor", "sports", "adventure", "nature"],
    avoid: ["indoor"],
    message: "Perfect weather for outdoor activities!",
  },
  partly_cloudy: {
    recommended: ["outdoor", "cultural", "social"],
    avoid: [],
    message: "Great weather for most activities!",
  },
  rainy: {
    recommended: ["indoor", "cultural", "wellness", "entertainment"],
    avoid: ["outdoor", "sports"],
    message: "Indoor activities recommended today",
  },
  cloudy: {
    recommended: ["indoor", "cultural", "social", "wellness"],
    avoid: ["outdoor"],
    message: "Perfect for indoor fun!",
  },
  cold: {
    recommended: ["indoor", "wellness", "cultural"],
    avoid: ["outdoor"],
    message: "Stay warm with indoor activities",
  },
};

const WeatherIntegration = () => {
  const { filteredActivities } = useWeekend();
  const [weatherData, setWeatherData] = useState(null);
  const [selectedDay, setSelectedDay] = useState("saturday");
  const [weatherRecommendations, setWeatherRecommendations] = useState([]);
  const [location, setLocation] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coordinates, setCoordinates] = useState(null);

  // Utility functions - defined first to avoid initialization errors
  const getWeatherDescription = React.useCallback((condition, temperature) => {
    const descriptions = {
      sunny: `Sunny and ${temperature > 25 ? "warm" : "pleasant"}`,
      partly_cloudy: `Partly cloudy, ${temperature}°C`,
      rainy: `Rainy day, ${temperature}°C`,
      cloudy: `Cloudy skies, ${temperature}°C`,
      cold: `Cold weather, ${temperature}°C`,
      snowy: `Snow expected, ${temperature}°C`,
    };
    return descriptions[condition] || `${temperature}°C`;
  }, []);

  const getWeatherIcon = React.useCallback((condition) => {
    const icons = {
      sunny: Sun,
      partly_cloudy: Cloud,
      rainy: CloudRain,
      cloudy: Cloud,
      cold: Snowflake,
      snowy: Snowflake,
      windy: Wind,
    };
    return icons[condition] || Sun;
  }, []);

  const getWeatherColor = (condition) => {
    const colors = {
      sunny: "#f39c12",
      partly_cloudy: "#3498db",
      rainy: "#34495e",
      cloudy: "#95a5a6",
      cold: "#3498db",
      snowy: "#3498db",
      windy: "#16a085",
    };
    return colors[condition] || "#3498db";
  };

  // Get user's current location
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  };

  // Get location name from coordinates
  const getLocationName = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      const data = await response.json();
      return (
        data.city ||
        data.locality ||
        data.principalSubdivision ||
        "Unknown Location"
      );
    } catch (error) {
      console.error("Error getting location name:", error);
      return "Unknown Location";
    }
  };

  // Initialize weather data
  useEffect(() => {
    // Fetch weather data from Open-Meteo API (free, no key required)
    const fetchWeatherData = async (lat, lon) => {
      try {
        const response = await fetch(
          `${FREE_WEATHER_API_BASE_URL}?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max&timezone=auto&forecast_days=7`
        );

        if (!response.ok) {
          throw new Error(`Weather API error: ${response.status}`);
        }

        const data = await response.json();

        // Get today's date and calculate Saturday/Sunday
        const today = new Date();
        const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

        // Calculate days until Saturday and Sunday
        const daysUntilSaturday = (6 - currentDay) % 7;
        const daysUntilSunday = (7 - currentDay) % 7;

        const saturdayIndex = daysUntilSaturday;
        const sundayIndex = daysUntilSunday;

        // Convert weather code to condition
        const getWeatherCondition = (code) => {
          if (code === 0) return "sunny";
          if (code >= 1 && code <= 3) return "partly_cloudy";
          if (code >= 45 && code <= 48) return "cloudy";
          if (code >= 51 && code <= 67) return "rainy";
          if (code >= 71 && code <= 86) return "snowy";
          return "cloudy";
        };

        const formatWeatherData = (dayIndex) => {
          const temp = Math.round(data.daily.temperature_2m_max[dayIndex]);
          const code = data.daily.weathercode[dayIndex];
          const condition = getWeatherCondition(code);

          return {
            condition,
            temperature: temp,
            description: getWeatherDescription(condition, temp),
            humidity: Math.round(50 + Math.random() * 30), // Simulated humidity 50-80%
            windSpeed: Math.round(data.daily.windspeed_10m_max[dayIndex]),
            icon: getWeatherIcon(condition),
          };
        };

        return {
          saturday: formatWeatherData(saturdayIndex),
          sunday: formatWeatherData(sundayIndex),
        };
      } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error;
      }
    };

    const initializeWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get user's location
        const coords = await getCurrentLocation();
        setCoordinates(coords);

        // Get location name
        const locationName = await getLocationName(coords.lat, coords.lon);
        setLocation(locationName);

        // Get weather data
        const weather = await fetchWeatherData(coords.lat, coords.lon);
        setWeatherData(weather);
      } catch (error) {
        console.error("Error initializing weather:", error);
        setError(error.message);

        // Fallback to default location (London)
        try {
          const fallbackWeather = await fetchWeatherData(51.5074, -0.1278);
          setWeatherData(fallbackWeather);
          setLocation("London (Default)");
          setError(null); // Clear error if fallback succeeds
        } catch (fallbackError) {
          console.error("Fallback weather fetch failed:", fallbackError);

          // Ultimate fallback with mock data
          const mockWeather = {
            saturday: {
              condition: "partly_cloudy",
              temperature: 22,
              description: "Partly cloudy, 22°C",
              humidity: 65,
              windSpeed: 10,
              icon: Cloud,
            },
            sunday: {
              condition: "sunny",
              temperature: 25,
              description: "Sunny and pleasant",
              humidity: 55,
              windSpeed: 8,
              icon: Sun,
            },
          };
          setWeatherData(mockWeather);
          setLocation("Sample Location");
          setError("Using sample weather data");
        }
      } finally {
        setLoading(false);
      }
    };

    initializeWeather();
  }, [getWeatherDescription, getWeatherIcon]);

  // Refresh weather data
  const refreshWeather = async () => {
    if (!coordinates) return;

    try {
      setLoading(true);
      // Use a simple fetch since fetchWeatherData is defined in useEffect
      const response = await fetch(
        `${FREE_WEATHER_API_BASE_URL}?latitude=${coordinates.lat}&longitude=${coordinates.lon}&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max&timezone=auto&forecast_days=7`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();

      // Simple weather formatting for refresh
      const today = new Date();
      const currentDay = today.getDay();
      const daysUntilSaturday = (6 - currentDay) % 7;
      const daysUntilSunday = (7 - currentDay) % 7;

      const getCondition = (code) => {
        if (code === 0) return "sunny";
        if (code >= 1 && code <= 3) return "partly_cloudy";
        if (code >= 45 && code <= 48) return "cloudy";
        if (code >= 51 && code <= 67) return "rainy";
        if (code >= 71 && code <= 86) return "snowy";
        return "cloudy";
      };

      const formatData = (dayIndex) => {
        const temp = Math.round(data.daily.temperature_2m_max[dayIndex]);
        const code = data.daily.weathercode[dayIndex];
        const condition = getCondition(code);

        return {
          condition,
          temperature: temp,
          description: getWeatherDescription(condition, temp),
          humidity: Math.round(50 + Math.random() * 30),
          windSpeed: Math.round(data.daily.windspeed_10m_max[dayIndex]),
          icon: getWeatherIcon(condition),
        };
      };

      const weather = {
        saturday: formatData(daysUntilSaturday),
        sunday: formatData(daysUntilSunday),
      };

      setWeatherData(weather);
      setError(null);
    } catch (refreshError) {
      setError("Failed to refresh weather data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (weatherData && weatherData[selectedDay]) {
      const currentWeather = weatherData[selectedDay];
      const recommendations = WEATHER_RECOMMENDATIONS[currentWeather.condition];

      if (recommendations) {
        const suggestedActivities = filteredActivities
          .filter((activity) =>
            recommendations.recommended.some(
              (category) =>
                activity.category.toLowerCase().includes(category) ||
                activity.name.toLowerCase().includes(category) ||
                activity.description.toLowerCase().includes(category)
            )
          )
          .slice(0, 8);

        setWeatherRecommendations(suggestedActivities);
      }
    }
  }, [selectedDay, weatherData, filteredActivities]);

  // Show loading state
  if (loading) {
    return (
      <Card className="weather-integration" padding="large">
        <div className="weather-integration__loading">
          <Loader2 size={32} className="weather-loading-spinner" />
          <h3>Getting your location and weather...</h3>
          <p>Please allow location access for personalized weather data</p>
        </div>
      </Card>
    );
  }

  // Show error state
  if (error && !weatherData) {
    return (
      <Card className="weather-integration" padding="large">
        <div className="weather-integration__error">
          <Cloud size={32} />
          <h3>Unable to load weather data</h3>
          <p>{error}</p>
          <Button onClick={refreshWeather} variant="primary" size="small">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  if (!weatherData) return null;

  const currentWeather = weatherData[selectedDay];
  const WeatherIcon = getWeatherIcon(currentWeather.condition);
  const recommendations = WEATHER_RECOMMENDATIONS[currentWeather.condition];

  return (
    <Card className="weather-integration" padding="large">
      <div className="weather-integration__header">
        <h3 className="weather-integration__title">
          <Cloud size={20} />
          Weather-Smart Planning
        </h3>
        <div className="weather-integration__location">
          <MapPin size={14} />
          <span>{location}</span>
        </div>
      </div>

      {/* Day Selector */}
      <div className="weather-integration__day-selector">
        <Button
          variant={selectedDay === "saturday" ? "primary" : "outline"}
          size="small"
          onClick={() => setSelectedDay("saturday")}
        >
          Saturday
        </Button>
        <Button
          variant={selectedDay === "sunday" ? "primary" : "outline"}
          size="small"
          onClick={() => setSelectedDay("sunday")}
        >
          Sunday
        </Button>
      </div>

      {/* Weather Display */}
      {currentWeather && currentWeather.temperature !== undefined && (
        <div className="weather-display">
          <div
            className="weather-display__main"
            style={{
              "--weather-color": getWeatherColor(currentWeather.condition),
            }}
          >
            <div className="weather-display__icon">
              <WeatherIcon size={32} />
            </div>
            <div className="weather-display__info">
              <div className="weather-display__temperature">
                {currentWeather.temperature}°C
              </div>
              <div className="weather-display__description">
                {currentWeather.description}
              </div>
            </div>
          </div>

          <div className="weather-display__details">
            <div className="weather-detail">
              <Thermometer size={14} />
              <span>Feels like {currentWeather.temperature + 2}°C</span>
            </div>
            <div className="weather-detail">
              <Wind size={14} />
              <span>{currentWeather.windSpeed} km/h</span>
            </div>
            <div className="weather-detail">
              <CloudRain size={14} />
              <span>{currentWeather.humidity}% humidity</span>
            </div>
          </div>
        </div>
      )}

      {/* Weather Recommendations */}
      {currentWeather &&
        currentWeather.temperature !== undefined &&
        recommendations && (
          <div className="weather-recommendations">
            <div className="weather-recommendations__header">
              <h4 className="weather-recommendations__title">
                {recommendations.message}
              </h4>
              <p className="weather-recommendations__subtitle">
                Here are some weather-appropriate activities:
              </p>
            </div>

            {weatherRecommendations.length > 0 && (
              <div className="weather-recommendations__grid">
                {weatherRecommendations.map((activity) => (
                  <div key={activity.id} className="weather-recommendation">
                    <span className="weather-recommendation__icon">
                      {activity.icon}
                    </span>
                    <div className="weather-recommendation__content">
                      <h5 className="weather-recommendation__name">
                        {activity.name}
                      </h5>
                      <p className="weather-recommendation__category">
                        {activity.category}
                      </p>
                    </div>
                    <div className="weather-recommendation__suitability">
                      <span className="weather-recommendation__match">
                        Perfect match!
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {recommendations.avoid.length > 0 && (
              <div className="weather-recommendations__avoid">
                <p className="weather-recommendations__avoid-text">
                  💡 Tip: Consider avoiding {recommendations.avoid.join(", ")}{" "}
                  activities due to weather conditions.
                </p>
              </div>
            )}
          </div>
        )}

      {/* Location Update */}
      <div className="weather-integration__footer">
        <Button
          variant="ghost"
          size="small"
          onClick={refreshWeather}
          disabled={loading}
        >
          <Cloud size={14} />
          {loading ? "Refreshing..." : "Refresh Weather"}
        </Button>
        <Button
          variant="ghost"
          size="small"
          onClick={() => {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                try {
                  setLoading(true);
                  const coords = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                  };
                  setCoordinates(coords);
                  const locationName = await getLocationName(
                    coords.lat,
                    coords.lon
                  );
                  setLocation(locationName);

                  // Refresh weather with new location
                  await refreshWeather();
                } catch (err) {
                  setError("Failed to update location");
                } finally {
                  setLoading(false);
                }
              },
              () => {
                alert(
                  "Unable to get your location. Please check your browser permissions."
                );
              }
            );
          }}
        >
          <MapPin size={14} />
          Update Location
        </Button>
      </div>
    </Card>
  );
};

export default WeatherIntegration;
