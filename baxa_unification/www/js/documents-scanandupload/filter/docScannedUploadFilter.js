documentScanAndUpload.filter('unique', function() {
  'use strict';
  return function(input, key) {
    var unique = {};
    var uniqueList = [];
    for (var i = 0; i < input.length; i++) {
      if (typeof unique[input[i][key]] == "undefined") {
        unique[input[i][key]] = "";
        uniqueList.push(input[i]);
      }
    }
    return uniqueList;
  };
});

documentScanAndUpload.filter('syncDocumentTypes', function($rootScope) {
  'use strict';
  return function(text) {
    var found = false;
    for (var i = 0; i < $rootScope.thumbanilsForAllDocumentTypes.length; i++) {
      if ($rootScope.thumbanilsForAllDocumentTypes[i].FkDocumentTypeId ==
        text.value && $rootScope.thumbanilsForAllDocumentTypes[i].DocumentFor ==
        $rootScope.proposerOrLifeAssured) {
        if ($rootScope.thumbanilsForAllDocumentTypes[i].IsSynced == 1) {
          found = true;
        }
      }
    }
    return found;
  };
});

unificationBAXA.filter('syncSubtypes', function($rootScope) {
  'use strict';
  return function(text, search) {
    var found = false;
    for (var i = 0; i < $rootScope.thumbanilsForAllSubtypes.length; i++) {
      if ($rootScope.thumbanilsForAllSubtypes[i].FkDocumentSubTypeId ==
        text.FkDocumentSubTypeId && $rootScope.thumbanilsForAllSubtypes[i]
        .FkDocumentTypeId == text.FkDocumentTypeId && $rootScope.thumbanilsForAllSubtypes[
          i].DocumentFor == $rootScope.proposerOrLifeAssured) {
        if ($rootScope.thumbanilsForAllSubtypes[i].IsSynced == 1) {
          found = true;
        }
      }
    }
    return found;
  };
});

unificationBAXA.filter('thumbnails', function($rootScope, Base64) {
  'use strict';
  return function(text) {
    var found = false;
    for (var i = 0; i < $rootScope.thumbanilsForAllSubtypes.length; i++) {
      if ($rootScope.thumbanilsForAllSubtypes[i].FkDocumentSubTypeId ==
        text.FkDocumentSubTypeId && $rootScope.thumbanilsForAllSubtypes[i]
        .FkDocumentTypeId == text.FkDocumentTypeId && $rootScope.thumbanilsForAllSubtypes[
          i].DocumentFor == $rootScope.proposerOrLifeAssured) {
        var images = $rootScope.thumbanilsForAllSubtypes[i].DocumentData;
        images = images.split(',');
        found = true;
        if (images[images.length - 1] == 0) {
          return false;
        }
        return Base64.decode(images[images.length - 1]);
      }
    }
    if (found == false) {
      return found;
    }
  };
});

unificationBAXA.filter('dateformat', function($filter) {
  'use strict';
  var suffixes = ["th", "st", "nd", "rd"];
  return function(text) {
    var res = text.split("/");
    text = res[1] +'/'+ res[0] +'/'+ res[2];
    var ddMMMMyyyy = $filter('date')(new Date(text), 'ddoo MMMM, yyyy');
    var day = parseInt($filter('date')(new Date(text), 'dd'));
    var relevantDigits = (day < 30) ? day % 20 : day % 30;
    var suffix = (relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0];
    return ddMMMMyyyy.replace('oo', suffix);
  };
});
