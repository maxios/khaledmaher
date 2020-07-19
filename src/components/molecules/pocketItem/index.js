import React, {useEffect} from 'react';
import axios from 'axios';

const PocketItem = () => {
  useEffect(() => {
    axios({
      method: 'GET',
      url: "https://www.khaledmaher.com/.netlify/functions/get_pockets",
    })
      .then(console.log)
      .catch(console.log)

  }, []);

  return (
    <div>pocket</div>
  );
};

export default PocketItem;
