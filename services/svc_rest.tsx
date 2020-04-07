import axios from 'axios'

axios.interceptors.response.use(response => {
    // Everything went well.  
    // Can return full response (response) or only relevant data via response.data (if preferred)
    return response;
}, error => {

    //console.log("Error", error.message);
    let message = "Something occurred in setting up the request that caused an error";

    if (error.response) {

        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

        // console.log(error.response.data.message);
        // console.log(error.response.status);
        message = error.response.data.message;

    } else if (error.request) {

        // The request was made but no response was received
        // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js

        // console.log(error.request);
        message = "The request was made, but no response was provided back.";
    }

    return { error: message };
});

export default {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete
}