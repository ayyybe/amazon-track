var cheerio = require('cheerio'),
    request = require('request'),
    rp = require('request-promise');

//===================================//
// Just a messy login implementation //
//===================================//

var lpHeaders = inHeaders = lsHeaders = {
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9'
};
inHeaders['Cache-Control'] = lsHeaders['Cache-Control'] = 'max-age=0';
lsHeaders['Origin'] = 'https://www.amazon.com';
lsHeaders['Referer'] = 'https://www.amazon.com/ap/signin';

var getHiddenVals = $ => {
    var a = {},
        b = $('form[name="signIn"]>input[type="hidden"]');
    for (var i = 0; i < b.length; i++) {
        var e = $(b[i]);
        a[e.attr('name')] = e.attr('value');
    }
    return a;
};

var login = (email, pword, cookieJar) => {
    !cookieJar && (cookieJar = request.jar());
    return new Promise((resolve, reject) => {
        rp('https://www.amazon.com/', {
                jar: cookieJar,
                headers: inHeaders,
                gzip: true,
                simple: false
            })
            .then(
                () => {
                    rp('https://developer.amazon.com/ap_login.html', {
                            jar: cookieJar,
                            headers: lpHeaders,
                            gzip: true,
                            simple: false,
                            transform: body => {
                                return cheerio.load(body);
                            }
                        })
                        .then($ => {
                            var body = getHiddenVals($);
                            body.prepopulatedLoginId = '';
                            body.email = email;
                            body.create = 0;
                            body.password = pword;
                            rp.post('https://www.amazon.com/ap/signin', {
                                jar: cookieJar,
                                form: body,
                                headers: lsHeaders,
                                simple: false,
                                gzip: true,
                                followRedirect: true
                            }).then(() => {
                                resolve(cookieJar);
                            });
                        })
                        .catch(err => {
                            reject(err);
                        });

                }
            )
            .catch(err => {
                reject(err);
            });
    });
};

module.exports = login;
