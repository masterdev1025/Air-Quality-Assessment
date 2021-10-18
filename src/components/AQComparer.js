import React, { useState, useEffect } from "react";
import { Grid, Label } from "semantic-ui-react";
import LocationSel from "./LocationSel";
import AirChart from "./AirChart";
import Settings from "../config/settings";
function AQComparer(props) {
  const [countries, setCountries] = useState([]);
  const [locationId1, setLocationId1] = useState(null);
  const [locationId2, setLocationId2] = useState(null);
  const [airData, setAirData] = useState(null);
  const [airData1, setAirData1] = useState(null);
  const colors = ['green', 'orange'];
  //Show result for compare;
  const getResult = async () => {
    var days = 7; // Days you want to subtract
    var date = new Date();
    var last = new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
    var d2 = last.getDate();
    var m2 = last.getMonth() + 1;
    var y2 = last.getFullYear();
    var date2 = `${y2}-${m2 < 10 ? `0${m2}` : m2}-${d2 < 10 ? `0${d2}` : d2}`;
    try {
      const airData = await fetch(
        `${
          Settings.BASE_URL
        }/averages?spatial=location&temporal=hour&location=${locationId1}&page=1&limit=1000&date_from=${encodeURIComponent(
          date2 + "T00:00:00+00:00"
        )}`
      );
      const airDataJsonData = await airData.json();
      const airD1 = airDataJsonData.results
        .filter((item, index) => index % 10 === 0)
        .map((item) => ({
          hour: new Date(item.hour).getTime(),
          value: item.average
        }));
      setAirData(airD1);
    } catch (error) {
      setAirData(null);
    }
    try {
      const airData1 = await fetch(
        `${
          Settings.BASE_URL
        }/averages?spatial=location&temporal=hour&location=${locationId2}&page=1&limit=1000&date_from=${encodeURIComponent(
          date2 + "T00:00:00+00:00"
        )}`
      );
      const airData1JsonData = await airData1.json();
      const airD2 = airData1JsonData.results
        .filter((item, index) => index % 10 === 0)
        .map((item) => ({
          hour: new Date(item.hour).getTime(),
          value: item.average
        }));
      setAirData1(airD2);
    } catch (error) {
      setAirData1(null);
    }
  };
  useEffect(() => {
    getResult();
    if( !locationId1 ){
      setAirData(null);
    }
    if( !locationId2 ){
      setAirData1(null);
    }
  }, [locationId1, locationId2]);
  //GET Contries;
  const getCountries = async () => {
    try {
      const contriesData = await fetch(
        `${Settings.BASE_URL}/countries?limit=200&page=1&offset=0&sort=asc&order_by=country`
      );
      const contriesJsonData = await contriesData.json();
      setCountries(contriesJsonData.results);
    } catch (error) {
      setCountries([]);
    }
  };
  useEffect(() => {
    getCountries();
  }, []);

  return (
    <div style = {{ display:'flex', justifyContent:'center',alignItems:'center',height:'100vh'}}>
      <div style = {{width: '800px'}}>
        <Grid columns={2} divided>
          <Grid.Column>
            <Label color = {colors[0]}>Location 1</Label>
            <LocationSel countries={countries} setLocationId={setLocationId1} />
          </Grid.Column>
          <Grid.Column>
            <Label color = {colors[1]}>Location 2</Label>
            <LocationSel countries={countries} setLocationId={setLocationId2} />
          </Grid.Column>
        </Grid>
        <div style={{ height: "500px", marginTop: '30px' }}>
          <AirChart
            startDate={new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)}
            endDate={new Date()}
            airData={airData}
            airData1={airData1}
            airColor1 = {colors[0]}
            airColor2 = {colors[1]}
          />
        </div>
      </div>
    </div>
  );
}

export default AQComparer;
