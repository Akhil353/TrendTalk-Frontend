export var uri;
if (location.hostname === "localhost") {
        uri = "http://localhost:8086/";
} else if (location.hostname === "127.0.0.1") {
        uri = "http://127.0.0.1:8086/";
} else if (location.hostname === "0.0.0.0") {
        uri = "http://0.0.0.0:4100/"
} else {
        uri = "http://localhost:8086/";
}

export const options = {
    method: "GET", 
    mode: 'cors', 
    cache: 'default',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
    },
};