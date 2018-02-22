import path from 'path';
import React from 'react';
import PropTypes from 'prop-types';

import general from '../config/general.json';


const getBackgroundImageStyle = function(src, height) {
  return {
    height: height,
    backgroundImage: `url(${src})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    overflow: 'hidden',
  };
};

const foregroundBoxStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  height: '100%',
  width: '50%',
  float: 'left',
};

const titleContainerStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  margin: '30px',
  padding: '30px',
  height: '30%',
  textAlign: 'justify',
  fontSize: '50px',
  fontWeight: 500,
};


class ImageHeader extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      src: props.src,
      title: props.title,
      height: props.height,
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      src: newProps.src,
      title: newProps.title,
      height: newProps.height,
    });
  }

  render() {
    console.log(this.state.src);
    console.log(path.join(general.github_url, this.state.src));
    return (
      <div
        style={
          getBackgroundImageStyle(
            path.join(general.github_url, 'docs', this.state.src),
            this.state.height
          )
        }
      >
        <div
          style={foregroundBoxStyle}
        />
        <div
          style={foregroundBoxStyle}
        >
          <div style={{height: '35%'}} />
          <div style={titleContainerStyle}>
            {this.state.title}
          </div>
          <div style={{height: '35%'}} />
        </div>
      </div>
    );
  }

}

ImageHeader.propTypes = {
  height: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  src: PropTypes.string,
  title: PropTypes.string,
};

ImageHeader.defaultProps = {
  height: '400px',
  src: general.default_image_url,
  title: 'No title',
};

export default ImageHeader;
