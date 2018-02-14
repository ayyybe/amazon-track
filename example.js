var track = require('./index.js');

//=================================================
var email = 'my@email.com',
    password = 'amazon/p@ssword',
    orderId = '113this983is00a73call711for70help51';
//=================================================

var startTime = Date.now();
track(email, password, orderId)
    .then(tracking => {
        console.log(require('util').inspect(tracking, false, null));
        console.log('\n\nRUNTIME:', (Date.now() - startTime) / 1000 + 's');
    }, rej => {
        console.log(rej);
    });
