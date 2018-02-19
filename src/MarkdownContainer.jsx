import React from 'react';
import PropTypes from 'prop-types';

import Markdown from 'react-markdown';

const containerStyle = {
  margin: '50px 70px 50px 70px',
  padding: '30px 50px 30px 50px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
};


class MarkdownContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {body: props.body};
  }

  componentWillReceiveProps(newProps) {
    this.setState({body: newProps.body});
  }

  shouldComponentUpdate(newProps, newState) {
    return newState.body.join('') !== this.state.body.join('');
  }

  render() {
    return (
      <div style={containerStyle}>
        <Markdown
          escapeHtml={false}
          source={this.state.body.join('')}
        />
      </div>
    );
  }

}

MarkdownContainer.propTypes = {body: PropTypes.arrayOf(PropTypes.string)};

MarkdownContainer.defaultProps = {body: []};

export default MarkdownContainer;
