// otherCalculators.directive('allowOnlyNumbers', function () {
//     return {
//         restrict: 'A',
//         link: function (scope, elm, attrs, ctrl) {
//             elm.on('keydown', function (event) {
//                 var $input = $(this);
//                 var value = $input.val();
//                 value = value.replace(/[^0-9]/g, '')
//                 $input.val(value);
//
//                 if (event.which == 64 || event.which == 16) {
//                     // to allow numbers
//                     return false;
//                 } else if (event.which >= 48 && event.which <= 57) {
//                     // to allow numbers
//                     return true;
//                 } else if (event.which >= 96 && event.which <= 105) {
//                     // to allow numpad number
//                     return true;
//                 } else if ([8, 13, 27, 37, 38, 39, 40].indexOf(event.which) > -1) {
//                     // to allow backspace, enter, escape, arrows
//                     return true;
//                 } else {
//                     event.preventDefault();
//                     // to stop others
//                     //alert("Sorry Only Numbers Allowed");
//                     return false;
//                 }
//             });
//         }
//     }
// });
//
// otherCalculators.directive('lowerThan', [
//   function() {
//
//     var link = function($scope, $element, $attrs, ctrl) {
//
//       var validate = function(viewValue) {
//         var comparisonModel = $attrs.lowerThan;
//
//         if(!viewValue || !comparisonModel){
//           // It's valid because we have nothing to compare against
//           ctrl.$setValidity('lowerThan', true);
//         }
//
//         // It's valid if model is lower than the model we're comparing against
//         ctrl.$setValidity('lowerThan', parseInt(viewValue, 10) < parseInt(comparisonModel, 10) );
//         return viewValue;
//       };
//
//       ctrl.$parsers.unshift(validate);
//       ctrl.$formatters.push(validate);
//
//       $attrs.$observe('lowerThan', function(comparisonModel){
//         // Whenever the comparison model changes we'll re-validate
//         return validate(ctrl.$viewValue);
//       });
//
//     };
//
//     return {
//       require: 'ngModel',
//       link: link
//     };
//
//   }
// ]);
