# Cpanel-node 🌌
Cpanel-node is designed to be simplest way possible to make api request to Cpanel.

## Installation 🚀
	$ npm install cpanel-node

## Usage 💬
```javascript
const cpanelAPI = require('cpanel-node');
const options = {
    host: 'whm.example.com',
    user: 'CPANEL_USERNAME',
    pass: 'CPANEL_PASSWORD',
    https: true, //https is advisable
    port: "2083" //default port of cpanel
};

let myCpanel = new cpanelAPI(options);
```

## API 🔨
Create email address
```javascript
myCpanel.emailAddpop({
    domain: 'example.com',
    email: "thebest",
    password: "*******",
    quota: 150 //Mo
}).then(obj => {
    console.log(obj.response);
    console.log(obj.header);
});
```

Remove email address
```javascript
myCpanel.emailDelpop({
    domain: 'example.com',
    email: 'thebest'
}).then(obj => {
    console.log(obj.response);
    console.log(obj).header);
});
```

Change email password
```javascript
myCpanel.emailPasswdpop({
    domain: 'example.com',
    email: "thebest",
    password: "*******"
}).then(obj => {
    console.log(obj.response);
    console.log(obj.header);
});
```

Change email quota
```javascript
myCpanel.emailEditpopQuota({
    domain: 'example.com',
    email: "thebest",
    quota: 50//Mo
}).then(obj => {
    console.log(obj.response);
    console.log(obj.header);
});
```

Retrieve a zone file
```javascript
myCpanel.zoneFetchZone({
    domain: 'example.com',
    name: "world",
    type: "type"
}).then(obj => {
    console.log(obj.response);
    console.log(obj.header);
});
```

Get all of the account's zone files
```javascript
myCpanel.zoneFetchZones().then(obj => {
    console.log(obj.response);
    console.log(obj.header);
});
```