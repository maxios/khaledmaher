import React from 'react';

const socials = {
  facebook: {
    url: "https://graph.facebook.com/?id=",
    callback: function (data) {
      console.log("fb", data);
      if (data && data.shares) {
        this.count = data.shares;
      } else {
        this.count = 0;
      }
    },
    share: "https://www.facebook.com/sharer/sharer.php?u="
  },
  twitter: {
    url: "https://cdn.api.twitter.com/1/urls/count.json?url=",
    callback: function (data) {
      console.log("tw", data);
      if (data && data.count) {
        this.count = data.count;
      } else {
        this.count = 0;
      }
    },
    share: "https://twitter.com/intent/tweet?url="
  },
  linkedin: {
    url: "https://www.linkedin.com/countserv/count/share?format=jsonp&url=",
    callback: function (data) {
			console.log("ln", data);
      if (data && data.count) {
        this.count = data.count;
      } else {
        this.count = 0;
      }
    },
    share: "https://www.linkedin.com/cws/share?url="
  }
}
const ShareButton = () => {
  const handleClick = () => {
    window.open(
      oSocial.share + shareUrl,
      '',
      'menubar=no,toolbar=no,resizable=yes' +
      ',scrollbars=yes' +
      ',height=300,width=600'
    );
  }

  return (

  )
}
