// The same pattern is used for fetching data from the server repeatedly so those functions are placed here.

import { sessionTokenKey } from "./constants";

export function getData(url, setData, setLoading, setLoaded, setErrorMsg, setErrorState) {
    const fetchOptions = {
        method : "GET",
        headers : {}
    }

    const authToken = sessionStorage.getItem(sessionTokenKey);
    if (authToken !== undefined) {
        fetchOptions.headers.Authorisation = `Bearer ${authToken}`;
    }

    if (setLoading !== undefined) {
        setLoading(true);
    }
    return new Promise( (resolve, reject) => {
        fetch(url, fetchOptions)
            .then( response => {
                if (response.status == 403) {
                    throw new Error ("Forbidden");

                }
                if (response.status == 404) {
                    throw new Error ("Not Found");
                }
                if (response.status == 200) {
                    return response.json();
                }
            })
            .then( 
                data => { 
                    setData(data);
                    if (setLoading !== undefined) {
                        setLoading(false);
                    }
                    if (setLoaded !== undefined) {
                        setLoaded(true);
                    }
                    resolve(true);
                },
                error =>{
                    if (setErrorMsg !== undefined && setErrorState !== undefined) {
                        if (error.message === "JSON.parse: unexpected character at line 1 column 1 of the JSON data") {
                            setErrorMsg("JSON Parse error");
                        }
                        if (error.message === "Forbidden") {
                            setErrorMsg("You do not have the correct privileges to view this");
                        }
                        if (error.message === "Not Found") {
                            setErrorMsg("Not implemented yet...");
                        }
                        setErrorState(true);
                    }
                    reject(false);
                }
            );
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
