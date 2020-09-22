import { MenuItem, FormControl, Select, Card, CardContent } from '@material-ui/core';
import React, { useEffect, useState} from 'react';
import './App.css';
import axios from 'axios'
import InfoBox from './InfoBox'
import Map from './Map'
import Table from './table'
import { sortData } from './util'
import 'leaflet/dist/leaflet.css'
import moment from 'moment';

function App() {
  //state = how to write a variable in react

  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('Worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796})
  const [mapZoom, setMapZoom] = useState(3)
  const [updatedAt, setUpdatedAt] = useState()
  //USEEFFECT = Runs a piece of code based on a given condition

  useEffect(() => {
    // if [] - the code insdide here will run once when the component loads once
    
    const getCountriesData = async () => {
      await axios.get("https://disease.sh/v3/covid-19/countries").then( response => { 
        
      const countries = response.data.map( country => ({
          name: country.country,
          value: country.countryInfo.iso2
      }))
      
      const sortedData = sortData(response.data)
      
      setTableData(sortedData) 
      
      setCountries(countries)
      })
    }

    getCountriesData()
  
  }, [])

  useEffect( ( ) => {
    axios.get('https://disease.sh/v3/covid-19/all').then( respopnse => {
      setCountryInfo(respopnse.data)
      setUpdatedAt(respopnse.data.updated)
    })
  },[])

  const onCountryChange = async (event) => {
    const countryCode = event.target.value

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}?strict=true`
  
    await axios.get(url).then( response => {
      console.log(response.data)
      setCountry(countryCode)
      setCountryInfo(response.data)
      setMapCenter([response.data.countryInfo.lat, response.data.countryInfo.long])
      setMapZoom(4)
    })
  }

  const changeTime = (val) => {
    return moment.unix(val).format('MMMM Do, h:mm:ss a')
  }

  return (
    <div>
      <div className="App">
      <div className="app__left">
      <div className="app__header">
      <div>
        <h1>Covid-19 Tracker</h1>
      </div>
      <div>
        <h4>Last updated at: </h4>
        <h6>{changeTime(updatedAt)}</h6>
      </div>
      <FormControl className="app_dropdown">
        <Select variant="outlined" onChange={onCountryChange} value={country}>
          <MenuItem value="Worldwide">Worldwide</MenuItem>
          {countries.map((country) => (
            <MenuItem value={country.value}>{country.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      </div>
      <div className="app__stats">
        <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases}></InfoBox>
        <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered}></InfoBox>
        <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}></InfoBox>
      </div>
      <Map 
      center = {mapCenter}
      zoom = {mapZoom}
      />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live cases by country</h3>
          <Table countries={tableData} />
        </CardContent>
      </Card>
    </div>
    <div className='bottomText'>
    <h4>Hey I am Aman! Our world is badly effected by this virus. I pray to God that all of you will stay safe and healthy. I made this to keep track of this deadly virus handy</h4>
    </div>
   </div>
  );
}

export default App;
