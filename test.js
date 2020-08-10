import React, {useState, useEffect} from "react";

const ProgressiveImage = props => {
  const [blur, setBlur] = useState(10);
  const [src, setSrc] = useState('');
  let unmounted = false;

  const fetch = (source) => {
    return new Promise(resolve => {
      const image = new Image();
      image.src = source;
      image.addEventListener("load", () => resolve(src), false);
    });
  }

  const getStyle = () => {
    const {transitionTime, timingFunction} = props;
    return {
      filter: `blur(${blur}px)`,
      transition: `filter ${transitionTime}ms ${timingFunction}`
    };
  }

  useEffect(() => {
    const {src, preview} = props;
    const initialBlur = props.initialBlur;
    setSrc(preview)
    setBlur(initialBlur);
    fetch(src)
      .then(srcDataURI => !unmounted && setSrc(srcDataURI) && setBlur(0));

    return () => {
      unmounted = true;
    }
  }, [])

  const {render} = props;
  return render(src, getStyle());

}

ProgressiveImage.defaultProps = {
  transitionTime: 500,
  timingFunction: "ease",
  initialBlur: 10
};


export default ProgressiveImage;
