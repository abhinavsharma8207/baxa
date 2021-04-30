/**
* Created By: Anushree K
* Future Invest Calculation Controller
*
* @class fICalculationController
* @submodule core-controller
* @constructor
*/
productCalculator.controller(
   'fICalculationController',[
    '$scope',
    '$log',
    'fIDataService',
    'fICalculationService',
    'fIValidationService',
    function($scope,$log,fIDataService,fICalculationService,fIValidationService){
        /*Temprory product code it will be dynamic once new flow is implemented*/

        var prodId = 11;
        var channelId = 1;
        $scope.data = {};


        $scope.data = {
            laName: "ABC",
            laAge: 35,
            laGender: 0,
            isSelf: true,
            proposerName: "ABC",
            proposerAge: 50,
            proposerGender: 0,
            sumAssured: 125000,
            basePremium: 100000,
            ppt: 1,
            pt: 10,
            NSAPForLA: true,
            premiumMode: 1
         };

        $scope.errorMessages = [];

        /*Set dropdown of premium payment term*/
        $scope.getPpt = function(prodId, channelId) {
            var ppt = fIDataService.getAllPremiumPaymentTerm(prodId, channelId);
            ppt.then(function(val){
                $scope.ppts = val;
            });
        };

        $scope.getFunds = function(prodId, channelId) {
            var fund = fIDataService.getAllFunds(prodId, channelId);
            fund.then(function(val){
                $scope.funds = val;
            });
        };
        $scope.getFunds(prodId, channelId);
        $scope.getPpt(prodId, channelId);
        /*Based on premium payment term set premium term*/
        $scope.populatePT = function(ppt) {
            $log.debug('pt',ppt);
            fIDataService.getpaymentTerm(prodId, channelId, ppt).then(function(val) {
                $scope.data.pt = val;
            });

        };
        /*Based on base premium entered set sumassured value*/
        $scope.populateSumAssured = function(basePremium, ppt){
            $log.debug("====",basePremium);
            if(basePremium !== undefined){
                fICalculationService.calcfISumAssured(prodId, channelId, basePremium, ppt)
                .then( function(val) {
                    $log.debug("====",val);
                    $scope.data.sumAssured = val;
                });
            }
        };
        /*Based on sumassured entered set base premium value*/
        $scope.populateBasePremium =function(sumAssured, ppt){
                $log.debug("====+++",sumAssured);
            if(sumAssured !== undefined){
                fICalculationService.calcfIBasePremium(prodId, channelId, sumAssured, ppt)
                .then( function(val) {
                    $log.debug("====+++",val);
                    $scope.data.basePremium = val;
                });
            }
        };

        /*This function will validate the fields useing database credentials.*/
        $scope.dbValidation = function(data){
            var prodCode;
            var isValid;
            var i;
            var temp = '';
            var payType;
            for(i = 0; i<$scope.ppts.length; i++){
                if($scope.ppts[i].id == data.ppt){
                     break;
                    }
                }

                payType = $scope.ppts[i].name;
                payType = payType.trim();
                payType = payType.split(' ');
                for(i = 0; i < payType.length; i++){
                    temp = temp+payType[i];
                }
                payType = temp.toUpperCase();

                fIValidationService.validateBaseProduct(prodId, channelId, data, payType)
                .then(function(messages) {
                    $scope.dbError = "";
                    $scope.errorMessages = messages;
                    $log.debug("final",messages);
                    if(messages.length == 0){
                        $scope.showDbErrors = false;
                        $scope.dbError = "";
                        $scope.calculateFiPremium(prodId, channelId, data);
                    }else{
                        $scope.showDbErrors = true;
                        $scope.dbErrors = messages[0];
                    }
                });
        };



        /*function will calculate BI & Base for this product*/
        $scope.calculateFiPremium = function(prodId, channelId, data){
            var answer  = fICalculationService.calculateTotalPremium(prodId, channelId, data);
            $log.debug('data.basePremium',data);
            answer.then(function(basePremiumResult){
                $log.debug(':premi:',basePremiumResult);
                $scope.answer = basePremiumResult;
                var BI = basePremiumResult.BIVal;
                BI.then(function(res){
                    $scope.BIData = res;
                    $log.debug($scope.data.BIData);
                });
            });
            $scope.showOutput=true;
            $scope.biOutput=true;

        };
}]);
