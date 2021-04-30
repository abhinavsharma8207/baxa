unificationBAXA.filter('amtconvert', function() {
  return function(input, unit) {
    val = input || '';
    var out = "";
    if (unit == 'Cr') {
      out = (val / 10000000).toFixed(2);
    } else if (unit == 'L') {
      out = (val / 100000).toFixed(2)
    } else if (unit == 'K') {
      out = (val / 1000).toFixed(2);
    }
    return +(Math.round(out + "e+2") + "e-2") + ' ' + unit;
  };
});
