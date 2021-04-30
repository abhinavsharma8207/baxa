documentScanAndUpload.config([
	'$stateProvider',
	'$urlRouterProvider',
	'$ionicConfigProvider',
	function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
		'use strict';
		$stateProvider
			.state('app.tabs-landing-dsu', {
				url: "/tabs-landing-dsu",
				cache: false,
				abstract: true,
				views: {
					'menuContent': {
						templateUrl: "js/documents-scanandupload/templates/dsu.summary.html",
						controller: 'docScanandUploadSummeryController'
					}
				}
			});
		$stateProvider
			.state('app.tabs-landing-dsu.today', {
				url: '/today',
				views: {
					'today': {
						templateUrl: 'js/documents-scanandupload/templates/dsu.summary.html',
					}
				}
			});
		$stateProvider
			.state('app.tabs-landing-dsu.yesterday', {
				url: '/yesterday',
				views: {
					'yesterday': {
						templateUrl: 'js/documents-scanandupload/templates/dsu.summary.html',
					}
				}
			});
		$stateProvider
			.state('app.tabs-landing-dsu.older', {
				url: '/older',
				views: {
					'older': {
						templateUrl: 'js/documents-scanandupload/templates/dsu.summary.html',
					}
				}
			});
		$stateProvider
			.state('app.document-scan-and-upload', {
				url: "/document-scan-and-upload",
				cache: false,
				views: {
					'menuContent': {
							templateUrl: "js/documents-scanandupload/templates/dsu.scanandupload.html",
							controller: 'docScanandUploadController'
					}
				}
			});
		$stateProvider
			.state('app.document-images-review', {
				url: '/document-images-review',
				cache: false,
				views: {
					'menuContent': {
							templateUrl: "js/documents-scanandupload/templates/dsu.imagesreview.html",
							controller: 'documentImagesReviewController'
					}
				}
			});
	}
]);
