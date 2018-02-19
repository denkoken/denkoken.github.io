const common = {

  copyToClipboard: function(string) {
    const temp = document.createElement('div');
    temp.appendChild(document.createElement('pre')).textContent = string;

    document.body.appendChild(temp);
    document.getSelection().selectAllChildren(temp);

    const result = document.execCommand('copy');
    document.body.removeChild(temp);

    return result;
  },

  fetchJSON: function(url) {
    return new Promise((resolve, reject) => {
      fetch(url, {cache: 'no-store'}).then((resp) => {
        return resp.json();
      }).
        then((json) => {
          resolve(json);
        }).
        catch((ex) => {
          reject(ex);
        });
    });
  },

  getUrlQuery: function() {
    const search = window.location.search.slice(1).split('&');
    const query = {};

    for (let i = 0; i < search.length; i += 1) {
      const pair = search[i].split('=');
      query[pair[0]] = pair[1];
    }

    return query;
  },

  setUrlQuery: function(query) {
    const search = [];
    const keys = Object.keys(query);

    for (let i = 0; i < keys.length; i += 1) {
      if (typeof query[keys[i]] === 'string' ||
        typeof query[keys[i]] === 'number') {
        search.push(`${keys[i]}=${query[keys[i]]}`);
      }
    }

    location.search = `?${search.join('&')}`;
  },

  getValidKeys: function(givenKey, menuitem) {
    let keys = [Object.keys(menuitem)[0]];

    Object.keys(menuitem).forEach((key) => {
      if (key === givenKey) {
        keys = [key];
      }

      if (menuitem[key].child !== undefined) {
        Object.keys(menuitem[key].child).forEach((subkey) => {
          if (subkey === givenKey) {
            keys = [
              subkey,
              key,
            ];
          }
        });
      }
    });

    return keys;
  },
};

export default common;
