import React from 'react';
import PropTypes from 'prop-types';

import {List} from 'antd';


const focusedListStyle = {
  backgroundColor: '#ddd',
  color: '#000',
};

const unfocusedListStyle = {
  backgroundColor: '#fff',
  color: '#222',
};


class ListItem extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      children: props.children,
      focus: false,
    };

    this.id = props.id;
    this.callback = props.onSelect;
    this.handleSelect = this.handleSelect.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      children: newProps.children,
      focus: false,
    });
  }

  shouldComponentUpdate(newProps, newState) {
    return this.state.focus !== newState.focus;
  }

  handleSelect() {
    this.callback(this.id);
  }

  handleMouseOver() {
    this.setState({focus: true});
  }

  handleMouseOut() {
    this.setState({focus: false});
  }

  render() {
    return (
      <List.Item
        onClick={this.handleSelect}
        onMouseOut={this.handleMouseOut}
        onMouseOver={this.handleMouseOver}
        style={
          this.state.focus ?
            focusedListStyle :
            unfocusedListStyle
        }
      >
        {this.state.children}
      </List.Item>
    );
  }

}

ListItem.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  id: PropTypes.number,
  onSelect: PropTypes.func,
};

ListItem.defaultProps = {
  children: [],
  id: -1,
  onSelect: (args) => {
    console.log(args);
  },
};

export default ListItem;
