const request = require("request");

/**
 * @param {*} a 
 * @param {*} b
 * 
 * @returns {boolean}
 */
const tif = function(a, b){
    return (typeof a === b);
};

/**
 * @param {any} [testedValues]
 * 
 * @returns {boolean}
 */
const tifEvolved = function(testedValues){
    let isOkay = true;

    if(testedValues.length % 2 === 1)
        return false;

    for(let i = 0; i < testedValues.length; i+=2){
        if(typeof testedValues[i] !== testedValues[i+1]){
            isOkay = false;
        }
    }

    return isOkay;
}

class CPanel {
    /**
     * @param {object} options
     * @param {string} options.host
     * @param {string} options.user
     * @param {string} options.pass
     * @param {string} options.boolean
     * @param {string} options.port
     */
    constructor(options){
        if(!tifEvolved([options, "object", options.host, "string", options.user, "string", options.pass, "string", options.https, "boolean", options.port, "string"]))
            throw new Error("The params option<Object> must be completed with host<String>, user<String>, pass<String>, https<Boolean>, port<String>");

        this.options = options;
    }

    /**
     * @param {string} module_ 
     * @param {string} func 
     * @param {object} values
     * 
     * @returns {Promise}
     */
    login(module_, func, values = []) {
        const me = this;
        return new Promise(function(resolve, reject) {
            let value = '';
            values.forEach((v) => {
                value += encodeURI('&'+Object.keys(v))+'='+encodeURI(v[Object.keys(v)])
            });

            let call = '/json-api/cpanel?cpanel_jsonapi_user='+me.options.user;
                call += '&cpanel_jsonapi_apiversion=2&cpanel_jsonapi_module='+module_;
                call += '&cpanel_jsonapi_func='+func;
                call += value;

            const query = encodeURI((me.options.https ? "https://" : "http://")+me.options.host+':'+me.options.port+call);
            request({
                url: query,
                headers: {
                    "Authorization": "Basic " + Buffer.from(`${me.options.user}:${me.options.pass}`).toString('base64')
                }
            }, function (err, head, body) {
                if (err) return reject(err);
                return resolve({ response: body, header: head });
            })
        });
    };


    /**
     * @param {object} options
     * @param {string} option.domain
     * @param {string} option.email
     * @param {string} option.password
     * @param {number} option.quota
     * 
     * @returns {Promise}
     */
    emailAddpop(options){
        const me = this;
        return new Promise(function(resolve, reject) {
            if(!tifEvolved([options, "object", options.domain, "string", options.email, "string", options.password, "string", options.quota, "number"]))
                return reject(new Error("The params options<Object> must be completed with domain<String>, email<String>, password<String>, quota<Number>"));

            me.login('Email', 'addpop', [{ domain: options.domain },{ email: options.email },{ password: options.password }, { quota: options.quota }]).then(function(obj) {
                return resolve(obj);
            }, function(err) {
                return reject(err);
            });
        });
    };

    /**
     * @param {object} options
     * @param {string} options.email
     * @param {string} options.domain
     * 
     * @returns {Promise}
     */
    emailDelpop(options){
        const me = this;
        return new Promise(function(resolve, reject) {
            if(!tifEvolved([options, "object", options.email, "string", options.domain, "string"]))
                throw new Error("The params options<Object> must be completed with email<String>, domain<String>");

            me.login('Email', 'delpop', [{ email: options.email }, { domain: options.domain }]).then(function(obj) {
                return resolve(obj);
            }, function(err) {
                return reject(err);
            });
        });
    }

    /**
     * @param {object} options
     * @param {string} options.email
     * @param {string} options.domain
     * @param {string} options.password
     * 
     * @returns {Promise}
     */
    emailPasswdpop(options){
        const me = this;
        return new Promise(function(resolve, reject){
            if(!tifEvolved([options, "object", options.email, "string", options.domain, "string", options.password, "string"]))
                throw new Error("The params options<Object> must be completed with email<String>, domain<String>, password<String>");

            me.login('Email', 'passwdpop', [{email: options.email},{password: options.password}, {domain: options.domain}]).then(function (obj) {
               return resolve(obj);
            }, function (err) {
                return reject(err);
            });
        });
    }

    /**
     * @param {object} options
     * @param {string} options.email
     * @param {string} options.domain
     * @param {number} options.quota
     * 
     * @returns {Promise}
     */
    emailEditpopQuota(options){
        const me = this;
        return new Promise(function(resolve, reject){
            if(!tifEvolved([options, "object", options.email, "string", options.domain, "string", options.quota, "number"]))
                throw new Error("The params options<Object> must be completed with email<String>, domain<String>, quota<Number>");

            me.login('Email', 'editquota', [{email: options.email},{quota: options.quota}, {domain: options.domain}]).then(function (obj) {
               return resolve(obj);
            }, function (err) {
                return reject(err);
            });
        });
    }
    
    /**
     * @returns {Promise}
     */
    zoneFetchZones(){
        const me = this;
        return new Promise(function(resolve, reject){
            me.login('ZoneEdit', 'fetchzones').then(function (obj) {
               return resolve(obj);
            }, function (err) {
                return reject(err);
            });
        });
    }

    /**
     * @param {object} options
     * @param {string} options.domain
     * @param {string} options.name
     * @param {string} options.type
     * 
     * @returns {Promise}
     */
    zoneFetchZone(options){
        const me = this;
        return new Promise(function(resolve, reject){
            if(!tifEvolved([options, "object", options.domain, "string", options.name, "string", options.type, "string"]))
                throw new Error("The params options<Object> must be completed with domain<String>, name<String>, type<String>");

            me.login('ZoneEdit', 'fetchzone',[{domain: options.domain},{name: options.name},{type: options.type}]).then(function (obj) {
               return resolve(obj);
            }, function (err) {
                return reject(err);
            });
        });
    }

    /**
     * Addons domains
     * @param {regex} regex
     * 
     * @returns {Promise}
     */
    listAddonDomains(regex = ""){
        const me = this;
        return new Promise(function(resolve, reject){
            // List the account's addon domains.
            me.login('AddonDomain', 'listaddondomains', [{ regex }]).then(function (obj) {
                return resolve(obj);
            }, function (err) {
                return reject(err);
            });
        });
    }

    /**
     * Add domain
     * @param {object} options
     * @param {string} options.domain
     * @param {string} options.name
     * @param {string} options.type
     * @param {string} options.address
     * @param {number} options.ttl
     * 
     * @returns {Promise}
     */
    zoneAddDomain(options) {
        const me = this;
        return new Promise(function (resolve, reject) {
            if (!tifEvolved([options, "object", options.domain, "string", options.name, "string", options.type, "string", options.address, "string"]))
                throw new Error("The params options<Object> must be completed with domain<String>, name<string>, type<string> and address<string>");

            let values = [{ domain: options.domain }, { name: options.name }, { type: options.type }, { address: options.address }];

            if (tif(options.ttl, "number"))
                values.push({ ttl: options.ttl });

            me.login('ZoneEdit', 'add_zone_record', values).then(function (obj) {
                return resolve(obj);
            }, function (err) {
                return reject(err);
            });
        });
    }
    
    /** 
     * Edit domain
     * @param {object} options
     * @param {string} options.domain
     * @param {number} options.line
     * @param {string} options.address
     * @param {string} options.type
     * @param {string} options.name
     * @param {number} options.ttl
     * 
     * @returns {Promise}
    */
    zoneEditDomain(options) {
    const me = this;
    return new Promise(function (resolve, reject) {
        if (!tifEvolved([options, "object", options.domain, "string", options.line, "number"]))
            throw new Error("The params options<Object> must be completed with domain<String> and Line<number>");

        let values = [{ domain: options.domain }, { line: options.line }];

        if (tif(options.address, "string"))
            values.push({ address: options.address });

        if (tif(options.type, "string"))
            values.push({ type: options.type });

        if (tif(options.name, "string"))
            values.push({ name: options.name });

        if (tif(options.ttl, "number"))
            values.push({ ttl: options.ttl });

        me.login('ZoneEdit', 'edit_zone_record', values).then(function (obj) {
            return resolve(obj);
        }, function (err) {
            return reject(err);
        });

    });
}

    /** 
     * Remove domain
     * @param {object} options
     * @param {string} options.domain
     * @param {number} options.line
     * 
     * @returns {Promise}
    */
    zoneRemoveDomain(options) {
        const me = this;
        return new Promise(function (resolve, reject) {
            if (!tifEvolved([options, "object", options.domain, "string", options.line, "number"]))
                throw new Error("The params options<Object> must be completed with domain<String> and Line<number>");

            let values = [{ domain: options.domain }, { line: options.line }];

            me.login('ZoneEdit', 'remove_zone_record', values).then(function (obj) {
                return resolve(obj);
            }, function (err) {
                return reject(err);
            });

        });
    }
}

module.exports = CPanel;
