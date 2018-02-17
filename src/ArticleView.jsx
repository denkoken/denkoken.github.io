import React from 'react';
import PropTypes from 'prop-types';

import MarkdownContainer from './MarkdownContainer.jsx';
import ImageHeader from './ImageHeader.jsx';


class ArticleView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {topics: props.topics};
  }

  componentWillReceiveProps(newProps) {
    this.setState({topics: newProps.topics});
  }

  render() {
    return (
      <div>
        {Object.keys(this.state.topics).map((key) => {
          return (
            <div
              key={`container-${key}`}
              id={key}
            >
              <ImageHeader
                key={`image-${key}`}
                src={this.state.topics[key].src}
                title={this.state.topics[key].title}
              />
              <MarkdownContainer
                body={this.state.topics[key].body}
              />
            </div>
          );
        })}
      </div>
    );
  }

}

ArticleView.propTypes = {
  topics: PropTypes.objectOf(PropTypes.shape({
    body: PropTypes.arrayOf(PropTypes.string),
    src: PropTypes.string,
    title: PropTypes.string,
  })),
};

ArticleView.defaultProps = {topics: {}};

export default ArticleView;
