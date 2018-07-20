# amazon-track

##### A (currently proof-of-concept) library that gets tracking data for shipped Amazon.com orders.

---

##### [My demo app](https://lgtr.herokuapp.com) consists of a react.js frontend and an express + mongodb api which utilizes this library and employs a 30-minute cache for each order. The first time an order is processed through the app, the amazon order id must be used (eg. 113-4758617-1911455). After that,

---

Mainly intended for Amazon-sourcing dropshippers wanting to provide trackable info on AMZL/TBA orders, either for letting buyers track their orders, or for a better chance at winning unreceived item cases.

---

#### Notice

There's no captcha solution like deathbycaptcha or endcaptcha implemented yet, and this project most likely won't be maintained any further than it currently is.

Login will silently fail if Amazon prompts with a captcha or if the email/pword combo is incorrect.

**_Even without being logged in_** Amazon still let's you track orders. The only difference is that you won't be able to see the delivery address (as of right now Amazon returns `['Amazon Customer']`), and you also won't be able to get a delivery photo, even if available.

## Also, this library can only track single shipment orders. It's not currently equipped to provide tracking for multiple shipments (ie. if half the items come from a different warehouse).

_For ease and simplicity, orders are tracked by their 17-digit Amazon order number, not the tracking number._

Examples of valid inputs are listed below.

- `113-9830073-7117051`
- `11280886168828263`
- `# 112-0678238-4659427`
- `hahaha~xd1 dg1325_=+%78dfxfgs#F$hgh1483 \ \ \ .__1aaaa#HB^&abcdefg61805`

The order number is stripped of all non-numerical characters before being tracked.

---

### Usage

```
//var track = require('amazon-track');
var track = require('./index.js');

track('my@email.com', 'amazon/p@ssword', '113-9830073-7117051)
    .then(tracking => {
        console.log(require('util').inspect(tracking, false, null));
        console.log('\n\nRUNTIME:', (Date.now() - startTime) / 1000 + 's');
    }, rej => {
        console.log(rej);
    });
```

```
{ primaryStatus: 'Delivered Friday, February 9',
  secondaryStatus: 'Your package was delivered.',
  milestoneMessage: 'Delivered',
  exceptionSource: false,
  exceptionExplanation: false,
  deliveredAddress:
   [ 'Firstname Lastname',
     '1234 SESAME STREET',
     'SAINT PETERSBURG, FL 33708-3528' ],
  deliveryPhoto: 'https://us-prod-temp.s3.amazonaws.com/imageId-b4b0be08-baa1-7034-14eb-0ca
ee635492a?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20180214T080911Z&X-Amz-SignedHeaders=
host&X-Amz-Expires=575448&X-Amz-Credential=AKIAJN5NBKN7JMHVQ27Q%2F20180214%2Fus-east-1%2Fs3
%2Faws4_request&X-Amz-Signature=b4da2566cc3fa15f6baff8b60bc49d80d09fa47864e399442a17bd9de5c
437a7',
  events:
   [ { date: 'Friday, February 9',
       events:
        [ { time: '2:36 PM',
            message: 'Delivered',
            location: 'Saint Petersburg, US' },
          { time: '11:50 AM',
            message: 'Out for delivery',
            location: 'St. Petersburg, US' },
          { time: '2:33 AM',
            message: 'Package arrived at a carrier facility',
            location: 'St. Petersburg, US' } ] },
     { date: 'Thursday, February 8',
       events:
        [ { time: '',
            message: 'Package has left seller facility and is in transit to carrier',
            location: '' } ] } ] }


RUNTIME: 3.185s
```
