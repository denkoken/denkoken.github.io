import React from 'react';
import PropTypes from 'prop-types';

import {Layout, Spin} from 'antd';
const {Content, Sider} = Layout;

import ArticleView from './ArticleView.jsx';
import ListView from './ListView.jsx';
import TOC from './TOC.jsx';
import PageLayout from './PageLayout.jsx';
import general from '../data/structure/general.json';


const spinStyle = {
  margin: '50px',
  width: '100%',
};

const messageStyle = {
  margin: '50px',
  fontSize: '30px',
  width: '100%',
  textAlign: 'center',
};

const contentStyleWithTOC = {marginLeft: '200px'};

const siderStyle = {
  width: '200px',
  position: 'fixed',
  height: '100%',
};


class MainView extends React.Component {

  constructor(props) {
    super(props);
    document.title = `${general.name}: ${props.title}`;

    this.state = {
      type: props.data instanceof Array ?
        'list' :
        'article',
      TOC: props.TOC === 'auto' && props.data instanceof Object ?
        Object.keys(props.data).length > 1 :
        props.TOC,
      data: props.data,
      title: props.title,
      topic: props.topic,
    };

    this.callback = props.onSelect;
    this.handleSelectTopic = this.handleSelectTopic.bind(this);
    this.handleSelectList = this.handleSelectList.bind(this);
  }

  componentWillReceiveProps(newProps) {
    document.title = `${general.name}: ${newProps.title}`;

    this.setState({
      type: newProps.data instanceof Array ?
        'list' :
        'article',
      TOC: newProps.TOC === 'auto' && newProps.data instanceof Object ?
        Object.keys(newProps.data).length > 1 :
        newProps.TOC,
      data: newProps.data,
      title: newProps.title,
      topic: newProps.topic,
    });
  }

  handleSelectTopic(topic) {
    this.callback({topic: topic});
  }

  handleSelectList(idx) {
    this.callback({list: idx});
  }

  render() {
    return (
      <PageLayout
        onSelect={this.handleSelectTopic}
        topic={this.state.topic}
      >
        {(() => {
          // Json is not loaded
          if (this.state.data === undefined) {
            return (
              <Content>
                <Spin
                  size="large"
                  style={spinStyle}
                  tip="Now loading..."
                />
              </Content>
            );

          // Display error message
          } else if (typeof this.state.data === 'string') {
            return (
              <Content>
                <div style={messageStyle}>
                  {this.state.data}
                </div>
              </Content>
            );

          // Json data is article list
          } else if (this.state.type === 'list') {
            return (
              <Content>
                <ListView
                  listitems={this.state.data}
                  onSelect={this.handleSelectList}
                  title={this.state.title}
                />
              </Content>
            );

          // Json data is article with TOC
          } else if (this.state.TOC) {
            return (
              <Layout>
                <Sider style={siderStyle}>
                  <TOC
                    category={
                      Object.keys(this.state.data).
                        map((key) => {
                          return this.state.data[key].title;
                        })
                    }
                    link={Object.keys(this.state.data)}
                  />
                </Sider>
                <Content style={contentStyleWithTOC}>
                  <ArticleView
                    topics={this.state.data}
                  />
                </Content>
              </Layout>
            );
          }

          // Json data is article without TOC
          return (
            <Content>
              <ArticleView
                topics={this.state.data}
              />
            </Content>
          );
        })()}
      </PageLayout>
    );
  }

}

MainView.propTypes = {
  TOC: PropTypes.oneOf([
    true,
    false,
    'auto',
  ]),
  data: PropTypes.oneOfType([
    PropTypes.shape({
      body: PropTypes.arrayOf(PropTypes.string),
      src: PropTypes.string,
      title: PropTypes.string,
    }),
    PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.arrayOf(PropTypes.number),
      title: PropTypes.string,
    })),
    PropTypes.string,
    PropTypes.oneOf([undefined]),
  ]),
  title: PropTypes.string,
  topic: PropTypes.string,
  onSelect: PropTypes.func,
};

MainView.defaultProps = {
  TOC: 'auto',
  data: undefined,
  title: general.name,
  topic: '',
  onSelect: (arg) => {
    console.log(arg);
  },
};

export default MainView;
