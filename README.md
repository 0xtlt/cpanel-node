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

List addon Domains
```javascript
myCpanel.zoneAddDomain({
    regex: 'my regex', 
}).then(obj => {
    console.log(obj.response);
    console.log(obj.header);
});
```

Add a line to the zone file (that is, a domain record)
```javascript
myCpanel.zoneAddDomain({
    domain: 'example.com', // The zone file to work with
    name: "world",
    type: "type",
    address: "127.0.0.1",
    ttl: 7200 // optional
}).then(obj => {
    console.log(obj.response);
    console.log(obj.header);
});
```

Change _name_, _address_, _type_ and/or _ttl_ for a specific line in a zone file (that is, a domain record)
```javascript
myCpanel.zoneEditDomain({
    domain: 'example.com', // The zone file to work with
    line: 42, // The line (in the zone) to change
    name: "world", // optional
    address: "127.0.0.1", // optional
    type: "type", // optional
    ttl: 7200 // optional
}).then(obj => {
    console.log(obj.response);
    console.log(obj.header);
});

```
Remove a specific line in a zone file (that is, a domain record)
```javascript
myCpanel.zoneRemoveDomain({
    domain: 'example.com', // The zone file to work with
    line: 42, // The line (in the zone) to remove
}).then(obj => {
    console.log(obj.response);
    console.log(obj.header);
});
```