var login = require('./login.js'),
    rp = require('request-promise'),
    cheerio = require('cheerio');

var track = (cookieJar, id) => {
    return new Promise((resolve, reject) => {
        try {
            var orderId = id.replace(/\D/g, '').replace(/(\d{3})(\d{7})(\d{7})/, '$1-$2-$3');
            rp('https://www.amazon.com/progress-tracker/package/?itemId=0&orderId=' + orderId, {
                jar: cookieJar,
                transform: body => {
                    return cheerio.load(body);
                }
            }).then($ => {
                var tracking = {
                    primaryStatus: $('#primaryStatus').text().trim() || 'Status Unavailable',
                    secondaryStatus: $('#secondaryStatus').text().trim() || '',
                    milestoneMessage: $($('.milestone-primaryMessage')[0]).text().trim() || '',
                    exceptionSource: $('.lastExceptionSource').text().trim() || false,
                    exceptionExplanation: $('.lastExceptionExplanation').text().trim() || false,
                    deliveredAddress: $('#deliveredAddress>p').map(function() {
                        return $(this).text().trim();
                    }).get() || [],
                    deliveryPhoto: $('#photoOnDelivery-container>img') ? $('#photoOnDelivery-container>img').attr('src') : false,
                    events: $('#tracking-events-container>>.a-row').not('.tracking-event-carrier-header, .tracking-event-trackingId-text, .a-row.tracking-event-timezoneLabel').map(function() {
                        return {
                            date: $(this).find('.tracking-event-date').text().trim(),
                            events: $(this).find('.a-spacing-large.a-spacing-top-medium').map(function() {
                                return {
                                    time: $(this).find('.tracking-event-time').text().trim(),
                                    message: $(this).find('.tracking-event-message').text().trim(),
                                    location: $(this).find('.tracking-event-location').text().trim()
                                };
                            }).get(),
                        }
                    }).get() || []
                };
                resolve(tracking);
            });
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = track;
