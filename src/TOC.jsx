import React from 'react';
import PropTypes from 'prop-types';

import {Menu} from 'antd';


const siderMenuStyle = {
  paddingTop: '40px',
  height: '100%',
};


class TOC extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      link: props.link,
      category: props.category,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      link: newProps.link,
      category: newProps.category,
    });
  }

  handleClick(e) {
    location.hash = e.key;
  }

  render() {
    return (
      <Menu
        mode="vertical"
        onClick={this.handleClick}
        style={siderMenuStyle}
      >
        {this.state.link.map((key, idx) => {
          return (
            <Menu.Item key={key}>
              {this.state.category[idx]}
            </Menu.Item>
          );
        })}
      </Menu>
    );
  }

}

TOC.propTypes = {
  category: PropTypes.arrayOf(PropTypes.string),
  link: PropTypes.arrayOf(PropTypes.string),
};

TOC.defaultProps = {
  category: [],
  link: [],
};

export default TOC;
