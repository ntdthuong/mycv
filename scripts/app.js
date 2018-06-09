/**
 * @name Site
 * @description Global variables and functions
 * @version 1.0
 */
var Site = (function ($, window) {
  'use strict';

  var vars = {
    win: $(window),
    doc: $(document),
    html: $('html'),
    body: $('body'),
    contents: $('html, body'),
    JSONTech: {

    },
    // loading: '<div class="wrapper-loading"><div class="loading"></div></div>',
    ajax: null,
    statusText: {
      success: 'success',
      error: 'error',
      abort: 'abort'
    },
    statusCode: {
      success: 200
    }
  }

  function isMobile() {
    return window.Modernizr.mq('(max-width: 1023px)');
  }

  function isDesktop() {
    return window.Modernizr.mq('(min-width: 1024px)');
  }

  function isLargeDesktop() {
    return window.Modernizr.mq('(min-width: 1367px)');
  }

  function isDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  function parseJSON(json) {
    var jsonData;
    if (json) {
      try {
        jsonData = JSON.parse(json);
      } catch (e) {
        jsonData = {};
      }
    }
    return jsonData;
  }

  function callAJAX(url, method, data, beforeSend, success, error) {
    var methodDefault = 'GET';
    method = method || methodDefault;
    if (method.toUpperCase() !== methodDefault) {
      data = JSON.stringify(data);
    }
    if (vars.ajax) {
      vars.ajax.abort();
    }
    vars.ajax = $.ajax({
      url: url,
      type: method,
      dataType: 'json',
      contentType: 'application/json',
      data: data,
      beforeSend: function() {
        if ($.isFunction(beforeSend)) {
          beforeSend();
        }
      },
      success: function(res, textStatus, jqXHR) {

        if ($.isFunction(success)) {
          success(res, textStatus, jqXHR);
        }
      },
      error: function(err) {

        if (vars.statusText.abort !== err.statusText) {

        }
        if ($.isFunction(error)) {
          error(err);
        }
      },
      complete: function() {

      }
    });
  }


  function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }

    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp("[?&]" + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);

    if (!results) {
      return null;
    }

    if (!results[2]) {
      return '';
    }

    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }



  Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
    switch (operator) {
      case '==':
        return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===':
        return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!=':
        return (v1 != v2) ? options.fn(this) : options.inverse(this);
      case '!==':
        return (v1 !== v2) ? options.fn(this) : options.inverse(this);
      case '<':
        return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=':
        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>':
        return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=':
        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      case '&&':
        return (v1 && v2) ? options.fn(this) : options.inverse(this);
      case '||':
        return (v1 || v2) ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  });

  Handlebars.registerHelper('assignId', function(title, id) {
    return title.toLocaleLowerCase().replace(/ /g, '-') + '-' + id;
  });

  Handlebars.registerHelper('formatDate', function(date) {
    if (date && moment(date).isValid()) {
      return moment(date).format('MM/DD/YYYY');
    } else {
      return '';
    }
  });

  Handlebars.registerHelper('convertToNameMonth', function(month) {
    return moment(month, 'MM').format('MMMM');
  });

  Handlebars.registerHelper('formatDayAndMonth', function(date) {
    return moment(date).format('DD MMM');
  });

  Handlebars.registerHelper('formatAMPM', function(date) {
    return moment(date).format('LT');
  });

  Handlebars.registerHelper('getClassByStatus', function(stt) {
    if (stt === 1) return 'unselect';
    return '';
  });
  Handlebars.registerHelper('checkStatusItem', function(stt) {
    if (stt === 1) return true;
    return false;
  });
  Handlebars.registerHelper('checkStatusJob1', function(stt) {
    if (stt === 1) return 'waiting';
    return '';
  });
  Handlebars.registerHelper('checkStatusJob2', function(stt) {
    if (stt === 1) return 'orange';
    return '';
  });
  Handlebars.registerHelper('checkStatusJob3', function(stt) {
    if (stt === 1) return 'disabled';
    return '';
  });

  $.fn.serializeFormJSON = function () {
    var o = {};
    var a = this.serializeArray();
    var specKeys = this.find('[data-speckey]');
    var convertArray = this.find('[data-convert-array]');
    var newItems = this.find('[data-new-item-key]');
    var ajaxData = this.find('[data-custom-ajax-data]');
    var multipleSelect = this.find('select[multiple=""]');
    var defaultValue = this.find('[data-default-value]');

    $.each(a, function () {
      if (o[this.name]) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });

    if (specKeys.length) {
      $.each(specKeys, function() {
        var key = $(this).data('speckey');
        o[this.name] = {};
        o[this.name][key] = this.value;
      });
    }
    if (convertArray.length) {
      $.each(convertArray, function() {
        if (typeof o[this.name] === 'string') {
          o[this.name] = [o[this.name]];
        }
      });
    }

    if (multipleSelect.length) {
      $.each(multipleSelect, function() {
        o[$(this).attr('name')] = $(this).val();
      });
    }

    if (newItems.length) {
      $.each(newItems, function() {
        var key = $(this).data('newItemKey');
        if (!o[key]) {
          $(this).prop('checked') && (o[key] = [this.value]);
        } else {
          $(this).prop('checked') && o[key].push(this.value);
        }
      });
    }
    if (ajaxData.length) {
      ajaxData.each(function(idx, elm) {
        o = $.extend({}, o, $(elm).data('custom-ajax-data').getData());
      });
      var ignoreKey = ajaxData.find('[data-key]');
      ignoreKey.each(function(idx, elm) {
        delete o[$(elm).attr('name')];
      });
    }
    if (defaultValue.length) {
      $.each(defaultValue, function() {
        if (!o[this.name]) {
          var value = $(this).data('defaultValue');
          o[this.name] = value;
        }
      });
    }
    return o;
  };


  return {
    vars: vars,
    isMobile: isMobile,
    isDesktop: isDesktop,
    isLargeDesktop: isLargeDesktop,
    isDevice: isDevice,
    parseJSON: parseJSON,
    callAJAX: callAJAX,
    getParameterByName: getParameterByName
  };

})(jQuery, window);

jQuery(function() {

});

/**
 *  @name scale-image-ie
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    publicMethod
 *    destroy
 */
;(function($, window, undefined) {
  'use strict';

  var pluginName = 'scale-image-ie';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      console.log(1);
      if (Site.vars.html.hasClass('ie')) {
        var opts = this.options,
            src = this.element.find(opts.image).attr('src');
        this.element.addClass(opts.classActive).css('background-image', 'url(' + src + ')');
      }
    },
    destroy: function() {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {
    classActive: 'object-fit',
    image: 'img'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));


