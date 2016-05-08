require('dotenv').config({ silent: true });
const request = require('request');


const {
  TOAST_THRESHOLD,
  UNTAPPD_BREWERY_ID,
  UNTAPPD_CLIENT_ID,
  UNTAPPD_CLIENT_SECRET,
  UNTAPPD_ACCESS_TOKEN,
} = process.env;

const AUTH = {
  client_id: UNTAPPD_CLIENT_ID,
  client_secret: UNTAPPD_CLIENT_SECRET,
  access_token: UNTAPPD_ACCESS_TOKEN,
};


Promise.resolve()
  .then(getCheckins)
  .then(res => res.response.checkins.items)
  .then(checkins => checkins.filter(filterCheckins))
  .then(checkins => {
    console.log(`toasting ${checkins.length} checkin${checkins.length !== 1 ? 's' : ''}:`);
    checkins.map(c => {
      console.log(`  ${c.user.first_name} ${c.user.last_name}, ${c.beer.beer_name}, ${c.rating_score}`);
    });
    return checkins;
  })
  .then(checkins => {
    const toasts = checkins.map(c => toastCheckin(c.checkin_id));
    return Promise.all(toasts);
  })
  .then(() => console.log('done!'))
  .catch(err => console.log(err, err.stack));


function getCheckins() {
  return new Promise((resolve, reject) => {
    const req = {
      url: `https://api.untappd.com/v4/brewery/checkins/${UNTAPPD_BREWERY_ID}`,
      qs: Object.assign({}, AUTH, { limit: 50 }),
    };
    request(req, (err, res, body) => {
      if (err) return reject(err);
      resolve(JSON.parse(body));
    });
  });
}

function filterCheckins(checkin) {
  return (
    checkin.rating_score >= TOAST_THRESHOLD &&
    !checkin.toasts.items.find(t => t.like_owner)
  );
}

function toastCheckin(checkinId) {
  return new Promise((resolve, reject) => {
    const req = {
      url: `https://api.untappd.com/v4/checkin/toast/${checkinId}`,
      method: 'POST',
      qs: AUTH,
    };
    request(req, (err, res, body) => {
      if (err) return reject(err);
      resolve(JSON.parse(body));
    });
  });
}
