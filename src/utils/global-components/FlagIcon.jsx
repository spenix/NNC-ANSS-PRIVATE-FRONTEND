import  "flag-icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect} from "react";

import { getCountryDetails } from "../../redux/users/usersActions";

export default function FlagIcon ({country}) {
    const [countryDetail, setCountryDetail] = useState([]);
    useEffect(() => {
        if(country) {
            axios
            .get(`https://restcountries.com/v3.1/name/${country}`)
            .then((response) => {
                const {data} = response;
                setCountryDetail(data)
            });
        }
    }, [country])
        return (
            <>
                {
                    countryDetail.length ? (<span className={"fi fi-"+((countryDetail[0]?.cca2).toLowerCase())} />) : ""
                }
            </>
        );
    
}