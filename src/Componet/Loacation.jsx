import { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { CiLocationOn } from "react-icons/ci";
import { WiDaySunny, WiNightClear, WiThermometer } from "react-icons/wi";
import { FaMapMarkerAlt } from "react-icons/fa";

const AnyReactComponent = () => (
    <div className="flex flex-col items-center text-5xl text-red-500 p-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-bounce">
        <CiLocationOn />
    </div>
);

const CurrentWeatherData = () => {
    const [cityMain, setCityMain] = useState(null);
    const [lanLat, setCityLanLat] = useState(null);
    const [fail, setFailLocation] = useState(null);
    const [dataGetSet, setDataGetSet] = useState(null);
    const [search, setSearch] = useState('');
    const [citymain, setcity] = useState(null);
    const [lanlat, setcitylanlat] = useState(null);

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
        const urls = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=2a9db56c1dea4607a3b4e9e4e865c404`
        const respo = await fetch(urls);
        const resjosn = await respo.json();
        setcity(resjosn.results[0])
        setcitylanlat(`https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d7342.633047467606!2d${lon}!3d${lat}!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1689624379247!5m2!1sen!2sin`)

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
        setSearch('')
        navigator.geolocation.getCurrentPosition(getCurrentLocation, failLocation);
    };

    const handleApiLoaded = (map, maps) => {
        console.log(maps);
    };

    const isDayTime = new Date().getHours() >= 6 && new Date().getHours() < 18;

    return (
        <div className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-4 bg-background-image">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg mx-auto animate-fade-in">
                <div className="mb-6">
                    <input
                        type="search"
                        placeholder="Enter city name"
                        className="w-full p-3 border border-gray-300 rounded mb-4"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={currentLocation}>
                        Use Current Location
                    </button>
                </div>
                {dataGetSet && <p className="text-red-500 mb-4 animate-pulse">{dataGetSet}</p>}
                {fail && <p className="text-red-500 mb-4 animate-pulse">{fail}</p>}
                {!cityMain ? (
                    <p className="text-gray-700 animate-fade-in">No data found</p>
                ) : (
                    <div className="mt-4 bg-white p-6 rounded shadow-md animate-fade-in">
                        <div className="flex items-center justify-center mb-4">
                            {isDayTime ? (
                                <WiDaySunny className="text-yellow-500 text-6xl" />
                            ) : (
                                <WiNightClear className="text-blue-500 text-6xl" />
                            )}
                        </div>
                        {search.length !== 0 && (
                            <div className="mb-4">
                                <p className="text-lg font-semibold">City Name: <span className="font-bold">{search}</span></p>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center p-4 bg-gray-100 rounded shadow animate-fade-in">
                                <WiThermometer className="text-3xl text-blue-500 mr-2" />
                                <div>
                                    <p className="text-sm">Temp max:</p>
                                    <p className="text-lg font-bold">{cityMain?.temp_max}°C</p>
                                </div>
                            </div>
                            <div className="flex items-center p-4 bg-gray-100 rounded shadow animate-fade-in">
                                <WiThermometer className="text-3xl text-blue-500 mr-2" />
                                <div>
                                    <p className="text-sm">Temp min:</p>
                                    <p className="text-lg font-bold">{cityMain?.temp_min}°C</p>
                                </div>
                            </div>
                            <div className="flex items-center p-4 bg-gray-100 rounded shadow animate-fade-in">
                                <FaMapMarkerAlt className="text-3xl text-red-500 mr-2" />
                                <div>
                                    <p className="text-sm">Longitude:</p>
                                    <p className="text-lg font-bold">{lanLat?.lon}</p>
                                </div>
                            </div>
                            <div className="flex items-center p-4 bg-gray-100 rounded shadow animate-fade-in">
                                <FaMapMarkerAlt className="text-3xl text-red-500 mr-2" />
                                <div>
                                    <p className="text-sm">Latitude:</p>
                                    <p className="text-lg font-bold">{lanLat?.lat}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {search.length == 0 && citymain && (


                    <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
                        <p className="text-lg font-semibold mb-2">Address Details:</p>
                        <p className="text-sm text-gray-700">City: <span className="font-bold">{citymain["components"].city}</span></p>
                        <p className="text-sm text-gray-700">Continent: <span className="font-bold">{citymain["components"].continent}</span></p>
                        <p className="text-sm text-gray-700">Country: <span className="font-bold">{citymain["components"].country}</span></p>
                        <p className="text-sm text-gray-700">County: <span className="font-bold">{citymain["components"].county}</span></p>
                        <p className="text-sm text-gray-700">Pitch: <span className="font-bold">{citymain["components"].pitch}</span></p>
                        <p className="text-sm text-gray-700">Postcode: <span className="font-bold">{citymain["components"].postcode}</span></p>
                        <p className="text-sm text-gray-700">Road: <span className="font-bold">{citymain["components"].road}</span></p>
                        <p className="text-sm text-gray-700">State: <span className="font-bold">{citymain["components"].state}</span></p>
                        <p className="text-sm text-gray-700">State District: <span className="font-bold">{citymain["components"].state_district}</span></p>
                        <p className="text-sm text-gray-700">Suburb: <span className="font-bold">{citymain["components"].suburb}</span></p>
                        <p className="text-sm text-gray-700">Formatted: <span className="font-bold">{citymain["formatted"]}</span></p>
                        <p className="text-sm text-gray-700">Latitude: <span className="font-bold">{citymain["geometry"]["lat"]}</span></p>
                        <p className="text-sm text-gray-700">Longitude: <span className="font-bold">{citymain["geometry"]["lng"]}</span></p>
                    </div>
                )
                }
                {search.length === 0 && cityMain && (
                    <>
                        <iframe src={lanlat} className='mt-8 w-full h-96 animate-fade-in' >
                        </iframe>
                        <div className="mt-8 w-full h-96 animate-fade-in">
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
                    </>
                )}
            </div>
        </div>
    );
};

export default CurrentWeatherData;
