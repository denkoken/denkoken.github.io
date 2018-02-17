import React from 'react';
import PropTypes from 'prop-types';

import {Menu, Icon, notification} from 'antd';

import common from './common.js';
import menuitem from '../data/structure/menuitem.json';


const notificationDurations = {
  success: 4.5,
  info: 0,
};


class Menubar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {current: common.getValidKeys(props.defaultKey, menuitem)};

    this.callback = props.onSelect;
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    // Get selected menuitem.
    const keys = e.keyPath;
    const item = keys[1] === undefined ?
      menuitem[keys[0]] :
      menuitem[keys[1]].child[keys[0]];

    // Move page to internal link
    if (item.type === 'internal') {
      this.callback(keys[0]);

    // Open external link in new tab
    } else if (item.type === 'external') {
      window.open(item.path);

    // Copy data to clipboard
    } else if (item.type === 'clipboard') {
      const type = common.copyToClipboard(item.path) ?
        'success' :
        'info';
      // Indicate
      notification[type]({
        message: type === 'success' ?
          item.success :
          item.failed,
        description: item.path,
        duration: notificationDurations[type],
      });
    }
  }

  render() {
    return (
      <Menu
        mode="horizontal"
        onClick={this.handleClick}
        selectedKeys={this.state.current}
        style={{lineHeight: '64px'}}
        theme="dark"
      >
        {Object.keys(menuitem).map((key) => {
          const item = menuitem[key];
          if (item.child === undefined) {
            return (
              <Menu.Item
                key={key}
              >
                <Icon type={item.icon} />
                {item.label}
              </Menu.Item>
            );
          }

          return (
            <Menu.SubMenu
              key={key}
              title={<span>
                <Icon type={item.icon} />
                {item.label}
              </span>}
            >
              {Object.keys(item.child).map((subkey) => {
                return (
                  <Menu.Item
                    key={subkey}
                  >
                    <Icon type={item.child[subkey].icon} />
                    {item.child[subkey].label}
                  </Menu.Item>
                );
              })}
            </Menu.SubMenu>
          );
        })}
      </Menu>
    );
  }

}

Menubar.propTypes = {
  defaultKey: PropTypes.string,
  onSelect: PropTypes.func,
};

Menubar.defaultProps = {
  defaultKey: Object.keys(menuitem)[0],
  onSelect: (arg) => {
    console.log(arg);
  },
};

export default Menubar;
