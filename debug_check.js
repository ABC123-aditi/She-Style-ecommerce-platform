const http = require('http');

function makeRequest(path, method, body) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                resolve({ status: res.statusCode, body: data });
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function run() {
    console.log("Checking / ...");
    try {
        const root = await makeRequest('/', 'GET');
        console.log("Root status:", root.status);
        console.log("Root body:", root.body);
    } catch (e) {
        console.log("Root failed:", e.message);
    }

    console.log("\nChecking /api/register ...");
    try {
        const reg = await makeRequest('/api/register', 'POST', {
            name: "Debug user",
            email: "debug_" + Date.now() + "@test.com",
            password: "password"
        });
        console.log("Register status:", reg.status);
        console.log("Register body:", reg.body);
    } catch (e) {
        console.log("Register failed:", e.message);
    }
}

run();
