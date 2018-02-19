import React from 'react';
import PropTypes from 'prop-types';

import {Avatar, Icon, List} from 'antd';

import ImageHeader from './ImageHeader.jsx';
import ListItem from './ListItem.jsx';


const dateStringInitialIndex = -2;

const iconStyle = {
  marginLeft: '10px',
  marginRight: '10px',
};

const avatarStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0)',
  color: '#444',
  marginLeft: '10px',
  marginRight: '10px',
};

const containerStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  margin: '50px 70px 50px 70px',
  padding: '30px 50px 30px 50px',
};


class ListView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      items: props.listitems.reverse(),
      title: props.title,
    };

    this.callback = props.onSelect;
    this.handleSelect = this.handleSelect.bind(this);
    this.getRenderItem = this.getRenderItem.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      items: newProps.listitems.reverse(),
      title: newProps.title,
    });
  }

  handleSelect(e) {
    this.callback(this.state.items.length - e - 1);
  }

  getRenderItem(item, idx) {
    return (
      <ListItem
        key={String(idx)}
        id={idx}
        onSelect={this.handleSelect}
      >
        <List.Item.Meta
          avatar={
            <Avatar
              icon="pushpin"
              shape="square"
              size="large"
              style={avatarStyle}
            />
          }
          title={item.title}
        />
        <div>
          <Icon
            style={iconStyle}
            type="clock-circle"
          />
          {`20${item.date.map((v) => {
            return `0${v}`.
              slice(dateStringInitialIndex);
          }).join('/')}`}
          <Icon
            style={iconStyle}
            type="arrow-right"
          />
        </div>
      </ListItem>
    );
  }

  render() {
    return (
      <div>
        <ImageHeader
          title={this.state.title}
        />
        <List
          bordered={true}
          dataSource={this.state.items}
          renderItem={this.getRenderItem}
          size="large"
          style={containerStyle}
        />
      </div>
    );
  }

}

ListView.propTypes = {
  listitems: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.arrayOf(PropTypes.number),
    path: PropTypes.string,
    title: PropTypes.string,
  })),
  title: PropTypes.string,
  onSelect: PropTypes.func,
};

ListView.defaultProps = {
  listitems: [],
  title: 'No title',
  onSelect: (args) => {
    console.log(args);
  },
};

export default ListView;
