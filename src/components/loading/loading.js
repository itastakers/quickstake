import React from 'react';
import Lottie from 'react-lottie';
import * as animationLoading from './loading.json'
const Loading = () => {
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
      height={200}
      width={200}
    />
  )
}
export default Loading;