productCalculator.service('pceHomeDataService',
['$window','$log','pceHomeDbService',
	function($window,$Log,pceHomeDbService){
  'use strict';
	var vm = this;
	vm.getProductsByChannelId = getProductsByChannelId;
	vm.getProductImagesClass = getProductImagesClass;
	vm.getRiderDetails = getRiderDetails;

	function getProductImagesClass(productid){
		var iconClass =  'prodbxAs';
		switch(parseInt(productid)){
			case 1:
				iconClass = "prodbxAs";
			break;
			case 2:
				iconClass = "prodbxSamd";
			break;
			case 10:
				iconClass = "prodbxFs";
			break;
			case 12:
				iconClass = "prodbxEadv";
			break;
			case 13:
				iconClass = "prodbxSSeries";
			break;
			case 14:
				iconClass = "prodbxChiadv";
			break;
		}
		return iconClass;
	}

	function getRiderDetails(productId){
		return pceHomeDbService.getSelectedProductRiderData(productId)
		.then(function(riderssData){
			return riderssData;
		});
	}

	function getProductsByChannelId(channelId){
			return pceHomeDbService.getAllProductsByChannelId(channelId)
			.then(function(productsData){
				for(var i = 0; i<productsData.length;i++){
					productsData[i].iconClass = vm.getProductImagesClass(productsData[i].FkProductId);

				}
				return productsData;
			});
}

}]);
