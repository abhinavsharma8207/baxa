
 otherCalculators.service(
     'retChildStudy', [
         '$window',
         '$q',
         '$log',
         'commonFormulaSvc',
         'commonDBFuncSvc',
         'common_const',
         '$filter',
         '$http',

         function(win, $q, $log, commonFormulaSvc, commonDBFuncSvc, common_const,$filter,$http) {
              'use strict';
             var retChildStudySV = this;
             var retChildStudyobj;
             retChildStudySV.getCourseObject = getCourseObject;
             var CourseObjectsList;
             retChildStudySV.calChildStudyCost = calChildStudyCost;
             retChildStudySV.retCorpusObjfunc = retCorpusObjfunc;
             retChildStudySV.calrevisedCorpus = calrevisedCorpus;
             retChildStudySV.retRevisedCorpusObjfunc = retRevisedCorpusObjfunc;
             var retRevisedCorpusobj

             function getCourseObject(courseTitle,coursePlace,eduMilestone)
             {
              $http.get('js/calculators/childPlan/controllers/specialization.json').then(function(response){
                 CourseObjectsList = response.data;
                 retChildStudyobj = $filter('getByCourseandPlace')(CourseObjectsList,courseTitle,coursePlace,eduMilestone);
                 return retChildStudyobj;
               });

             }

             function calChildStudyCost(studyobj)
             {

              var yearsToAchieveGoal = studyobj.fundagevalue - studyobj.cagevalue;
              var inflation = studyobj.inflationvalue/100;
              var futureStudyCost = studyobj.courseCost * Math.pow((1 + inflation),yearsToAchieveGoal);
              var rrateOfCorpus = studyobj.rateofReturnvalue / 100;
              var formula = 1 - Math.pow(1 + rrateOfCorpus, yearsToAchieveGoal);
              var formula2 = rrateOfCorpus * futureStudyCost;
              var monthlyInvestMentRequired = -formula2 / formula;
              monthlyInvestMentRequired  = monthlyInvestMentRequired / 12;

              retChildStudyobj ={
              cagevalue : studyobj.cagevalue,
              fundagevalue : studyobj.fundagevalue,
              inflationvalue : studyobj.inflationvalue,
              rateofReturnvalue: studyobj.rateofReturnvalue,
              monthlyInvestMentRequired: monthlyInvestMentRequired,
              courseCost: studyobj.courseCost,
              coursePlace: studyobj.coursePlace,
              courseTitle: studyobj.courseTitle,
              eduMilestone: studyobj.eduMilestone,
              futureCostofEducation: futureStudyCost,
              yearsToAchieveGoal : yearsToAchieveGoal,
              courseId:studyobj.courseId
              }



             }

               function retCorpusObjfunc() {
                 return retChildStudyobj;
             }

function calrevisedCorpus(currentLumpsumInvestment, currentMonthlyInvestment, currentLumpsumrateOfReturn, currentMonthlyrateOfReturn, yearsToAchieveGoal) {


                 //currentLumpsumInvestment = currentLumpsumInvestment * 100000;
                 //currentMonthlyInvestment = currentMonthlyInvestment * 1000;
                 currentLumpsumrateOfReturn = currentLumpsumrateOfReturn / 100;
                 currentMonthlyrateOfReturn = currentMonthlyrateOfReturn / 100;
                 var totalLumpsumAssetsCreated = currentLumpsumInvestment * Math.pow((1 + currentLumpsumrateOfReturn), yearsToAchieveGoal);
                 console.log(totalLumpsumAssetsCreated);
                 var yearlyInvestment = currentMonthlyInvestment * 12;
                console.log(yearlyInvestment);
                 var totalMonthlyAssetsCreated = yearlyInvestment * Math.pow((1 + currentMonthlyrateOfReturn), yearsToAchieveGoal);
                 console.log(totalMonthlyAssetsCreated);
                 var sumYearlyAndMonthlyAssetsUtilized = totalLumpsumAssetsCreated + totalMonthlyAssetsCreated;
                 var corpusObj = retChildStudySV.retCorpusObjfunc();
                 var revisedNewCorpus = corpusObj.futureCostofEducation - sumYearlyAndMonthlyAssetsUtilized;
                 var formula = 1 - Math.pow(1 + corpusObj.rateofReturnvalue / 100, yearsToAchieveGoal);
                 var revisedMonthlyInvestmentNeeded = -(corpusObj.rateofReturnvalue / 100 * revisedNewCorpus) / formula;
                 revisedMonthlyInvestmentNeeded = revisedMonthlyInvestmentNeeded / 12;
                 retRevisedCorpusobj = [{

                     totalLumpsumAssetsCreated: totalLumpsumAssetsCreated,
                     totalMonthlyAssetsCreated: totalMonthlyAssetsCreated,
                     currentLumpsumrateOfReturn: currentLumpsumrateOfReturn,
                     currentMonthlyrateOfReturn: currentMonthlyrateOfReturn,
                     sumYearlyAndMonthlyAssetsUtilized: sumYearlyAndMonthlyAssetsUtilized,
                     revisedNewCorpus: revisedNewCorpus,
                     revisedMonthlyInvestmentNeeded: revisedMonthlyInvestmentNeeded,

                 }];

             }

              function retRevisedCorpusObjfunc() {

                 return retRevisedCorpusobj;

             }



         }

     ]
 );
otherCalculators.filter('getByCourseandPlace', function() {
  return function(input, courseTitle,coursePlace,eduMilestone) {
    var i=0, len=input.length;
    for (; i<len; i++) {
      if (input[i].courseTitle == courseTitle && input[i].coursePlace == coursePlace && input[i].eduMilestone ) {
        return input[i];
      }
    }
    return null;
  }
});
