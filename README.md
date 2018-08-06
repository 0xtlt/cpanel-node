# Cpanel-node
Cpanel-node is designed to be simplest way possible to make api request to Cpanel.

## Installation
	$ npm install cpanel-node
	
## Usage
```javascript
const cpanelAPI = require('cpanel-node');
const options = {
    url: 'whm.example.com',
    user: 'CPANEL_USERNAME',
    pass: 'CPANEL_PASSWORD',
    https: true, //https is advisable
    port: "2083" //default port of cpanel
};

let myCpanel = new cpanelAPI(options);
```

## API
Create email address
```javascript
myCpanel.emailAddpop({
    domain: 'example.com',
    email: "thebest",
    password: "*******",
    quota: 150 //Mo
}, function (response, header) {
    console.log(response);
});
```

Remove email address
```javascript
myCpanel.emailDelpop({
    domain: 'example.com',
    email: 'thebest'
}, function (response, header) {
    console.log(response);
});
```