switchModule.service('selectedSwitchDetailsService',
  ['$log',
   function ($log) {
     'use strict';
    var data = {};
    var data1 ={};
    var custData ={};
    var custData1 = {};
    return {
          getSelectedData: function () {
              return data1;
          },
          setSelectedData: function (data) {
              data1 = data;
          },

          getCustDetails: function () {
              return custData1;
          },
          setCustDetails: function (custData) {
              custData1 = custData;
          },
      };
}]);
