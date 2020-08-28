/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it

const createScript = (src, id) => {
    var js, fjs = document.getElementsByTagName('script')[0];
    if (document.getElementById(id)) return;
    js = document.createElement('script'); js.id = id;
    js.src = src;
    fjs.parentNode.insertBefore(js, fjs);
}

exports.onClientEntry = () => {
  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
  let vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

exports.onInitialClientRender = () => {
  // createScript(
  //   'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0',
  //   'facebook-jssdk'
  // )

  createScript(
    'https://platform.twitter.com/widgets.js',
    'twitter-jssdk'
  )
}
