import { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { CiLocationOn } from "react-icons/ci";

const AnyReactComponent = () => (
    <div className="flex flex-col items-center text-5xl text-red-500 p-2 rounded-full transform -translate-x-1/2 -translate-y-1/2">
        <CiLocationOn />
    </div>
);

const CurrentWeatherData = () => {
    const [cityMain, setCityMain] = useState(null);
    const [lanLat, setCityLanLat] = useState(null);
    const [fail, setFailLocation] = useState(null);
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
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-lg mx-auto">
                <div className="mb-6">
                    <input
                        type="search"
                        placeholder="Enter city name"
                        className="w-full p-3 border rounded mb-4"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className="w-full p-3 bg-blue-500 text-white rounded" onClick={currentLocation}>
                        Use Current Location
                    </button>
                </div>
                {dataGetSet && <p className="text-red-500 mb-4">{dataGetSet}</p>}
                {fail && <p className="text-red-500 mb-4">{fail}</p>}
                {!cityMain ? (
                    <p className="text-gray-700">No data found</p>
                ) : (
                    <div className="mt-4 bg-white p-6 rounded shadow-md">
                        {search.length !== 0 && (
                            <div className="mb-4">
                                <p className="text-lg font-semibold">City Name: <span className="font-bold">{search}</span></p>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm">Temp max:</p>
                                <p className="text-lg font-bold">{cityMain?.temp_max}°C</p>
                            </div>
                            <div>
                                <p className="text-sm">Temp min:</p>
                                <p className="text-lg font-bold">{cityMain?.temp_min}°C</p>
                            </div>
                            <div>
                                <p className="text-sm">Longitude:</p>
                                <p className="text-lg font-bold">{lanLat?.lon}</p>
                            </div>
                            <div>
                                <p className="text-sm">Latitude:</p>
                                <p className="text-lg font-bold">{lanLat?.lat}</p>
                            </div>
                        </div>
                    </div>
                )}
                {search.length === 0 && cityMain && (
                    <div className="mt-8 w-full h-96">
                        <GoogleMapReact
                            yesIWantToUseGoogleMapApiInternals
                            onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                            bootstrapURLKeys={{ key: "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg" }}
                            defaultCenter={defaultProps.center}
                            defaultZoom={defaultProps.zoom}
                        >
                            <AnyReactComponent
                                lat={lanLat?.lat}
                                lng={lanLat?.lon}
                            />
                        </GoogleMapReact>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CurrentWeatherData;
