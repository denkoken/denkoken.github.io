import React from 'react';
import PropTypes from 'prop-types';

import {Layout} from 'antd';
const {Header, Footer} = Layout;

import Menubar from './Menubar.jsx';
import general from '../config/general.json';


const headerStyle = {
  width: '100%',
  position: 'fixed',
  zIndex: 10,
};


class PageLayout extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      children: props.children,
      topic: props.topic,
    };

    this.callback = props.onSelect;
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      children: newProps.children,
      topic: newProps.topic,
    });
  }

  handleSelect(e) {
    this.callback(e);
  }

  render() {
    return (
      <Layout>
        <Header style={headerStyle}>
          <Menubar
            defaultKey={this.state.topic}
            onSelect={this.handleSelect}
          />
        </Header>
        <Layout style={{marginTop: '64px'}}>
          {this.state.children}
        </Layout>
        <Footer style={{textAlign: 'center'}}>
          {`${general.footer.name} `}
          &copy;
          {general.footer.year}
        </Footer>
      </Layout>
    );
  }

}

PageLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  topic: PropTypes.string,
  onSelect: PropTypes.func,
};

PageLayout.defaultProps = {
  children: [],
  topic: '',
  onSelect: (arg) => {
    console.log(arg);
  },
};

export default PageLayout;
