import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { CiLocationOn } from "react-icons/ci";

const AnyReactComponent = ({ text }) => (
  <div className="flex flex-col items-center text-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2">
    <CiLocationOn className='text-5xl' />
  </div>
);

const CurrentWeatherData = () => {
  const [cityMain, setCityMain] = useState(null);
  const [lanLat, setCityLanLat] = useState(null);
  const [fail, setFailLocation] = useState(null);
  const [dataMap, setDataMap] = useState(null);
  const [dataGetSet, setDataGetSet] = useState(null);
  const [search, setSearch] = useState('');

  const defaultProps = {
    center: {
      lat: 23.0599,
      lng: 72.5612
    },
    zoom: 15
  };

  useEffect(() => {
    const findCity = async () => {
      if (search) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=e322d30c923c4f26c82811389689a883`;
        const response = await fetch(url);
        const json = await response.json();
        setCityMain(json.main);
        setCityLanLat(json.coord);
      }
    };

    findCity();
  }, [search]);

  const currentLocationData = async (lat, lon) => {
    setDataMap(`https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d7342.633047467606!2d${lon}!3d${lat}!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1689624379247!5m2!1sen!2sin`);

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=6db7852bc3356870fcc7e4a0acec2839`;
    const response = await fetch(url);
    const json = await response.json();
    setCityMain(json.main);
    setCityLanLat(json.coord);
    setDataGetSet('');
  };

  const getCurrentLocation = async (position) => {
    await currentLocationData(position.coords.latitude, position.coords.longitude);
    setFailLocation('');
  };

  const failLocation = () => {
    setFailLocation('Current Location Error');
  };

  const currentLocation = async () => {
    setDataGetSet('wait');
    navigator.geolocation.getCurrentPosition(getCurrentLocation, failLocation);
  };

  const handleApiLoaded = (map, maps) => {
    console.log(maps);
  };

  return (
    <>
      <div className="p-10">
        <input
          type="search"
          placeholder="Any city name"
          className="border p-2 rounded"
          value={search}
          onChange={(e) => { setSearch(e.target.value); }}
        />
        <button className="ml-4 p-2 bg-blue-500 text-white rounded" onClick={currentLocation}>Current Location</button>
        <br />
        <span className="text-red-500">{dataGetSet}</span>
        <br />
        <span className="text-red-500">{fail}</span>
        {!cityMain ? <p>No data found</p> : (
          <div>
            {search.length !== 0 && <p>City Name is <span className="font-bold">{search}</span></p>}
            <p>Temp max: <span className="font-bold">{cityMain?.temp_max}°C</span></p>
            <p>Temp min: <span className="font-bold">{cityMain?.temp_min}°C</span></p>
            <p>Lon: <span className="font-bold">{lanLat?.lon}</span></p>
            <p>Lat: <span className="font-bold">{lanLat?.lat}</span></p>
          </div>
        )}
        {cityMain && (
          <div className="mt-8">
            {/* <iframe
              src={dataMap}
              className="w-full max-w-lg h-96 mb-8"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe> */}
            <div style={{ height: '100vh', width: '100%' }}>
              <GoogleMapReact
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                bootstrapURLKeys={{ key: "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg" }}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
              >
                <AnyReactComponent
                  lat={23.0599}
                  lng={72.5612}
                  text="My Marker"
                />
              </GoogleMapReact>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CurrentWeatherData;
