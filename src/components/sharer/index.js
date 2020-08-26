import React from 'react';
import PropType from 'prop-types';
import { ShareLink } from 'social-media-sharing'
import FacebookIcon from '@images/icons/facebook.svg';
import TwitterIcon from '@images/icons/twitter.svg';
import LinkedinIcon from '@images/icons/linkedin.svg';
import SVG from '@components/svg';


const Sharer = props => {
  const facebookSharer = new ShareLink('facebook');
  const linkedinSharer = new ShareLink('linkedin');
  const twitterSharer = new ShareLink('twitter');
  const url = `https://khaledmaher.com/${props.location.pathname}`;

  facebookSharer.get({u: url, hashtag: '#khaledmaher'});
  linkedinSharer.get({url});
  twitterSharer.get({url, via: 'animaxios', hashtags: "khaledmaher"});

  const sharers = [
    {
      id: 'facebook',
      onClick: () => facebookSharer.open(),
      icon: FacebookIcon.id,
      hashtag: '#tech'
    },
    {
      id: 'twitter',
      onClick: () => twitterSharer.open(),
      icon: TwitterIcon.id
    },
    {
      id: 'linkedin',
      onClick: () => linkedinSharer.open(),
      icon: LinkedinIcon.id
    }
  ]

  return (
    <div
      className="sharer__container absolute transition-ease-out full-screen"
      onClick={props.close}
      style={props.isOpened ? {
        opacity: 1,
        pointerEvents: 'initial'
      } : {
        opacity: 0,
        pointerEvents: 'none'
      }}
    >
      <div
        className="sharer__window shadow-frame transition-ease-out absolute d-flex z-index-1"
        style={{
          transform: `scale(${props.isOpened ? '1' : '0'})`
        }}
      >
        {
          sharers.map(({id, onClick, icon}) => (
            <button key={id}
              className={`sharer__button bg-${id}`}
              onClick={onClick}
            >
              <SVG id={icon} size={30} color="white"/>
            </button>
          ))
        }
      </div>
    </div>
  )
}

Sharer.defaultProps = {
  close: () => {}
}

Sharer.propTypes = {
  isOpened: PropType.bool.isRequired,
  location: PropType.object.isRequired,
  close: PropType.func
}

export default Sharer;
