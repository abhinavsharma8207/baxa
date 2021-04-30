unificationBAXA.value('user', {
    firstName: 'Amol',
    lastName: 'Wanve',
    email: 'amolkwanve@gmail.com'
});

unificationBAXA.constant('apiUrl', 'http://54.169.173.226/godbss/');

unificationBAXA.constant('PI', 3.14159265359);
unificationBAXA.constant('camQuality', 25);
unificationBAXA.constant('dsuMaxImagesCount', 5);
unificationBAXA.constant('noOfProofs', 15);

/**Common constants**/
unificationBAXA.constant('common_const', {
    'ProductId_AajeevanSampatti': '1',
    'ProductId_Samriddhi': '2',
    'ProductId_TripleHealth': '3',
    'ProductId_ADBRider': '4',
    'ProductId_HospiCashRider': '5',
    'ProductId_PWRDeathandTPDRider': '6',
    'ProductId_PWRCIRider': '7',
    'ProductId_EliteSecure': '8',
    'ProductId_SI': '9',
    'ProductId_Flexisave': '10',
     'ProductId_MonthlyAdv': '15',
    'ChannelId_Agency': '1',
    'ChannelId_DD': '2',
    'ProductId_EA': '12',
    'ProductId_FI': '11',
    'ProductId_SS':'13',
    'factorForDeathBenfitFirstRule': 1.05,
    'factorForDeathBenfitThirdRule': 11,
    'noCashBonusForYear': 5,
    'surrenderStandardValue': 30,
    'ageSetBack':3,
    'factForCalSumOrPrem':1000,
    'constantToCompareSAForNSAPPrposer': 500000
});



unificationBAXA.value('documenttypes', [{
    "text": "ADDRESS PROOF",
    "icon": "ap",
    "value": 1
}, {
    "text": "ID PROOF",
    "icon": "idp",
    "value": 2
}, {
    "text": "AGE PROOF STD",
    "icon": "aps",
    "value": 3
}, {
    "text": "AGE PROOF NON STD",
    "icon": "apns",
    "value": 4
}, {
    "text": "INCOME PROOF",
    "icon": "ip",
    "value": 5
}, {
    "text": "NON STD CONSENT",
    "icon": "nsc",
    "value": 6
}, {
    "text": "THIRD PARTY DECLARATION",
    "icon": "tpd",
    "value": 7
}, {
    "text": "CDF",
    "icon": "cdf",
    "value": 8
}, {
    "text": "IR FORM",
    "icon": "irf",
    "value": 9
}, {
    "text": "AMENDMENT FORM",
    "icon": "af",
    "value": 10
}, {
    "text": "PHOTOGRAPH",
    "icon": "pg",
    "value": 11
}, {
    "text": "BENEFIT ILLUSTRATION",
    "icon": "bi",
    "value": 12
}, {
    "text": "CASH AUTHORITY LETTER",
    "icon": "cal",
    "value": 13
}, {
    "text": "FINANCIAL-OTHERS",
    "icon": "fo",
    "value": 14
}, {
    "text": "ECS DIRECT DEBIT FORM",
    "icon": "eddf",
    "value": 15
}, {
    "text": "OTHERS",
    "icon": "eddf",
    "value": 16
}]);

unificationBAXA.value('aajeevansampatti_const', {
    ProductId_AajeevanSampatti: "1",
    DBKEY_PR: 'PR',
    DBKEY_GSV: 'GSV',
    DBKEY_SVP15A100: 'SVP15A100',
    SVP15A85: 'SVP15A85',
    SVP10A100: 'SVP10A100',
    SVP10A85: 'SVP10A85',
    GPSAFACTOR: 'GPSAFACTOR',
    MPFACTOR: 'MPFACTOR',
    STAXY1: 'STAXY1',
    STAXY2: 'STAXY2',
    NSAPRATE: 'NSAPRATE',
    ANNCASHBON4: 'ANNCASHBON4',
    ANNCASHBON8: 'ANNCASHBON8',
    PRODCODE: 'PRODCODE'
});

unificationBAXA.value('lifeStageAgeRanges', {
    ageRange27: 27,
    ageRange30: 30,
    ageRange45: 45,
    ageRange55: 55
});

unificationBAXA.value('lifeStageConstants', {
    lifeStageYoungandSingle: 0,
    lifeStageYoungandMarried: 1,
    lifeStageMarriedWithYoungerKid: 2,
    lifeStageMarriedWithOlderKid: 3,
    lifeStageNearingRetirement: 4
});
