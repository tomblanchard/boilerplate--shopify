(function ($, window, document, undefined) { 'use strict'; $(function () {





  /**
    Multiple product option dropdowns, basically a modified version of
    http://bit.ly/1wCSYCP
   */

  function selectCallback(variant, selector) {

    var $elements = {
      price: $('.js-os-price'),
      comparePrice: $('.js-os-compare-price'),
      cycle: $('.js-os-cycle'),
      cycleSlide: $('.js-os-cycle-slide'),
      cyclePager: $('.js-os-cycle-pager'),
      submit: $('.js-os-submit'),
      backorder: $('.js-os-backorder'),
      form: $('.js-os-form')
    }

    function updatePrice() {
      var onSale = variant.compare_at_price > variant.price;
      var price = Shopify.formatMoney( variant.price, GLOBALS.shopMoneyFormat );
      $elements.price.html( price );
      if ( onSale ) {
        var comparePrice = Shopify.formatMoney(variant.compare_at_price, GLOBALS.shopMoneyFormat);
        $elements.comparePrice.html( comparePrice );
      } else {
        $elements.comparePrice.empty();
      }
    }

    /**
      Requires jQuery.Cycle2.
     */
    function initCycle() {
      $elements.cycle.cycle({
        slides: $elements.cycleSlide,
        timeout: 0,
        pager: $elements.cyclePager,
        pagerTemplate: ''
      });
    }

    function updateImage() {
      var newImage = Shopify.Image.getFileName( variant.featured_image.src );
      $elements.cycleSlide.not('.cycle-sentinel').each(function(index) {
        var matchedImage = Shopify.Image.getFileName( $(this).attr('href') );
        if( newImage == matchedImage ) {
          $elements.cycle.cycle('goto', index);
        }
      });
    }

    function disableAddCart() {
      $elements.submit.val('Sold out').prop('disabled', true);
    }

    function enableAddCart() {
      $elements.submit.val('Add to cart').prop('disabled', false);
    }

    function hideBackorder() {
      $elements.backorder.empty();
    }

    function showBackorder() {
      var variantTitle = GLOBALS.productTitle + ( !GLOBALS.productHideDefaultTitle ? ' - ' + variant.title : '' );
      var message = variantTitle + ' is back-ordered. We will ship it separately in 10 to 15 days.';
      $elements.backorder.html( message );
    }

    function bindAddToCartForm() {
      unbindAddToCartForm();
      $elements.form.on('submit', addCartAjax);
    }

    function unbindAddToCartForm() {
      $elements.form.off('submit');
    }

    function addCartAjax() {
      $.ajax({
        type: 'POST',
        url: '/cart/add.js',
        dataType: 'json',
        data: {
          quantity: 1,
          id: variant.id
        },
        success: addCartSuccess,
        error: addCartError
      });
      return false;
    }

    function addCartSuccess(data) {
      alert( data.title + ' was added to your cart.' );
    }

    function addCartError(data) {
      alert( data.responseJSON.message + ' - ' + data.responseJSON.description );
    }

    if (variant) {

      updatePrice();

      initCycle();

      if (variant.featured_image) {
        updateImage();
      }

      if (variant.available) {
        enableAddCart();
        bindAddToCartForm();
        if ( variant.inventory_management && variant.inventory_quantity <= 0 ) {
          showBackorder();
        } else {
          hideBackorder();
        }
      } else {
        hideBackorder();
        disableAddCart();
        unbindAddToCartForm();
      }

    }

  };

  if( $('#js-os-select').length ) {
    new Shopify.OptionSelectors('js-os-select', {
      product: GLOBALS.product,
      onVariantSelected: selectCallback,
      enableHistoryState: true
    });
  }





  /**
    Product quick view modal (requires jQuery.fancyBox).
   */

  (function() {

    $('.js-quick-view').fancybox({

      autoSize: false,

      width: 1100,

      height: 600,

      type: 'ajax',

      ajax: {
        dataFilter: function(data) {
          return $(data).filter('.js-single-product');
        }
      },

      beforeShow: beforeShow

    });

    var $product;

    function beforeShow() {
      $product = $('.fancybox-inner .js-single-product');
      optionSelectors();
      modifyDomExample();
    }

    /**
      Initialize `Shopify.OptionSelectors`.
     */
    function optionSelectors() {
      new Shopify.OptionSelectors('js-os-select', {
        product: GLOBALS.product,
        onVariantSelected: selectCallback
      });
    }

    /**
      Crude example of how to modify the product DOM when it's inside the modal.
     */
    function modifyDomExample() {
      $product.find('form').css('background', 'red');
    }

  })();





}); })($, window, document);