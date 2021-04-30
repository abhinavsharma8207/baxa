unificationBAXA
  .factory('quoteProposalRefNosFactory', ['$http', '$log', 'apiUrl', function($http, $log, apiUrl) {
    'use strict';
    return {
      getBIQuoteNumbers: function(agentId, token) {
        $log.debug("calling getBIQuoteNumbers");
        $log.debug("agentId.....", agentId);
        var config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
        var data = {
          "agentId": "" + agentId,
          "sequenceCode": ["QUOTE"]
        };
        return $http.post(apiUrl + '/ws/v1/ws/ask/sequence?T=' + token, data, config);
      },
      getProposalNumbers: function(agentId, token) {
        $log.debug("calling getProposalNumbers");
        $log.debug("agentId.....", agentId);
        var config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
        var data = {
          "agentId": "" + agentId,
          "sequenceCode": ["PROPOSAL"]
        };
        return $http.post(apiUrl + '/ws/v1/ws/ask/sequence?T=' + token, data, config);
      },
    };
  }]);

unificationBAXA
  .factory('AuthenticationService', ['$http', '$log', 'apiUrl', function($http, $log, apiUrl) {
    'use strict';
    return {
      getAuthToken: function() {
        $log.debug("calling getAuthToken.....");
        var config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        };
        var data = 'A=' + 'L' + '&U=' + localStorage.getItem('userName') + '&P=' + localStorage.getItem('mPwd') + '&GT=' + '1' + '';
        return $http.post(apiUrl + '/api/v1/sync/auth', data, config);
      },
    };
  }]);

  unificationBAXA
    .factory('sendBIEmailService', ['$http', '$log', 'apiUrl', function($http, $log, apiUrl) {
      'use strict';
      return {
        sendBIEmail: function(emailData) {
          $log.debug("calling sendBIEmail.....");
          var config = {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          };
          var data = emailData;
          return $http.get('js/switch/validationMessage.json');
        },
      };
    }]);
