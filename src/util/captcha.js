import axios from 'axios';
import {API_URL} from "./constants";

const fetchCaptcha = async () => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    let res = await axios.get(API_URL + "/captcha/generate", config);

    return res.data.data;
}

export default fetchCaptcha;