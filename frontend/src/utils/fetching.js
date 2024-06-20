// The same pattern is used for fetching data from the server repeatedly so those functions are placed here.

export function getData(url, setData, setLoading, setLoaded, setErrorMsg, setErrorState) {
    setLoading(true);
    return new Promise( (resolve, reject) => {
        fetch(url)
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
                    setLoading(false);
                    setLoaded(true);
                    resolve(true);
                },
                error =>{ 
                    if (error.message === "JSON.parse: unexpected character at line 1 column 1 of the JSON data") {
                        setErrorMsg("JSON Parse error");
                    }
                    if (error.message === "Forbidden") {
                        setErrorMsg("You do not have the correct privileges to few this");
                    }
                    if (error.message === "Not Found") {
                        setErrorMsg("Not implemented yet...");
                    }
                    setErrorState(true);
                    reject(false);
                }
            );
    });
}

export function postData(url, bodyContent, responseCallback) {
    const fetchProperties = {
        method : 'POST',
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(bodyContent)
    }
    fetch(url, fetchProperties)
        .then( response => {
            responseCallback(response);
        });
}

export function deleteResource(url, responseCallback) {
    const fetchProperties = {
        method : 'DELETE',
        headers : {
            "Content-Type" : "application/json"
        },
    }
    fetch(url, fetchProperties)
        .then( response => {
            responseCallback(response);
        });

}
