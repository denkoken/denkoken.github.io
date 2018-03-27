import tweet from 'twitter';
import config from '../config/twitter.json';

const client = new twitter({
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  access_token_key: config.access_token_key,
  access_token_secret: config.access_token_secret,
});

export default function(url) {
  return new Promise((resolve, reject) => {
    client.post('statuses/update', {status: `${config.content}\n ${url}`},
      (err) => {
        // error occur
        if (err === null) {
          reject();

        // success
        } else {
          resolve();
        }
      });
  });
}
