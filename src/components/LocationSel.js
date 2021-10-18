import React, { useState, useEffect } from "react";
import { Form } from "semantic-ui-react";
import Settings from "../config/settings";
function LocationSel(props) {
  //Make Country List;
  const [country, setCountry] = useState("");
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  //Render Country List;
  const renderConutryList = (countries) => {
    return (
      countries &&
      countries.map((country, index) => ({
        key: index,
        text: country.name,
        value: country.code
      }))
    );
  };
  //Render City List;
  const renderCityList = () => {
    let citiesTemp = {};
    for (let city of cities) {
      citiesTemp[city.city] = 1;
    }
    return citiesTemp
      ? Object.keys(citiesTemp).map((city, index) => ({
          value: city,
          text: city,
          key: `city-index-${index}`
        }))
      : [];
  };
  //Render Location List;
  const renderLocationList = () => {
    return cities
      .filter((_city) => _city.city === city)
      .map((item, index) => ({
        text: item.name,
        value: item.name,
        key: `location-index-${index}`
      }));
  };
  //GET City;
  const getCities = async () => {
    if (!country) return;
    try {
      const citiesData = await fetch(
        `${Settings.BASE_URL}/locations?limit=10000&country=${country}`
      );
      const citiesJsonData = await citiesData.json();
      setCities(
        citiesJsonData.results.map((item) => ({
          id: item.id,
          city: item.city ? item.city : "No listed city",
          name: item.name
        }))
      );
    } catch (error) {
      setCities([]);
    }
  };
  //Set Location Id;
  const getLocationId = (locationName) => {
    for (let city of cities) {
      if (city.name === locationName) return city.id;
    }
    return null;
  };
  useEffect(() => {
    getCities();
  }, [country]);
  const countryList = React.useMemo(() => renderConutryList(props.countries), [
    props.countries
  ]);
  return (
    <Form>
        <Form.Select
          fluid
          label="Country"
          options={countryList}
          placeholder="Select Country"
          onChange={(e, { value }) => {
            setCountry(value);
            setCity("");
            props.setLocationId(getLocationId(null));
          }}
          value={country}
          color = "#8884d8"
        />
        <Form.Select
          fluid
          label="City/Region"
          options={renderCityList()}
          placeholder="Select City/Region"
          onChange={(e, { value }) => {
            setCity(value);
            setLocation("");
            props.setLocationId(getLocationId(null));
          }}
          value={city}
        />
        <Form.Select
          fluid
          label="Location"
          options={renderLocationList()}
          placeholder="Select Location"
          onChange={(e, { value }) => {
            setLocation(value);
            props.setLocationId(getLocationId(value));
          }}
          value={location}
        />
    </Form>
  );
}

export default LocationSel;
