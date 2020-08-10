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

  const handleFetch = () => {
    fetch(src)
      .then(srcDataURI => {
        console.log(srcDataURI)
        return !unmounted && setSrc(srcDataURI) && setBlur(0)
      });

  }

  useEffect(() => {
    setSrc(props.preview)
    if (!is_cached(props.src)) {
      setBlur(props.initialBlur, handleFetch);
    } else {
      handleFetch();
    }

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
