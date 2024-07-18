import { useEffect, useState } from 'react';
// import GoogleMapReact from 'google-map-react';

// const AnyReactComponent = ({ text }) => <div>{text}</div>;
const Current_weather_data = () => {
    const [citymain, setcity] = useState(null);
    const [lanlat, setcitylanlat] = useState(null);
    const [fail, setfaillocatin] = useState(null);
    const [datamap, setdatamap] = useState(null);
    const [datagetset, setdatagetset] = useState(null);
    const [search, setsearch] = useState('');
    // const defaultProps = {
    //     center: {
    //         lat: 10.99835602,
    //         lng: 77.01502627
    //     },
    //     zoom: 11
    // };
    useEffect(() => {
        const findcity = async () => {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=e322d30c923c4f26c82811389689a883`;
            const respo = await fetch(url);
            const resjosn = await respo.json();
            setcity(resjosn.main)
            setcitylanlat(resjosn.coord)
        }

        findcity();
    }, [search])
    const CurrentLocationdat = async (lon, lat) => {
        setdatagetset("wait")
        setdatamap(`https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d7342.633047467606!2d${lon}!3d${lat}!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1689624379247!5m2!1sen!2sin`)

        const urls = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=6db7852bc3356870fcc7e4a0acec2839`
        const respo = await fetch(urls);
        const resjosn = await respo.json();
        setcity(resjosn.main)
        setcitylanlat(resjosn.coord)
        setdatagetset("")


    }
    const getCurrentLocation = async (Position) => {
        await CurrentLocationdat(Position["coords"]["latitude"], Position["coords"]["longitude"])
        setfaillocatin("")
    }
    const faillocatin = () => {
        setfaillocatin("Current Location Error")
    }
    const CurrentLocation = async () => {
        navigator.geolocation.getCurrentPosition(getCurrentLocation, faillocatin)
    }
    console.log(datamap);
    return (
        <>
            <div className="p-10">
                <input type="search" placeholder='Any city name' className='border' value={search} onChange={(e) => { setsearch(e.target.value) }} />
                <button onClick={CurrentLocation}>Current Location</button>
                <br />
                <span className='failclass'>{datagetset}</span>
                <br />
                <span className='failclass'>{fail}</span>
                {!citymain ? <p>no data found</p> : <div>
                    {search.length !== 0 ?
                        <p>City Name is <span className='weather'>{search}</span></p>
                        :
                        ""
                    }
                    <p>temp_max is <span className='weather'>{citymain["temp_max"]}</span>Cel</p>
                    <p>temp_min is <span className='weather'>{citymain["temp_min"]}</span>Cel</p>
                    <p>Lon  <span className='weather'>{lanlat['lon']}</span></p>
                    <p>Lat  <span className='weather'>{lanlat['lat']}</span></p>

                </div>}
                {
                    citymain &&
                    <div className="">
                        <iframe src={datamap}
                            width="600" height="450" allowfullscreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                        <iframe className='w-full max-h-96' ></iframe>
                    </div>
                    // <div style={{ height: '100vh', width: '100%' }}>
                    //     <GoogleMapReact
                    //         // https://maps.googleapis.com/maps/api/js?key=&libraries=places&callback=initMap
                    //         bootstrapURLKeys={{ key: "AIzaSyBxMFGggAwRDGvDEegqhvystV88sQeZ-xY" }}
                    //         defaultCenter={defaultProps.center}
                    //         defaultZoom={defaultProps.zoom}
                    //     >
                    //         <AnyReactComponent
                    //             lat={59.955413}
                    //             lng={30.337844}
                    //             text="My Marker"
                    //         />
                    //     </GoogleMapReact>
                    // </div>
                }
            </div >
        </>
    );
};

export default Current_weather_data;
