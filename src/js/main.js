$(document).ready(function() {
  //////////
  // Global variables
  //////////

  var _window = $(window);
  var _document = $(document);
  var easingSwing = [0.02, 0.01, 0.47, 1]; // default jQuery easing for anime.js
  var lastClickEl;

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
    initMasks();
    initAutogrow();
    initSelectric();
    initValidations();
    initSliders();
    initFile();
    initPopup();
    // initMap();

    // development helper
    _window.on("resize", debounce(setBreakpoint, 200));
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

  // HAMBURGER TOGGLER
  _document.on("click", "[js-hamburger]", function() {
    $(this).toggleClass("is-active");
    $(".header__nav").toggleClass("is-active");
    $("body").toggleClass("is-fixed");
    $("html").toggleClass("is-fixed");
  });

  _document.on("click", ".header__menu-link, .header__btn", closeMobileMenu);

  function closeMobileMenu() {
    $("[js-hamburger]").removeClass("is-active");
    $(".header__mobile").removeClass("is-active");
    $(".header__nav").removeClass("is-active");
    $(".hamburger").removeClass("is-active");
    $("body").removeClass("is-fixed");
    $("html").removeClass("is-fixed");
  }
  _document.on("click", "[js-close-popup]", function() {
    $(".mfp-close").click();
  });

  _document.on("click", "[js-login-close]", function() {
    // $(".mfp-close").click();
    // $("[js-registration-link]").click();
  });

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
      scrollTo: { y: targetScroll, autoKill: false },
      ease: easingSwing
    });
  }

  ////////////////////
  // CHANGE TITLE LOGIN PAGE
  ////////////////////
  _document.on("click", "[js-language-button]", function() {
    $(".header__o-languages a").removeClass("is-active");
    $(this).addClass("is-active");
  });

  _document.on("click", "[js-show-item]", function() {
    $(this)
      .parent()
      .parent()
      .parent()
      .parent()
      .addClass("is-hidden")
      .slideToggle();
    $(".menu-p__item-container").slideToggle("medium", function() {
      if ($(this).is(":visible")) $(this).css("display", "flex");
    });
  });

  _document.on("click", "[js-hide-item-container]", function() {
    $(".menu-p__tab.is-hidden").slideToggle("medium", function() {
      if ($(this).is(":visible")) $(this).css("display", "flex");
    });
    $(".menu-p__tab.is-hidden").removeClass("is-hidden");
    $(".menu-p__item-container").slideToggle();
  });

  _document.on("click", "[js-popular-tab]", function(e) {
    e.preventDefault();
    var $self = $(this),
      tabIndex = $self.index();
    $self.siblings().removeClass("is-active");
    $self.addClass("is-active");
    $(".popular__tab")
      .removeClass("is-active")
      .css("display", "none")
      .eq(tabIndex)
      .fadeIn();
  });

  _document.on("click", "[js-vacancies]", function(e) {
    e.preventDefault();
    var $self = $(this),
      tabIndex = $self.index();
    $self.siblings().removeClass("is-active");
    $self.addClass("is-active");
    $(".courier__tab")
      .removeClass("is-active")
      .css("display", "none")
      .eq(tabIndex)
      .fadeIn();
  });

  _document.on("click", "[js-menu-p-tab]", function(e) {
    e.preventDefault();
    var $self = $(this),
      tabIndex = $self.index();
    $self.siblings().removeClass("is-active");
    $self.addClass("is-active");
    $(".menu-p__item-container").css("display", "none");
    $(".menu-p__tab")
      .removeClass("is-active")
      .css("display", "none")
      .eq(tabIndex)
      .fadeIn();
  });

  _document.on("click", "[js-show-image]", function(e) {
    e.preventDefault();
    var $self = $(this),
      tabIndex = $self.index();
    $self.siblings().removeClass("is-active");
    $self.addClass("is-active");
    // $(".popup__image-items img").removeClass("show");
    $(".popup__image-items img")
      .removeClass("show")
      .eq(tabIndex)
      .addClass("show");
  });

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
  // input type file
  //////////
  function initFile() {
    setTimeout(function() {
      $("[js-file]").styler();
    }, 100);
  }

  //////////
  // POPUPS
  //////////
  function initPopup() {
    $("[js-open-popup]").magnificPopup({
      removalDelay: 500, //delay removal by X to allow out-animation
      callbacks: {
        beforeOpen: function() {
          this.st.mainClass = this.st.el.attr("data-effect");
        }
      },
      midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
    });
  }

  //////////
  // SLIDERS
  //////////

  function initSliders() {
    $("[js-main-slider]:not(.slick-initialized)").slick({
      // infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      dots: true,
      autoplay: true,
      autoplaySpeed: 5000
    });
    $("[js-main-slider-2]:not(.slick-initialized)").slick({
      // infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      dots: true
      // autoplay: true,
      // autoplaySpeed: 2000
    });
  }

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
      minlength: 11,
      digits: true,
      normalizer: function(value) {
        var PHONE_MASK = "+7 (XXX) XXX-XXXX";
        if (!value || value === PHONE_MASK) {
          return value;
        } else {
          return value.replace(/[^\d]/g, "");
        }
      }
    };

    jQuery.validator.messages.required = "";

    ////////
    // FORMS

    /////////////////////
    // REGISTRATION FORM
    ////////////////////
    $(".js-validation-form").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: validateSubmitHandler,
      rules: {
        name: "required",
        phone: validatePhone,
        mail: {
          required: true,
          email: true
        },
        captcha: "required",
        check: "required",
        agree: "required",
        point: "required",
        selectpoint: "required",
        number: "required",
        month: {
          required: true,
          minlength: 2,
          maxlength: 2
        },
        year: {
          required: true,
          minlength: 2,
          maxlength: 2
        },
        cvv: {
          required: true,
          minlength: 3,
          maxlength: 3
        },
        cash: "required",
        card: "required",
        agreedelivery: "required",
        city: "required",
        street: "required",
        building: "required",
        corp: "required",
        entrance: "required",
        flat: "required",
        cash1: "required",
        card1: "required",
        agreedelivery1: "required",
        agree1: "required"
      },
      messages: {
        name: "Заполните это поле",
        phone: {
          required: "Заполните это поле",
          minlength: "Введите корректный телефон"
        },
        mail: {
          required: "Заполните это поле",
          email: "E-mail содержит неправильный формат"
        },
        captcha: "Заполните это поле",
        check: "Заполните это поле",
        agree: "Заполните это поле",
        point: "Заполните это поле",
        selectpoint: "Заполните это поле",
        number: "Заполните это поле",
        month: "Заполните это поле",
        year: "Заполните это поле",
        cvv: "Заполните это поле",
        cash: "Выберите нужный вариант оплаты",
        card: "Выберите нужный вариант оплаты",
        agreedelivery: "Заполните это поле",
        city: "Заполните это поле",
        street: "Заполните это поле",
        building: "Заполните это поле",
        corp: "Заполните это поле",
        entrance: "Заполните это поле",
        flat: "Заполните это поле",
        cash1: "Выберите нужный вариант оплаты",
        card1: "Выберите нужный вариант оплаты",
        agreedelivery1: "Заполните это поле",
        agree1: "Заполните это поле"
      }
    });

    $(".js-registration-form").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: function(form) {
        $("[js-thanks-popup-registration]").click();
        $(form)
          .find("input")
          .val("");
      },
      rules: {
        name: "required",
        phone: validatePhone,
        mail: {
          required: true,
          email: true
        },
        agree: "required",
        captcha: "required"
      },
      messages: {
        name: "Заполните это поле",
        phone: {
          required: "Заполните это поле",
          minlength: "Введите корректный телефон"
        },
        mail: {
          required: "Заполните это поле",
          email: "E-mail содержит неправильный формат"
        },
        agree: "Заполните это поле",
        captcha: "Заполните это поле"
      }
    });

    $(".js-cabinet-form").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: function(form) {
        // $("[js-thanks-popup-registration]").click();
        $(form)
          .find("input")
          .val("");
      },
      rules: {
        name: "required",
        phone: validatePhone,
        mail: {
          required: true,
          email: true
        },
        agree: "required",
        point: "required",
        captcha: "required"
      },
      messages: {
        name: "Заполните это поле",
        phone: {
          required: "Заполните это поле",
          minlength: "Введите корректный телефон"
        },
        mail: {
          required: "Заполните это поле",
          email: "E-mail содержит неправильный формат"
        },
        agree: "Заполните это поле",
        point: "Заполните это поле",
        captcha: "Заполните это поле"
      }
    });
    $(".js-reset-pass-form").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: function(form) {
        $("[js-open-ty-reset]").click();
        $(form)
          .find("input")
          .val("");
      },
      rules: {
        phone: validatePhone
      },
      messages: {
        phone: {
          required: "Заполните это поле",
          minlength: "Введите корректный телефон"
        }
      }
    });

    $(".js-pay-form").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: function(form) {
        $("[js-open-ty-pay]").click();
        $(form)
          .find("input")
          .val("");
      },
      rules: {
        name: "required",
        number: "required",
        month: {
          required: true,
          minlength: 2,
          maxlength: 2
        },
        year: {
          required: true,
          minlength: 2,
          maxlength: 2
        },
        cvv: {
          required: true,
          minlength: 3,
          maxlength: 3
        }
      },
      messages: {
        name: "Заполните это поле",
        number: "Заполните это поле",
        month: "Заполните это поле",
        year: "Заполните это поле",
        cvv: "Заполните это поле"
      }
    });

    $(".js-callback-form").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: function(form) {
        $("[js-open-ty-callback]").click();
        $(form)
          .find("input")
          .val("");
      },
      rules: {
        name: "required",
        phone: validatePhone,
        mail: {
          required: true,
          email: true
        },
        captcha: "required",
        check: "required",
        agree: "required",
        point: "required",
        selectpoint: "required"
      },
      messages: {
        name: "Заполните это поле",
        phone: {
          required: "Заполните это поле",
          minlength: "Введите корректный телефон"
        },
        mail: {
          required: "Заполните это поле",
          email: "E-mail содержит неправильный формат"
        },
        captcha: "Заполните это поле",
        check: "Заполните это поле",
        agree: "Заполните это поле",
        point: "Заполните это поле",
        selectpoint: "Заполните это поле"
      }
    });

    $(".js-form-login").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: function(form) {
        $("[js-thanks-popup-login]").click();
        $(form)
          .find("input")
          .val("");
        // initSubmit();
        // $.ajax({
        //   type: "POST",
        //   url: $(form).attr("action"),
        //   data: $(form).serialize(),
        //   success: function(response) {
        //     $(form).removeClass("loading");
        //     var data = $.parseJSON(response);
        //     if (data.status == "success") {
        //       // do something I can't test
        //     } else {
        //       $(form)
        //         .find("[data-error]")
        //         .html(data.message)
        //         .show();
        //     }
        //   }
        // });
      },
      rules: {
        password: "required",
        phone: validatePhone
      },
      messages: {
        password: "Заполните это поле",
        phone: {
          required: "Заполните это поле",
          minlength: "Введите корректный телефон"
        }
      }
    });

    $.validator.setDefaults({
      ignore: [] // DON'T IGNORE PLUGIN HIDDEN SELECTS, CHECKBOXES AND RADIOS!!!
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
    var vScrollBottom = _document.height() - _window.height() - vScroll;

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

    if (vScrollBottom < footerHeight) {
      id = $(sections[sections.length - 1]).data("section");
    }

    // Set/remove active class
    paginationAnchors
      .removeClass("is-active")
      .filter("[data-section='" + id + "']")
      .addClass("is-active");
  }

  //////////
  // MAP
  //////////
  function initMap() {
    ymaps.ready(init);

    function init() {
      if ($("#delivery-map").length === 0) return false;

      var myMap = new ymaps.Map(
        "delivery-map",
        {
          center: [55.73, 37.75],
          zoom: 10
        },
        {
          searchControlProvider: "yandex#search"
        }
      );

      var myGeoObject = new ymaps.GeoObject(
        {
          geometry: {
            type: "Polygon",
            coordinates: [
              // Координаты вершин внешнего контура.
              [
                [55.75, 37.8],
                [55.8, 37.9],
                [55.75, 38.0],
                [55.7, 38.0],
                [55.7, 37.8]
              ],
              // Координаты вершин внутреннего контура.
              []
            ],
            fillRule: "nonZero"
          },
          properties: {
            balloonContent: "Описание зоны доставки"
          }
        },
        {
          // опции геообъекта.
          fillColor: "#00FF00",
          // Цвет обводки.
          // strokeColor: '#0000FF',
          // Общая прозрачность (как для заливки, так и для обводки).
          // opacity: 0.5,
          // Ширина обводки.
          strokeWidth: 5
          // Стиль обводки.
          // strokeStyle: 'shortdash'
        }
      );
    }
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
      this.$overlay = $(
        '<div class="js-transition-overlay" style="z-index: 9999; background: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center;"><img src="img/logotype.svg" style="width: 80%; max-width: 260px; height: auto;"></div>'
      );
      this.$overlay.insertAfter(".header-container");
      $("body").addClass("is-transitioning");

      TweenLite.fromTo(
        this.$overlay,
        1,
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

      if ($(lastClickEl).data("transitionScrolltop") !== false) {
        TweenLite.to(window, 0.2, {
          scrollTo: { y: 1, autoKill: false },
          ease: easingSwing
        });
      }

      if ($(lastClickEl).data("transitionScrolltocontent") === true) {
        var targetMenuPos = $(".menu-p")
          .last()
          .offset().top;
        TweenLite.to(window, 0.2, {
          scrollTo: { y: targetMenuPos, autoKill: false },
          ease: easingSwing
        });
      }

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
          delay: 0,
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
    $(".mfp-close").click();
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

  //////////
  // DEVELOPMENT HELPER
  //////////
  function setBreakpoint() {
    var wHost = window.location.host.toLowerCase();
    var displayCondition =
      wHost.indexOf("localhost") >= 0 || wHost.indexOf("surge") >= 0;
    if (displayCondition) {
      var wWidth = _window.width();

      var content = "<div class='dev-bp-debug'>" + wWidth + "</div>";

      $(".page").append(content);
      setTimeout(function() {
        $(".dev-bp-debug").fadeOut();
      }, 1000);
      setTimeout(function() {
        $(".dev-bp-debug").remove();
      }, 1500);
    }
  }
});
