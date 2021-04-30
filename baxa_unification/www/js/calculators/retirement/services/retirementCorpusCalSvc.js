 unificationBAXA.service(
     'retCalSvc', [
         '$q',
         '$log',
         'commonFormulaSvc',
         'commonDBFuncSvc',
         'common_const',
        function($q,
        $log,
        commonFormulaSvc,
        commonDBFuncSvc,
        common_const) {
        'use strict';
         var retsv = this;
         var retCorpusobj;
         var retRevisedCorpusobj;
         retsv.calCorpus = calCorpus;
         retsv.retCorpusObjfunc = retCorpusObjfunc;
         retsv.calrevisedCorpus = calrevisedCorpus;
         retsv.retRevisedCorpusObjfunc = retRevisedCorpusObjfunc;

             function calCorpus(age, retage, currentMonthlyExpenses, inflation, retExpensesPercent, rateOfCorpus) {
                 var rretExpensesPercent = retExpensesPercent / 100;
                 var rinflation = inflation / 100;
                 var yearsLeftToRetire = retage - age;
                 var currentyearlyexpenses = currentMonthlyExpenses * 12;
                 var firstYearRetirementExpenses = currentyearlyexpenses * Math.pow((1 + rinflation), yearsLeftToRetire);
                 var postRetirementMonthlyExpenses = firstYearRetirementExpenses / 12 * rretExpensesPercent;
                 var rrateOfCorpus = rateOfCorpus / 100;
                 var corpusRequiredBeforedeclaringInvestments = firstYearRetirementExpenses / rrateOfCorpus;
                 var formula = 1 - Math.pow(1 + rrateOfCorpus, yearsLeftToRetire);
                 var annualInvestReq = -firstYearRetirementExpenses / formula;
                 var permonthInvestmentReq = annualInvestReq / 12;
                 retCorpusobj = {
                     age: age,
                     currentMonthlyExpenses: currentMonthlyExpenses,
                     inflation: inflation,
                     retExpensesPercent: retExpensesPercent,
                     retirementAge: retage,
                     expenses: postRetirementMonthlyExpenses,
                     corpus: corpusRequiredBeforedeclaringInvestments,
                     monthlyInvestNeeded: permonthInvestmentReq,
                     rateOfCorpus: rateOfCorpus
                 };
             }

             function calrevisedCorpus(currentLumpsumInvestment, currentMonthlyInvestment, currentLumpsumrateOfReturn, currentMonthlyrateOfReturn, yearsToRetire, retirementCorpReqBefInv) {
                 currentLumpsumrateOfReturn = currentLumpsumrateOfReturn / 100;
                 currentMonthlyrateOfReturn = currentMonthlyrateOfReturn / 100;
                 var totalLumpsumAssetsCreated = currentLumpsumInvestment * Math.pow((1 + currentLumpsumrateOfReturn), yearsToRetire);
                 //var yearlyInvestment = currentMonthlyInvestment * 12;
                 var totalMonthlyAssetsCreated =  currentMonthlyInvestment * 12;//yearlyInvestment * Math.pow((1 + currentMonthlyrateOfReturn), yearsToRetire);
                 var sumYearlyAndMonthlyAssetsUtilized = totalLumpsumAssetsCreated + totalMonthlyAssetsCreated;
                 var corpusObj = retsv.retCorpusObjfunc();
                 var revisedNewCorpus = corpusObj.corpus - sumYearlyAndMonthlyAssetsUtilized;
                 var formula = 1 - Math.pow(1 + corpusObj.rateOfCorpus / 100, yearsToRetire);
                 var revisedMonthlyInvestmentNeeded = - (corpusObj.rateOfCorpus / 100 * revisedNewCorpus) / formula;
                 revisedMonthlyInvestmentNeeded = revisedMonthlyInvestmentNeeded / 12;
                 retRevisedCorpusobj = {
                     currentLumpsumInvestment:currentLumpsumInvestment,
                     currentMonthlyInvestment:currentMonthlyInvestment,
                     yearsToRetire:yearsToRetire,
                     retirementCorpReqBefInv:retirementCorpReqBefInv,
                     totalLumpsumAssetsCreated: totalLumpsumAssetsCreated,
                     totalMonthlyAssetsCreated: totalMonthlyAssetsCreated,
                     currentLumpsumrateOfReturn: currentLumpsumrateOfReturn,
                     currentMonthlyrateOfReturn: currentMonthlyrateOfReturn,
                     sumYearlyAndMonthlyAssetsUtilized: sumYearlyAndMonthlyAssetsUtilized,
                     revisedNewCorpus: revisedNewCorpus,
                     revisedMonthlyInvestmentNeeded: revisedMonthlyInvestmentNeeded
                 };
             }

             //Get
             function retCorpusObjfunc() {
                 return retCorpusobj;
             }

             function retRevisedCorpusObjfunc() {
                 return retRevisedCorpusobj;
             }

         }]);
