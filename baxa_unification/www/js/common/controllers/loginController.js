unificationBAXA.controller('loginController', ['$scope',
  '$log',
  '$state',
  '$http',
  '$ionicLoading',
  'commonDBFuncSvc',
  'apiUrl',
  'AuthenticationService',
  'quoteProposalRefNosFactory',
  'quoteProposalNosDataService',
  'getSetCommonDataService',
  'utilityService',
  function($scope, $log, $state, $http, $ionicLoading, commonDBFuncSvc, apiUrl, AuthenticationService, quoteProposalRefNosFactory, quoteProposalNosDataService, getSetCommonDataService,utilityService) {
    'use strict';
    $scope.data = {};
    /**temp hardcoded **/
    $scope.data.username = "Agency_User_1";
    $scope.data.password = "Fulcrum#1";
    $scope.data.passwordType = "sha-256";
    /**temp hardcoded **/
    $scope.logindata = [{
     "Username": "Agency_User_1",
     "Password": "Fulcrum#1",
     "Channel_id": 1,
     "Channel_name": "agency",
     "AgentId" : 1001
    }, {
     "Username": "Agency_User_2",
     "Password": "Fulcrum#1",
     "Channel_id": 1,
     "Channel_name": "agency",
     "AgentId" : 1002
    }, {
     "Username": "DSF_User_1",
     "Password": "Fulcrum#1",
     "Channel_name": "DSF",
     "Channel_id": 2,
      "AgentId" : 1003
    }, {
     "Username": "DSF_User_2",
     "Password": "Fulcrum#1",
     "Channel_id": 2,
     "Channel_name": "DSF",
     "AgentId" : 1004
    }, {
     "Username": "Bluechip_User_1",
     "Password": "Fulcrum#1",
     "Channel_id": 3,
     "Channel_name": "agency",
     "AgentId" : 1005
    }, {
     "Username": "Bluechip_User_2",
     "Password": "Fulcrum#1",
     "Channel_id": 3,
     "Channel_name": "agency",
     "AgentId" : 1006
    }];

    $scope.doLogin = function(data) {
        $log.debug('$scope.logindata ::: ', data);
        //Dummy JSON data loading
        var users = $scope.logindata;
        //dummy validations
        var validationData = [];
        for (var i = 0; i < users.length; i++) {
          validationData.push(users[i].Username);
        }
        if (validationData.indexOf(data.username) !== -1) {
          var usersData = users[validationData.indexOf(data.username)];
          /*success*/
          var userCommonData = {
            agentId: usersData.AgentId,
            channelId: usersData.Channel_id,
            channelName: usersData.Channel_name,
            mPwd : utilityService.getMPwd(data.password,data.passwordType),
            userName: data.username
          };
          getSetCommonDataService.setCommonData(userCommonData);
          /**temp store data**/
          localStorage.setItem("agentId", userCommonData.agentId);
          localStorage.setItem("channelId",  userCommonData.Channel_id);
          localStorage.setItem("channelName", userCommonData.channelName);
          localStorage.setItem("userName", userCommonData.userName);
          localStorage.setItem("mPwd",userCommonData.mPwd);
          $ionicLoading.show({
            template: '<ion-spinner icon="android"></ion-spinner><p>Please wait..</br>Initializing Data</p>'
          });
          commonDBFuncSvc.initiateSync().then(function(result){
            if(result){
              quoteProposalNosDataService.getBIProposalRefNoData();
              $ionicLoading.hide();
              $state.go('app.home');
            }
          });

        } else {
          $log.debug("login failed");
        }
    };
  }
]);
