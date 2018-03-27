import Twitter from 'twitter';
import config from '../config/twitter.json';

const client = new Twitter({
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  access_token_key: config.access_token_key,
  access_token_secret: config.access_token_secret,
});

export default function(url) {
  return new Promise((resolve, reject) => {
    client.post('statuses/update', {status: `${config.content}\n ${url}`},
      (err, tweet) => {
        // error occur
        if (err === null) {
          reject(err);

        // success
        } else {
          resolve(tweet);
        }
      });
  });
}
