productCalculator.service('pceHomeDbService',
  ['$log',
   '$q',
   'commonDBFuncSvc',
   'utilityService',
    function($log,
             $q,
             commonDBFuncSvc,
             utilityService){

  'use strict';
  var vm = this;
  vm.getAllProductsByChannelId = getAllProductsByChannelId;
  vm.getSelectedProductRiderData = getSelectedProductRiderData;

  function getAllProductsByChannelId(channelId){
    $log.debug("channelId : ",channelId);
      var q = $q.defer();
      var _currentDate = utilityService.getDisplayDate(new Date(), "yyyy-MM-dd HH:mm:ss");
      var parameters = ["" + channelId, "" + 1, _currentDate];

      var queryStr =
      "Select PceMapChannelProduct.FkProductId,(SELECT Name FROM PceMstProduct " +
      "WHERE PceMstProduct.PkProductId  = PceMapChannelProduct.FkProductId) AS Name, " +
      "(SELECT Label FROM PceMstProduct " +
      "WHERE PceMstProduct.PkProductId  = PceMapChannelProduct.FkProductId) AS Label, " +
      "(SELECT UIN FROM PceMstProduct " +
      "WHERE PceMstProduct.PkProductId  = PceMapChannelProduct.FkProductId) AS UIN, " +
      "(SELECT IsRider FROM PceMstProduct " +
      "WHERE PceMstProduct.PkProductId  = PceMapChannelProduct.FkProductId) AS IsRider " +
      "From  PceMapChannelProduct " +
      "INNER JOIN PceMstProduct ON " +
      "PceMstProduct.PkProductId  = PceMapChannelProduct.FkProductId " +
      "where FkChannelId = ? AND PceMstProduct.IsActive=?" +
      " AND ? BETWEEN " +
      "strftime('%Y-%m-%d %H:%M:%S',substr(PceMstProduct.StartDate,7,4) || '-' || " +
      "substr(PceMstProduct.StartDate,1,2) || '-' || " +
      "substr(PceMstProduct.StartDate,4,2) || substr(PceMstProduct.StartDate, 11,9))" +
      " AND " +
      "strftime('%Y-%m-%d %H:%M:%S',substr(PceMstProduct.EndDate,7,4) || '-' || " +
      "substr(PceMstProduct.EndDate,1,2) || '-' || " +
      "substr(PceMstProduct.EndDate,4,2) || substr(PceMstProduct.EndDate, 11,9))";
      commonDBFuncSvc.
        query(queryStr,parameters)
        .then(function (result) {
          var productsData = commonDBFuncSvc.getAll(result);
          $log.debug("productsData : ",productsData);
          q.resolve(productsData);
        });
        return q.promise;
    }

    function getSelectedProductRiderData(productId){
      var q = $q.defer();
      var parameters = [""+productId];
      var queryStr = "SELECT pr.FkRiderId, pp.Name, pp.Label, pp.UIN FROM PceMstProduct as pp INNER JOIN PceMapProductRider as pr ON pp.PkProductId = pr.FkRiderId WHERE pr.FkProductId=?";
      commonDBFuncSvc.
        query(queryStr,parameters)
        .then(function (result) {
          var ridersData = commonDBFuncSvc.getAll(result);
          $log.debug("ridersData : ",ridersData);
          q.resolve(ridersData);
        });
        return q.promise;
    }

}]);
