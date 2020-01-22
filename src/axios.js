import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://perpbiz-9bebe.firebaseio.com'
});

export default instance