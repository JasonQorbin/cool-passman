// The same pattern is used for fetching data from the server repeatedly so those functions are placed here.

import { sessionTokenKey } from "./constants";

export function getData(url, setData, setLoading, setLoaded, errorCallback) {
    const fetchOptions = {
        method : "GET",
        headers : {}
    }
    
    //If we have been issued a auth token then attach it to the request.
    const authToken = sessionStorage.getItem(sessionTokenKey);
    if (authToken !== undefined) {
        fetchOptions.headers.Authorisation = `Bearer ${authToken}`;
    }

    if (setLoading) {
        setLoading(true);
    }
    
    fetch(url, fetchOptions).then( response => {
        if (response.status == 200) {
            response.json().then( data => { 
                setData(data);
                if (setLoading) {
                    setLoading(false);
                }
                if (setLoaded) {
                    setLoaded(true);
                }
            });
        } else {
            if (errorCallback) {
               errorCallback(response); 
            }
        }
    });
}

export function postData(url, bodyContent, responseCallback) {
    const fetchOptions = {
        method : 'POST',
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(bodyContent)
    }

    const authToken = sessionStorage.getItem(sessionTokenKey);
    if (authToken !== undefined) {
        fetchOptions.headers.Authorisation = `Bearer ${authToken}`;
    }

    fetch(url, fetchOptions)
        .then( response => {
            responseCallback(response, bodyContent);
        });
}

export function patchData(url, bodyContent, responseCallback) {
    const fetchOptions = {
        method : 'PATCH',
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(bodyContent)
    }

    const authToken = sessionStorage.getItem(sessionTokenKey);
    if (authToken !== undefined) {
        fetchOptions.headers.Authorisation = `Bearer ${authToken}`;
    }

    fetch(url, fetchOptions)
        .then( response => {
            responseCallback(response, bodyContent);
        });
}

export function putData(url, bodyContent, responseCallback) {
    const fetchOptions = {
        method : 'PUT',
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(bodyContent)
    }

    const authToken = sessionStorage.getItem(sessionTokenKey);
    if (authToken !== undefined) {
        fetchOptions.headers.Authorisation = `Bearer ${authToken}`;
    }

    fetch(url, fetchOptions)
        .then( response => {
            responseCallback(response, bodyContent);
        });
}

export function deleteResource(url, responseCallback) {
    const fetchOptions = {
        method : 'DELETE',
        headers : {
            "Content-Type" : "application/json"
        },
    }

    const authToken = sessionStorage.getItem(sessionTokenKey);
    if (authToken !== undefined) {
        fetchOptions.headers.Authorisation = `Bearer ${authToken}`;
    }

    fetch(url, fetchOptions)
        .then( response => {
            responseCallback(response);
        });

}
