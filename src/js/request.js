function parseData(data) {
    let formdata = new FormData();
    for (let key in data) {
        formdata.append(key, data[key]);
    }
    return formdata;
}

function request(url, method, data = false, datatype = 'formdata') {
    return new Promise((resolve, reject) => {
        const options = {
            method: method,
        }
        if (data) {
            options.body = (datatype == 'json') ? JSON.stringify(data) : parseData(data);
        }
        fetch(url, options)
            .then(response => response.json())
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

export const getData = (url) => request(url, 'GET');
export const apiSync = (url, data) => request(url, 'POST', data);