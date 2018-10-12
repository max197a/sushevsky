$(document).ready(function() {
  //////////
  // Global variables
  //////////

  var _window = $(window);
  var _document = $(document);
  var easingSwing = [0.02, 0.01, 0.47, 1]; // default jQuery easing for anime.js
  var lastClickEl;

  // maps settings
  // should be on top
  var map,
    markers = [],
    markerDefault,
    markersCoord,
    mapCenter;
  function updateMapVars() {
    if ($("#contacts__map").length > 0) {
      markerDefault = {
        url: "img/pin.svg",
        scaledSize: new google.maps.Size(31, 44)
      };
      markersCoord = [
        {
          lat: 41.729992,
          lng: -88.20742,
          marker: markerDefault
        },
        {
          lat: 54.695636,
          lng: 25.259746,
          marker: markerDefault
        }
      ];
      mapCenter = {
        lat: 41.729992,
        lng: -88.20742
      };
    }
  }

  ////////////
  // READY - triggered when PJAX DONE
  ////////////

  // single time initialization
  legacySupport();
  initaos();

  // on transition change
  getPaginationSections();
  pagination();
  _window.on("scroll", throttle(pagination, 50));
  _window.on("resize", debounce(pagination, 250));

  function pageReady() {
    updateMapVars();

    initMasks();
    initAutogrow();
    initSelectric();
    initValidations();

    initMap();
    _window.on("resize", debounce(initMap, 250))
  }

  // this is a master function which should have all functionality
  pageReady();

  //////////
  // COMMON
  //////////

  function initaos() {
    AOS.init();
  }

  function legacySupport() {
    // svg support for laggy browsers
    svg4everybody();

    // Viewport units buggyfill
    window.viewportUnitsBuggyfill.init({
      force: false,
      refreshDebounceWait: 150,
      appendToBody: true
    });
  }

  // Prevent # behavior
  _document
    .on("click", '[href="#"]', function(e) {
      e.preventDefault();
    })
    .on("click", "a[href]", function(e) {
      if (Barba.Pjax.transitionProgress) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (e.currentTarget.href === window.location.href) {
        e.preventDefault();
        e.stopPropagation();
      }
    })
    .on("click", 'a[href^="#section"]', function(e) {
      // section scroll
      var el = $(this).attr("href");

      if ($(el).length === 0) {
        lastClickEl = $(this).get(0);
        Barba.Pjax.goTo($(".header__logo").attr("href"));
      } else {
        scrollToSection($(el));
      }

      return false;
    });

  function scrollToSection(el) {
    var headerHeight = $(".header").height();
    var targetScroll = el.offset().top - headerHeight;

    TweenLite.to(window, 1, {
      scrollTo: targetScroll,
      ease: easingSwing
    });
  }

  ////////////////////
  // CHANGE TITLE LOGIN PAGE
  ////////////////////
  _document.on("click", "[js-shipper-button]", function() {
    $(".carrier-title").hide();
    $(".shipper-title").fadeIn();
  });

  _document.on("click", "[js-carrier-button]", function() {
    $(".shipper-title").hide();
    $(".carrier-title").fadeIn();
  });

  ////////////////////
  // CHANGE TITLE LOGIN PAGE
  ////////////////////

  ////////////////////
  // CHANGE MAPS
  ////////////////////

  _document.on("click", "[js-open-lit]", function() {
    $(".contacts__map").removeClass("is-active");
    $(".lit-map").addClass("is-active");
  });

  _document.on("click", "[js-open-usa]", function() {
    $(".contacts__map").removeClass("is-active");
    $(".usa-map").addClass("is-active");
  });

  ////////////////////
  // CHANGE MAPS
  ////////////////////

  ////////////////////
  // SHOW PASSWORD TOGGLE
  ////////////////////

  _document.on("click", "[js-show-pass]", function(e) {
    e.preventDefault();
    $(this).toggleClass("show-pass");
    var x = document.getElementById("l2");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  });

  ////////////////////
  // SHOW PASSWORD TOGGLE
  ////////////////////

  ////////////////////
  // FORM TOGGLER
  ////////////////////

  _document.on("click", "[open-form]", function() {
    $(".form-block-hidden").slideToggle();
  });

  _document.on("click", "[close-form]", function() {
    $(".form-block-hidden").slideToggle();
  });

  //////////
  // SLIDERS
  //////////

  //////////
  // MODALS
  //////////

  ////////////
  // UI
  ////////////
  function initAutogrow() {
    if ($("[js-autogrow]").length > 0) {
      $("[js-autogrow]").each(function(i, el) {
        new Autogrow(el);
      });
    }
  }

  // Masked input
  function initMasks() {
    $("[js-dateMask]").mask("99.99.99", { placeholder: "ДД.ММ.ГГ" });
    // $("input[type='tel']").mask("(000) 000-0000", {
    //   placeholder: "+7 (___) ___-____"
    // });
  }

  // selectric
  function initSelectric() {
    $("select").selectric({
      maxHeight: 300,
      disableOnMobile: false,
      nativeOnMobile: false
    });
  }

  //////////
  // MAP
  //////////

  function initMap() {
    if ($("#contacts__map").length && _window.width() > 768 && !map) {
      map = new google.maps.Map(document.getElementById("contacts__map"), {
        center: mapCenter,
        zoom: 15,
        // gestureHandling: 'greedy',
        // scrollwheel: false,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles:[{featureType:"all",elementType:"labels.text.fill",stylers:[{saturation:36},{color:"#000000"},{lightness:40}]},{featureType:"all",elementType:"labels.text.stroke",stylers:[{visibility:"on"},{color:"#000000"},{lightness:16}]},{featureType:"all",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"administrative",elementType:"geometry.fill",stylers:[{color:"#000000"},{lightness:20}]},{featureType:"administrative",elementType:"geometry.stroke",stylers:[{color:"#000000"},{lightness:17},{weight:1.2}]},{featureType:"landscape",elementType:"geometry",stylers:[{color:"#000000"},{lightness:20}]},{featureType:"poi",elementType:"geometry",stylers:[{color:"#000000"},{lightness:21}]},{featureType:"road.highway",elementType:"geometry.fill",stylers:[{color:"#000000"},{lightness:17}]},{featureType:"road.highway",elementType:"geometry.stroke",stylers:[{color:"#000000"},{lightness:29},{weight:.2}]},{featureType:"road.arterial",elementType:"geometry",stylers:[{color:"#000000"},{lightness:18}]},{featureType:"road.local",elementType:"geometry",stylers:[{color:"#000000"},{lightness:16}]},{featureType:"transit",elementType:"geometry",stylers:[{color:"#000000"},{lightness:19}]},{featureType:"water",elementType:"geometry",stylers:[{color:"#000000"},{lightness:17}]}]
      });

      $.each(markersCoord, function(i, coords) {
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(coords.lat, coords.lng),
          map: map,
          icon: coords.marker
        });
        markers.push(marker);

        // click handler
        google.maps.event.addListener(marker, "click", function() {
          changeMapsMarker(null, marker);
        });
      });
    }
  }

  // change marker onclick
  _document.on("click", ".contacts__address", function() {
    if ( _window.width() <= 768 ){
      var tel = $(this).find('a').text()
      window.location.href = 'tel:'+tel+'';
    } else {
      var markerId = $(this).data("marker-id") - 1;
      if (markerId !== undefined) {
        changeMapsMarker(markerId);
      }
    }

  });

  function changeMapsMarker(id, marker, clear) {
    if ( id !== null){
    } else if ( marker !== null ){
      id = markers.indexOf(marker) // get id
    }
    var targetMarker = markers[id];

    // maps controls
    if (targetMarker) {
      map.panTo(targetMarker.getPosition());

      // set active class
      var linkedControl = $(
        ".contacts__address[data-marker-id=" + (id + 1) + "]"
      );

      if (linkedControl.length > 0) {
        $(".contacts__address").removeClass("is-active");
        linkedControl.addClass("is-active");
      }
    }

    if (clear) {
      $(".contacts__address").removeClass("is-active");
      map.panTo(mapCenter);
    }
  }

  ////////////////
  // FORM VALIDATIONS
  ////////////////

  // jQuery validate plugin
  // https://jqueryvalidation.org
  function initValidations() {
    // GENERIC FUNCTIONS
    var validateErrorPlacement = function(error, element) {
      error.addClass("ui-input__validation");
      error.appendTo(element.parent("div"));
    };
    var validateHighlight = function(element) {
      $(element)
        .parent("div")
        .addClass("has-error");
    };
    var validateUnhighlight = function(element) {
      $(element)
        .parent("div")
        .removeClass("has-error");
    };
    var validateSubmitHandler = function(form) {
      $(form).addClass("loading");
      $.ajax({
        type: "POST",
        url: $(form).attr("action"),
        data: $(form).serialize(),
        success: function(response) {
          $(form).removeClass("loading");
          var data = $.parseJSON(response);
          if (data.status == "success") {
            // do something I can't test
          } else {
            $(form)
              .find("[data-error]")
              .html(data.message)
              .show();
          }
        }
      });
    };

    var validatePhone = {
      required: true,
      normalizer: function(value) {
        var PHONE_MASK = "(XXX) XXX-XXXX";
        if (!value || value === PHONE_MASK) {
          return value;
        } else {
          return value.replace(/[^\d]/g, "");
        }
      },
      minlength: 11,
      digits: true
    };

    ////////
    // FORMS

    /////////////////////
    // REGISTRATION FORM
    ////////////////////
    $(".js-registration-form").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: validateSubmitHandler,
      rules: {
        // first_name: "required",
        // phone: "required",
        email: {
          required: true,
          email: true
        },
        password: {
          required: true
          // minlength: 6
        }
        // phone: validatePhone
      }
    });
    $(".js-form").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: validateSubmitHandler,
      rules: {
        first_name: "required",
        // phone: "required",
        email: {
          required: true,
          email: true
        },
        password: {
          required: true,
          minlength: 6
        }
        // phone: validatePhone
      }
    });
  }

  //////////
  // PAGINATION
  //////////
  var paginationAnchors, sections;

  function getPaginationSections() {
    paginationAnchors = $(".header__menu .header__menu-link");
    sections = $(".page__content [data-section]");
  }

  function pagination() {
    // Cache selectors
    var headerHeight = $(".header").height();
    var footerHeight = $(".footer").height();
    var vScroll = _window.scrollTop();
    var vScrollBottom = _document.height() - _window.height() - vScroll

    if (sections.length === 0) {
      paginationAnchors.removeClass("is-active");
      return false;
    }

    // Get id of current scroll item
    var cur = sections.map(function() {
      if ($(this).offset().top <= vScroll + headerHeight / 0.99) return this;
    });
    // Get current element
    cur = $(cur[cur.length - 1]);
    var id = cur && cur.length ? cur.data("section") : "1";

    if ( vScrollBottom < footerHeight ){
      id = $(sections[sections.length - 1]).data("section")
    }

    // Set/remove active class
    paginationAnchors
      .removeClass("is-active")
      .filter("[data-section='" + id + "']")
      .addClass("is-active");
  }

  //////////
  // BARBA PJAX
  //////////

  Barba.Pjax.Dom.containerClass = "page";

  var OverlayTransition = Barba.BaseTransition.extend({
    start: function() {
      Promise.all([this.newContainerLoading, this.fadeOut()]).then(
        this.fadeIn.bind(this)
      );
    },

    fadeOut: function() {
      var deferred = Barba.Utils.deferred();

      // store overlay globally to access in fadein
      this.$overlay = $('<div class="js-transition-overlay"></div>');
      this.$overlay.insertAfter(".header");
      $("body").addClass("is-transitioning");

      TweenLite.fromTo(
        this.$overlay,
        0.6,
        {
          x: "0%"
        },
        {
          x: "100%",
          ease: Quart.easeIn,
          onComplete: function() {
            deferred.resolve();
          }
        }
      );

      return deferred.promise;
    },

    fadeIn: function() {
      var _this = this; // copy to acces inside animation callbacks
      var $el = $(this.newContainer);

      $(this.oldContainer).hide();

      $el.css({
        visibility: "visible"
      });

      TweenLite.to(window, 0.2, {
        scrollTo: 1,
        ease: easingSwing
      });

      AOS.refreshHard();

      // TweenLite.set(this.$overlay, {
      //   rotation: 0.01,
      //   force3D: true
      // });

      TweenLite.fromTo(
        this.$overlay,
        1,
        {
          x: "100%",
          overwrite: "all"
        },
        {
          x: "200%",
          ease: Expo.easeOut,
          delay: 0.2,
          onComplete: function() {
            _this.$overlay.remove();
            triggerBody();
            $("body").removeClass("is-transitioning");
            _this.done();
          }
        }
      );
    }
  });

  // set barba transition
  Barba.Pjax.getTransition = function() {
    // return FadeTransition;
    return OverlayTransition;
  };

  Barba.Prefetch.init();
  Barba.Pjax.start();

  // event handlers
  Barba.Dispatcher.on("linkClicked", function(el) {
    lastClickEl = el; // save last click to detect transition type
  });

  Barba.Dispatcher.on("initStateChange", function(currentStatus) {
    var container = Barba.Pjax.Dom.getContainer();
    var haveContainer = $(container).find(".page__content").length > 0;

    if (!haveContainer) {
      // handle error - redirect ot page regular way
      window.location.href = currentStatus.url;
    }
  });

  Barba.Dispatcher.on("newPageReady", function(
    currentStatus,
    oldStatus,
    container,
    newPageRawHTML
  ) {
    pageReady();
  });

  Barba.Dispatcher.on("transitionCompleted", function() {
    getPaginationSections();
    pagination();

    if ($(lastClickEl).data("section")) {
      scrollToSection($($(lastClickEl).attr("href")));
    }
  });

  // some plugins get bindings onNewPage only that way
  function triggerBody() {
    $(window).scroll();
    $(window).resize();
  }
});
