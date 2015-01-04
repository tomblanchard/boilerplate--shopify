/**
  http://cdn.shopify.com/s/shopify/option_selection.js - Line 313
 */

Shopify.OptionSelectors.prototype.buildSelectors = function() {
  // build selectors
  for (var i = 0; i < this.product.optionNames().length; i++) {
    var sel = new Shopify.SingleOptionSelector(this, i, this.product.optionNames()[i], this.product.optionValues(i));
    sel.element.disabled = false;
    this.selectors.push(sel);
  }

  // replace existing selector with new selectors, new hidden input field, new hidden messageElement
  var divClass = this.selectorDivClass;
  var optionNames = this.product.optionNames();
  var elements = Shopify.map(this.selectors, function(selector) {
    var div = document.createElement('div');
    div.setAttribute('class', divClass);
    // create label if at least 1 option (ie: at least one drop down)
    if (optionNames.length > 0) {
      // create and appened a label into div
      var label = document.createElement('label');
      label.htmlFor = selector.element.id;
      label.innerHTML = selector.name;
      div.appendChild(label);
    }
    div.appendChild(selector.element);
    return div;
  });

  return elements;
};


/**
  New function, it returns the name of a product image from its URL.
 */

Shopify.Image.getFileName = function(url) {
  return url
    // Remove everything before (and including) the last `/`
    .replace(/^.*\/(.*)$/, '$1')
    // Remove size
    .replace(/_(1024x1024|2048x2048|pico|icon|thumb|small|compact|medium|large|grande)\./, '.')
    // Remove file extension and query string
    .replace(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i, '');
}