export const offClick = (elem, callback) => {
  document.addEventListener('click', function(event) {
    var isClickInside = elem.contains(event.target);

    if (!isClickInside) {
      return callback();
    }
  });
};
