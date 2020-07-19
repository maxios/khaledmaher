import React, {useEffect} from 'react';

const linkedinBadge = () => {
  useEffect(() => {
    const script = document.createElement('script');
    const element = `
      <div class="LI-profile-badge"  data-version="v1" data-size="large" data-locale="en_US" data-type="vertical" data-theme="light" data-vanity="khaledmaher">
      </div>
    `

    script.src = "https://platform.linkedin.com/badges/js/profile.js";
    script.async = true;

    document.body.appendChild(script);
    document.getElementById("linkedin-profile-badge").innerHTML = element;

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  return (
    <div id="linkedin-profile-badge"></div>
  )
}

export default linkedinBadge;
