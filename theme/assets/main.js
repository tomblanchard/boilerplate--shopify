(function ($, window, document, undefined) { 'use strict'; $(function () {





  /**
    Multiple product option dropdowns, basically a modified version of
    http://bit.ly/1wCSYCP
   */

  var OptionSelectors = (function() {

    var module;

    return {

      init: function(enableHistoryState) {
        enableHistoryState = typeof enableHistoryState !== 'undefined' ? enableHistoryState : true;
        module = this;

        if( $('#js-os-select').length ) {
          new Shopify.OptionSelectors('js-os-select', {
            product: GLOBALS.product,
            onVariantSelected: module.doStuff,
            enableHistoryState: enableHistoryState
          });
        }
      },

      doStuff: function(variant, selector) {
        module.variant = variant;
        module.selector = selector;

        module.elements = {
          price: $('.js-os-price'),
          comparePrice: $('.js-os-compare-price'),
          cycle: $('.js-os-cycle'),
          cycleSlide: $('.js-os-cycle-slide'),
          cyclePager: $('.js-os-cycle-pager'),
          submit: $('.js-os-submit'),
          backorder: $('.js-os-backorder'),
          form: $('.js-os-form')
        }

        if (module.variant) {
          module.updatePrice();

          module.initCycle();

          if (module.variant.featured_image) {
            module.updateImage();
          }

          if (module.variant.available) {
            module.enableAddCart();
            module.bindAddToCartForm();
            if ( module.variant.inventory_management && module.variant.inventory_quantity <= 0 ) {
              module.showBackorder();
            } else {
              module.hideBackorder();
            }
          } else {
            module.hideBackorder();
            module.disableAddCart();
            module.unbindAddToCartForm();
          }
        }
      },

      // Check if the product is inside a quick view modal.
      inModal: function() {
        return $(module.selector.module.variantIdField).parents('.fancybox-inner').length;
      },

      updatePrice: function() {
        var onSale = module.variant.compare_at_price > module.variant.price;
        var price = Shopify.formatMoney( module.variant.price, GLOBALS.shopMoneyFormat );
        module.elements.price.html( price );
        if ( onSale ) {
          var comparePrice = Shopify.formatMoney(module.variant.compare_at_price, GLOBALS.shopMoneyFormat);
          module.elements.comparePrice.html( comparePrice );
        } else {
          module.elements.comparePrice.empty();
        }
      },

      // Requires jQuery.Cycle2.
      initCycle: function() {
        module.elements.cycle.cycle({
          slides: module.elements.cycleSlide,
          timeout: 0,
          pager: module.elements.cyclePager,
          pagerTemplate: ''
        });
      },

      updateImage: function() {
        var newImage = Shopify.Image.getFileName( module.variant.featured_image.src );
        module.elements.cycleSlide.not('.cycle-sentinel').each(function(index) {
          var matchedImage = Shopify.Image.getFileName( $(this).attr('href') );
          if( newImage == matchedImage ) {
            module.elements.cycle.cycle('goto', index);
          }
        });
      },

      disableAddCart: function() {
        module.elements.submit.val('Sold out').prop('disabled', true);
      },

      enableAddCart: function() {
        module.elements.submit.val('Add to cart').prop('disabled', false);
      },

      hideBackorder: function() {
        module.elements.backorder.empty();
      },

      showBackorder: function() {
        var variantTitle = GLOBALS.productTitle + ( !GLOBALS.productHideDefaultTitle ? ' - ' + module.variant.title : '' );
        var message = variantTitle + ' is back-ordered. We will ship it separately in 10 to 15 days.';
        module.elements.backorder.html( message );
      },

      bindAddToCartForm: function() {
        module.unbindAddToCartForm();
        module.elements.form.on('submit', module.addCartAjax);
      },

      unbindAddToCartForm: function() {
        module.elements.form.off('submit');
      },

      addCartAjax: function() {
        $.ajax({
          type: 'POST',
          url: '/cart/add.js',
          dataType: 'json',
          data: {
            quantity: 1,
            id: module.variant.id
          },
          success: module.addCartSuccess,
          error: module.addCartError
        });
        return false;
      },

      addCartSuccess: function(data) {
        alert( data.title + ' was added to your cart.' );
      },

      addCartError: function(data) {
        alert( data.responseJSON.message + ' - ' + data.responseJSON.description );
      }

    };

  })();

  OptionSelectors.init();





  /**
    Product quick view modal (requires jQuery.fancyBox).
   */

  var QuickView = (function() {

    var module;

    return {

      init: function() {
        module = this;
        module.product = '.js-single-product';
        module.fancybox();
      },

      fancybox: function() {
        $('.js-quick-view').fancybox({
          autoSize: false,
          width: 1100,
          height: 600,
          type: 'ajax',
          ajax: {
            dataFilter: function(data) {
              return $(data).filter(module.product);
            }
          },
          beforeShow: module.beforeShow
        });
      },

      beforeShow: function() {
        module.modalProduct = $('.fancybox-inner').find(module.product);
        module.optionSelectors();
        module.modifyDomExample();
      },

      // Initialize `Shopify.OptionSelectors`.
      optionSelectors: function() {
        OptionSelectors.init(false);
      },

      // Crude example of how to modify the product DOM when it's inside the modal.
      modifyDomExample: function() {
        module.modalProduct.find('form').css('background', 'red');
      }

    };

  })();

  QuickView.init();





}); })($, window, document);