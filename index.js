var login = require('./lib/login.js'),
    track = require('./lib/track.js');

var t = (email, pword, orderId) => {
    return new Promise((resolve, reject) => {
        login(email, pword)
            .then(res => {
                track(res, orderId)
                    .then(tracking => {
                        resolve(tracking);
                    });
            }, rej => {
                reject(rej);
            })
    });
}

module.exports = t;
