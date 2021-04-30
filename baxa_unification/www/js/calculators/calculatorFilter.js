otherCalculators.filter('amtunit', function() {
  'use strict';
  return function(input) {
    var val = input || '';
    var out = "";
    if (val >= 10000000) out = (val / 10000000).toFixed(2) + ' Cr';    
    else if (val >= 100000 && val < 10000000) out = (val / 100000).toFixed(2) + ' Lac';    
    else if (val >= 1000 && val < 100000) out = (val / 1000).toFixed(2) + ' K';    
    return out; 
    //return out;
  };
});

otherCalculators.filter('amtconvert', function() {
  'use strict';
  return function(input, unit) {
    var val = input || '';
    var out = "";
    if (unit == 'Cr') {
      out = (val / 10000000).toFixed(2);
    } 
    else if (unit == 'L') {
      out = (val / 100000).toFixed(2);
    } else if (unit == 'K') {
      out = (val / 1000).toFixed(2);
    }
    return +(Math.round(out + "e+2") + "e-2") + ' ' + unit;
  };
});
