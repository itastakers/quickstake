import React from 'react';
import Lottie from 'react-lottie';
import * as animationLoading from './loading.json'
const Loading = ({width,height}) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationLoading,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  return (
    <Lottie options={defaultOptions}
      height={width}
      width={height}
    />
  )
}
export default Loading;