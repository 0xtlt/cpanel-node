const request = require("request");

const tif = function(a, b){
    return (typeof a === b);
};

class CPanel {
    constructor(options){
        if(options === undefined || !tif(options, "object") || !tif(options.host, "string") || !tif(options.user, "string") || !tif(options.pass, "string") || !tif(options.https, "boolean") || !tif(options.port, "string"))
            throw new Error("The params option<Object> must be completed with host<String>, user<String>, pass<String>, https<Boolean>, port<String>");

        this.options = options;
    }

    login(module, func, values = []) {
        const me = this;
        return new Promise(function(resolve, reject) {
            let value = '';
            values.forEach((v) => {
                value += encodeURI('&'+Object.keys(v))+'='+encodeURI(v[Object.keys(v)])
            });

            let call = '/json-api/cpanel?cpanel_jsonapi_user='+me.options.user;
                call += '&cpanel_jsonapi_apiversion=2&cpanel_jsonapi_module='+module;
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

    emailAddpop(options){
        const me = this;
        return new Promise(function(resolve, reject) {
            if(!tif(options, "object") || !tif(options.domain, "string") || !tif(options.email, "string") || !tif(options.password, "string") || !tif(options.quota, "number"))
                return reject(new Error("The params options<Object> must be completed with domain<String>, email<String>, password<String>, quota<Number>"));

            me.login('Email', 'addpop', [{ domain: options.domain },{ email: options.email },{ password: options.password }, { quota: options.quota }]).then(function(obj) {
                return resolve(obj);
            }, function(err) {
                return reject(err);
            });
        });
    };

    emailDelpop(options){
        const me = this;
        return new Promise(function(resolve, reject) {
            if(!tif(options, "object") || !tif(options.email, "string") || !tif(options.domain, "string"))
                throw new Error("The params options<Object> must be completed with email<String>, domain<String>");

            me.login('Email', 'delpop', [{ email: options.email }, { domain: options.domain }]).then(function(obj) {
                return resolve(obj);
            }, function(err) {
                return reject(err);
            });
        });
    }

    emailPasswdpop(options){
        const me = this;
        return new Promise(function(resolve, reject){
            if(!tif(options, "object") || !tif(options.email, "string") || !tif(options.domain, "string") || !tif(options.password, "string"))
                throw new Error("The params options<Object> must be completed with email<String>, domain<String>, password<String>");

            me.login('Email', 'passwdpop', [{email: options.email},{password: options.password}, {domain: options.domain}]).then(function (obj) {
               return resolve(obj);
            }, function (err) {
                return reject(err);
            });
        });
    }

    emailEditpopQuota(options){
        const me = this;
        return new Promise(function(resolve, reject){
            if(!tif(options, "object") || !tif(options.email, "string") || !tif(options.domain, "string") || !tif(options.quota, "number"))
                throw new Error("The params options<Object> must be completed with email<String>, domain<String>, quota<Number>");

            me.login('Email', 'editquota', [{email: options.email},{quota: options.quota}, {domain: options.domain}]).then(function (obj) {
               return resolve(obj);
            }, function (err) {
                return reject(err);
            });
        });
    }
    
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

    zoneFetchZone(options){
        const me = this;
        return new Promise(function(resolve, reject){
            if(!tif(options, "object") || !tif(options.domain, "string") || !tif(options.name, "string") || !tif(options.type, "string"))
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
     */
    listAddonDomains(options){
        const me = this;
        return new Promise(function(resolve, reject){
            if(!tif(options, "object") || !tif(options.regex, "string")){
                options = {
                    regex: ''
                };
            }

            // List the account's addon domains.
            me.login('AddonDomain', 'listaddondomains', [{ regex: options.regex }]).then(function (obj) {
                return resolve(obj);
            }, function (err) {
                return reject(err);
            });
        });
    }

    /**
     * Add domain
     */
    zoneAddDomain(options) {
        const me = this;
        return new Promise(function (resolve, reject) {
            if (!tif(options, "object") || !tif(options.domain, "string") || !tif(options.name, "string") || !tif(options.type, "string") || !tif(options.address, "string"))
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
    */
    zoneEditDomain(options) {
    const me = this;
    return new Promise(function (resolve, reject) {
        if (!tif(options, "object") || !tif(options.domain, "string") || !tif(options.line, "number"))
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
    */
    zoneRemoveDomain(options) {
        const me = this;
        return new Promise(function (resolve, reject) {
            if (!tif(options, "object") || !tif(options.domain, "string") || !tif(options.line, "number"))
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
