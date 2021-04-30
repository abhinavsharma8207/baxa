otherCalculators.directive('numericsaving', function() {
    'use strict';
    return {
      restrict: 'A',
      require: '?ngModel',
      scope: {
        model: '=ngModel'
      },
      link: function(scope, element, attrs, ngModelCtrl) {
        if (!ngModelCtrl) {
          return;
        }
        ngModelCtrl.$parsers.push(function(value) {
          if (!value || value === '' || isNaN(parseInt(value)) || parseInt(value) != value) {
            value = 0;
          }
          return parseInt(value);
        });
      }
    };
  })
  .directive('stringToNumber', function() {
    'use strict';
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function(value) {
          return '' + value;
        });
        ngModel.$formatters.push(function(value) {
          return parseFloat(value, 10);
        });
      }
    };
  })
  .directive('inputMaxLengthNumber', function() {
    'use strict';
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function(scope, element, attrs, ngModelCtrl) {
        function fromUser(text) {
          var maxlength = Number(attrs.maxlength);
          if (String(text).length > maxlength) {
            ngModelCtrl.$setViewValue(ngModelCtrl.$modelValue);
            ngModelCtrl.$render();
            return ngModelCtrl.$modelValue;
          }
          return text;
        }
        ngModelCtrl.$parsers.push(fromUser);
      }
    };
  })
  .directive('digitOnly', function() {
    'use strict';
    return {
      require: 'ngModel',
      link: function(scope, element, attr, mCtrl) {
        function myValidation(value) {
          var re = /^-?[0-9]+$/;
          if (re.test(value)) {
            mCtrl.$setValidity('charE', true);
          } else {
            mCtrl.$setValidity('charE', false);
          }
          return value;
        }
        mCtrl.$parsers.push(myValidation);
      }
    };
  })
  .directive("limitTo", [function() {
    'use strict';
    return {
      restrict: "A",
      link: function(scope, elem, attrs) {
        var limit = parseInt(attrs.limitTo);
        angular.element(elem).on("keydown", function() {
          if (event.keyCode > 47 && event.keyCode < 127) {
            if (this.value.length == limit)
              return false;
          }
        });
      }
    };
  }]);
