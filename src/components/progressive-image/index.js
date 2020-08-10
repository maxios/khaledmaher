import {useState, useEffect} from "react";

const ProgressiveImage = props => {
  const [blur, setBlur] = useState(0);
  const [src, setSrc] = useState('');
  let unmounted = false;

  const is_cached = (img_url) => {
    var imgEle = document.createElement("img");
    imgEle.src = img_url;
    return imgEle.complete || (imgEle.width+imgEle.height) > 0;
  }

  const fetch = (source) => {
    return new Promise(resolve => {
      const image = new Image();
      image.src = source;
      image.addEventListener("load", () => resolve(source), false);
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
    if (!is_cached(src)) setBlur(initialBlur);
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
