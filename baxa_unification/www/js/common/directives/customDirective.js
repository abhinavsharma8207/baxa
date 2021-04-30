/*Directive for alpha numeric values allowed in input field.*/
unificationBAXA.directive('validAlphanumeric', function() {
  'use strict';
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, element, attrs, ngModelCtrl) {
      if (!ngModelCtrl) {
        return;
      }
      ngModelCtrl.$parsers.push(function(val) {
        if (angular.isUndefined(val)) {
          val = '';
        }
        var clean = val.replace(/[^a-zA-Z0-9]+/g, '');
        if (val !== clean) {
          ngModelCtrl.$setViewValue(clean);
          ngModelCtrl.$render();
        }
        return clean;
      });
      element.bind('keypress', function(event) {
        if (event.keyCode === 32) {
          event.preventDefault();
        }
      });
    }
  };
});

unificationBAXA.directive('onlyAlphabets', function() {
  'use strict';
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attr, ngModelCtrl) {
      function fromUser(text) {
        var transformedInput = text.replace(/[^.a-zA-Z\s]/g, '');
        if (transformedInput !== text) {
          ngModelCtrl.$setViewValue(transformedInput);
          ngModelCtrl.$render();
        }
        return text;
      }
      ngModelCtrl.$parsers.push(fromUser);
    }
  };
});

unificationBAXA.directive('onlyDigits', function() {
  'use strict';
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function(inputValue) {
        if (inputValue === undefined) return '';
        var transformedInput = inputValue.replace(/[^0-9]/g, '');
        if (transformedInput !== inputValue) {
          modelCtrl.$setViewValue(transformedInput);
          modelCtrl.$render();
        }
        return transformedInput;
      });
    }
  };
});

unificationBAXA.directive('eAppTerms', function() {
  'use strict';
  return {
    restrict: 'AE',
    scope: {
      terms: "@",
      period: "@",
      ngModel: "@",
      eAppTerms: '='
    },
    link: function($scope, elt, attrs, modelCtrl) {
      $scope.$watch('eAppTerms', function(val) {
        if (val === undefined) return '';
        var terms = "";
        if ($scope.period) {
          terms = JSON.parse($scope.period);
          if (val in terms) {
            $scope.$parent.inputData.benefitPeriod = terms[val][0];
          }
        }
        if ($scope.terms !== "") {
          terms = JSON.parse($scope.terms);
          if (val in terms) {
            if ($scope.ngModel == 'inputData.pt') {
              $scope.$parent.inputData.pt = parseInt(terms[val][0]);
            } else if ($scope.ngModel == 'inputData.ppt') {
              $scope.$parent.inputData.ppt = parseInt(terms[val][0]);
            }
          }
        }
      });
    }
  };
});

unificationBAXA.directive('payTypePpt', function() {
  'use strict';
  return {
    restrict: 'AE',
    require: 'ngModel',
    scope: {
      ptype: "@",
      termsl: "@",
      termsr: "@",
      ptypewatch: '=',
      payTypePpt: '='
    },
    link: function($scope, elt, attrs, modelCtrl) {
      $scope.$watch('payTypePpt', function(val) {
        if (val === undefined) return '';
        if ($scope.termsl !== "" && $scope.ptype == 'LIMITED') {
          var termsl = JSON.parse($scope.termsl);
          if (val in termsl) {
            $scope.$parent.inputData.ppt = parseInt(termsl[val][0]);
            return parseInt(termsl[val][0]);
          }
        }
        if ($scope.termsr !== "" && $scope.ptype == 'REGULAR') {
          var termsr = JSON.parse($scope.termsr);
          if (val in termsr) {
            $scope.$parent.inputData.ppt = parseInt(termsr[val][0]);
            return parseInt(termsr[val][0]);
          }
        }
      });
      $scope.$watch('ptypewatch', function(val) {
        if (val === undefined) return '';
        if ($scope.termsl !== "" && val == 'LIMITED') {
          var termsl = JSON.parse($scope.termsl);
          if ($scope.payTypePpt in termsl) {
            $scope.$parent.inputData.ppt = parseInt(termsl[$scope.payTypePpt][0]);
            return parseInt(termsl[$scope.payTypePpt][0]);
          }
        }
        if ($scope.termsr !== "" && val == 'REGULAR') {
          var termsr = JSON.parse($scope.termsr);
          if ($scope.payTypePpt in termsr) {
            $scope.$parent.inputData.ppt = parseInt(termsr[$scope.payTypePpt][0]);
            return parseInt(termsr[$scope.payTypePpt][0]);
          }
        }
      });
    }
  };
});



unificationBAXA.directive('modelPremium', function() {
  'use strict';
  return {
    restrict: 'AE',
    scope: {
      terms: "@",
      ngMode: "@",
      ngPremimum: "@",
      modelPremium: '='
    },
    link: function($scope, elt, attrs, modelCtrl) {
      $scope.$watch('modelPremium', function(val) {
        if (val === undefined) return '';
        if ($scope.terms !== "") {
          var terms = JSON.parse($scope.terms);
          if (val in terms) {
            $scope.$parent.inputData.modalPremium = Math.round(parseInt($scope.ngPremimum) * parseFloat(terms[val][0]));
            return Math.round(parseInt($scope.ngPremimum) * parseFloat(terms[val][0]));
          }
          scope.$apply();
        }
      });
      $scope.$watch('ngPremimum', function(val) {
        if (val === undefined) return '';
        if ($scope.terms !== "") {
          var terms = JSON.parse($scope.terms);
          if ($scope.ngMode in terms) {
            $scope.$parent.inputData.modalPremium = Math.round(parseInt(val) * parseFloat(terms[$scope.ngMode][0]));
            return Math.round(parseInt(val) * parseFloat(terms[$scope.ngMode][0]));
          }
        }
      });
    }
  };
});






unificationBAXA.directive('modelPremiumDivide', function() {
  'use strict';
  return {
    restrict: 'AE',
    scope: {
      terms: "@",
      ngMode: "@",
      ngPremimum: "@",
      modelPremiumDivide: '='
    },
    link: function($scope, elt, attrs, modelCtrl) {
      $scope.$watch('modelPremiumDivide', function(val) {
        if (val === undefined) return '';
        if ($scope.terms !== "") {
          var terms = JSON.parse($scope.terms);
          if (val in terms) {
            $scope.$parent.inputData.modalPremium = Math.round(parseInt($scope.ngPremimum) / parseFloat(terms[val][0]));
            return Math.round(parseInt($scope.ngPremimum) / parseFloat(terms[val][0]));
          }
          scope.$apply();
        }
      });
      $scope.$watch('ngPremimum', function(val) {
        if (val === undefined) return '';
        if ($scope.terms !== "") {
          var terms = JSON.parse($scope.terms);
          if ($scope.ngMode in terms) {
            $scope.$parent.inputData.modalPremium = Math.round(parseInt(val) / parseFloat(terms[$scope.ngMode][0]));
            return Math.round(parseInt(val) / parseFloat(terms[$scope.ngMode][0]));
          }
        }
      });
    }
  };
});


unificationBAXA.directive('eAppPayType', function() {
  'use strict';
  return {
    restrict: 'AE',
    scope: {
      terms: "@",
      pptval: "@",
      eAppPayType: '='
    },
    link: function($scope, elt, attrs, modelCtrl) {
      $scope.$watch('eAppPayType', function(val) {
        if (val === undefined) return '';
        if ($scope.terms !== "") {
          var terms = JSON.parse($scope.terms);
          var search = (val == 'LIMITED') ? ("Limited Pay") : ("Regular Pay");
          if (terms[$scope.pptval] == search) {
            elt[0].style.display = "inline-block";
          } else {
            elt[0].style.display = "none";
            //$scope.$parent.inputData.ppt = 0;
            //$scope.$parent.inputData.pt = 0;
          }
        }
      });
    }
  };
});

unificationBAXA.directive('eAppBuyForAge', function() {
  'use strict';
  return {
    restrict: 'AE',
    scope: {
      buyfor : '=',
      eAppBuyForAge: '='
    },
    link: function($scope, elt, attrs, modelCtrl) {
      $scope.$watch('buyfor', function(val){
        if (val != 'Self') {
          $scope.$parent.lifeAssureAgeConfirmation = false;
          $scope.$parent.data.labfAge = "";
        }
      });
      $scope.$watch('eAppBuyForAge', function(val) {
        if ($scope.$parent.data.BuyingFor != 'Self') {
          $scope.$parent.lifeAssureAgeConfirmation = false;
        }
        if (val !== undefined && val !== ""){
          var cDate = new Date();
          var cYear = cDate.getFullYear();
          var cMonth = cDate.getMonth()+1;
          var cDay = cDate.getDate();
          var age = cYear - val.getFullYear();

          if (cMonth < (parseInt(val.getMonth())+1)) {
            age--;
          }
          if (((parseInt(val.getMonth())+1) == cMonth) && (cDay < val.getDate())) {
            age--;
          }

          if (age < 18 && $scope.$parent.data.BuyingFor == 'Self') {
            $scope.$parent.lifeAssureAgeConfirmation = true;
            $scope.$parent.data.labfAge = "";
          } else {
            $scope.$parent.lifeAssureAgeConfirmation = false;
          }
        }
      });
    }
  };
});

unificationBAXA.directive('validEmail', function() {
  'use strict';
  return {
       restrict: 'A',
       require: 'ngModel',
       link: function (scope, element, attr, ctrl) {
           function customValidator(ngModelValue) {
             //var reg=/^[a-z0-9]+[a-z0-9._]+@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
             var reg=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
               if (reg.test(ngModelValue)) {
                   ctrl.$setValidity('emailValidator', true);
               } else {
                   ctrl.$setValidity('emailValidator', false);
               }
               return ngModelValue;
           }
           ctrl.$parsers.push(customValidator);
       }
   };
});

unificationBAXA.directive('toggleAccordion', function() {
  'use strict';
  return {
    restrict: 'AE',
    scope: {
      target: '@',
      toggleAccordion: '='
    },
    link: function($scope, elt, attrs, modelCtrl) {
      $scope.$watch('toggleAccordion', function(val) {
        if (val === undefined) return '';
        if(!val){
          document.querySelector($scope.target).className = "icon-riderone collapsible-item";
        }
      });
    }
  };
});

unificationBAXA.directive('allowOnlyNumbers', function () {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs, ctrl) {
            elm.on('keydown', function (event) {
                var $input = $(this);
                var value = $input.val();
                value = value.replace(/[^0-9]/g, '')
                $input.val(value);
                if (event.which == 64 || event.which == 16) {
                    // to allow numbers
                    return false;
                } else if (event.which >= 48 && event.which <= 57) {
                    // to allow numbers
                    return true;
                } else if (event.which >= 96 && event.which <= 105) {
                    // to allow numpad number
                    return true;
                } else if ([8, 13, 27, 37, 38, 39, 40].indexOf(event.which) > -1) {
                    // to allow backspace, enter, escape, arrows
                    return true;
                } else {
                    event.preventDefault();
                    // to stop others
                    //alert("Sorry Only Numbers Allowed");
                    return false;
                }
            });
        }
    }
});

unificationBAXA.directive('lowerThan', [
  function() {
    var link = function($scope, $element, $attrs, ctrl) {
      var validate = function(viewValue) {
        var comparisonModel = $attrs.lowerThan;
        if(!viewValue || !comparisonModel){
          // It's valid because we have nothing to compare against
          ctrl.$setValidity('lowerThan', true);
        }
        // It's valid if model is lower than the model we're comparing against
        ctrl.$setValidity('lowerThan', parseInt(viewValue, 10) < parseInt(comparisonModel, 10) );
        return viewValue;
      };
      ctrl.$parsers.unshift(validate);
      ctrl.$formatters.push(validate);
      $attrs.$observe('lowerThan', function(comparisonModel){
        // Whenever the comparison model changes we'll re-validate
        return validate(ctrl.$viewValue);
      });
    };
    return {
      require: 'ngModel',
      link: link
    };
  }
]);

unificationBAXA.directive('lowerThan', [
  function() {

    var link = function($scope, $element, $attrs, ctrl) {

      var validate = function(viewValue) {
        var comparisonModel = $attrs.lowerThan;

        if(!viewValue || !comparisonModel){
          // It's valid because we have nothing to compare against
          ctrl.$setValidity('lowerThan', true);
        }

        // It's valid if model is lower than the model we're comparing against
        ctrl.$setValidity('lowerThan', parseInt(viewValue, 10) < parseInt(comparisonModel, 10) );
        return viewValue;
      };

      ctrl.$parsers.unshift(validate);
      ctrl.$formatters.push(validate);

      $attrs.$observe('lowerThan', function(comparisonModel){
        // Whenever the comparison model changes we'll re-validate
        return validate(ctrl.$viewValue);
      });

    };

    return {
      require: 'ngModel',
      link: link
    };
  }
]);

unificationBAXA.directive('numberFormat', function(){
  return {
      restrict: 'AE',
      link: function ($scope, elm, attrs, ctrl) {
        elm.on('focus', function(){
          elm.attr("ng-pattern", "/^[0-9,]*$/");
          elm.attr("type", "number");
        });
        elm.on('blur', function (event) {
          elm.removeAttr("ng-pattern");
          elm.attr("type", "text");
        });
      }
    };
});

unificationBAXA.directive("limitTo", [function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            var limit = parseInt(attrs.limitTo);
            angular.element(elem).on("keypress", function(e) {
                //if (this.value.length == limit) e.preventDefault();
                if(this.value > 100) e.preventDefault();
            });
        }
    }
}]);
