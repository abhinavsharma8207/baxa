eAppModule.service(
'eAppForms', [
  '$q',
  '$log',
  'commonDBFuncSvc',
  'commonDbProductCalculation',
  function($q, $log, commonDBFuncSvc, commonDbProductCalculation){
    var obj               = this;
    obj.renderFields      = renderFields;

    function validation(params){
      return;
    }

    function condition(params){
      return;
    }

    function dependent(params){
      return;
    }

    function renderFields(fields, dependent){

      if(typeof fields === 'object'){
        var personalFields  = fieldsPersonal();
        var profileFileds   = fieldsProfile();
        var newProfileFiles = [];

        for(var fKey in fields){
          /*If field is having any dependent*/
          if(typeof fields[fKey] == "boolean" && fKey in personalFields){
            newProfileFiles[fKey] = personalFields[fKey];
          }
          else if(typeof fields[fKey] == "object"){
            var children    = [];

            if('dependent' in fields[fKey]){
              if(typeof fields[fKey].dependent == "string" && fields[fKey].dependent in personalFields){
                children[fields[fKey].dependent] = personalFields[fields[fKey].dependent];
              }
              else if(typeof fields[fKey].dependent == "object"){
                for(var dKey in fields[fKey].dependent){
                  if(dKey in personalFields){
                    children[dKey] = personalFields[dKey];
                  }
                }
              }
            }

            if('validation' in fields[fKey]){
              if(typeof fields[fKey].validation == "string"){
              }
              else if(typeof fields[fKey].validation == "object"){
              }
            }

            newProfileFiles[fKey] = personalFields[fKey];
            newProfileFiles[fKey].child = children;
          }
        }

        return newProfileFiles;
      }
      return;
    }

    function getFieldFromArray(field, params){
    }

    function fieldsPersonal(){
      return {
        "firstName": {"type":"text","label":"First Name","required":true},
        "gender": {"type":"radio","label":"Gender","options":['Male','Female']},
        "maritalStatus": {"type":"radio","label":"Marital Status","options":['Single','Married','Divorced','Widowed']}
      };
    }

    function fieldsProfile(){
      return {
        "businessType": {"type":"radio","label":"Type of Business","options":['URBAN','RURAL']},
        "alcohol": {"type":"radio","label":"Alcohol Consumption","options":['YES','NO']},
        "alcoholBeer":{"type":"select","label":"Beer","options":["In a Week","In a Month","In a Year"]}
      };
    }
}]);
