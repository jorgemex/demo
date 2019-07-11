import * as d3 from 'd3';

export namespace Request {
    export async function JSONRequest(reqURL: string, method: string, body: Object) {
        // console.log(reqURL);
        // console.log(body);
        return d3.json(reqURL, {
            method: method,
            body: JSON.stringify(body),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            }
        });
    }
}