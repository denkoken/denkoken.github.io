import React from 'react';
import {render} from 'react-dom';

import {BackTop} from 'antd';
import MainView from './MainView.jsx';

import common from './common.js';
import general from '../config/general.json';
import internalPaths from '../config/internal_paths.json';
import menuitem from '../config/menuitem.json';


class App extends React.Component {

  constructor(props) {
    super(props);

    // Parse current url query
    this.query = common.getUrlQuery();

    // Get topic key
    const topic = internalPaths[this.query.topic] === undefined ?
      'index' :
      this.query.topic;

    // Get all menuitem keys
    const keys = common.getValidKeys(topic, menuitem);

    this.state = {
      topic: topic,
      data: undefined,
      title: keys[1] === undefined ?
        menuitem[keys[0]].label :
        menuitem[keys[1]].child[keys[0]].label,
    };
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    // Get json data
    common.
      fetchJSON(`${general.github_url}/${internalPaths[this.state.topic]}`).
      then((json) => {

      // The case of we got list data and query give us list index
      // Get article from list with given index
        if (json instanceof Array &&
          json[Number(this.query.list)] !== undefined) {
          const idx = Number(this.query.list);
          common.fetchJSON(`${general.github_url}/${json[idx].path}`).
            then((data) => {
              this.setState({data: data});
            }).
            catch(() => {
              this.setState({data: general.load_json_failed});
            });

        // No list index is available
        } else {
          this.setState({data: json});
        }
      }).
      catch(() => {
        this.setState({data: general.load_json_failed});
      });
  }

  handleSelect(newQuery) {
    if (newQuery.topic === undefined) {
      common.setUrlQuery(Object.assign(this.query, newQuery));

    } else {
      common.setUrlQuery(newQuery);
    }
  }

  render() {
    return (
      <div>
        <BackTop />
        <MainView
          data={this.state.data}
          onSelect={this.handleSelect}
          title={this.state.title}
          topic={this.state.topic}
        />
      </div>
    );
  }

}

render(
  <App />,
  document.getElementById('container')
);
