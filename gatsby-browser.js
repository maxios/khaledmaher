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

exports.onInitialClientRender = () => {
  createScript(
    'https://platform.twitter.com/widgets.js',
    'twitter-jssdk'
  )
}
