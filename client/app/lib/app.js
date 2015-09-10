angular.module('premi', [
	'angular-meteor',
	'ui.router',
	'premi.presentationManager',
	'premi.userManager',
	'premi.editor',
	'premi.presentation',
	'premi.viewer',
	'premi.trailMap',
	'premi.navbar',
	'premi.utility',
	'impressjs',
	'interact'
]);

	angular.module('impressjs', []);
	angular.module('interact', []);

	angular.module('premi.viewer', [
		'ui.router',
		'impressjs'
	]);

	angular.module('premi.trailMap', []);

	angular.module('premi.navbar', []);

	angular.module('premi.fallback', []);

	angular.module('premi.utility', []);

	angular.module('premi.presentation', []);
	
	angular.module('premi.presentationManager', [
		'ui.router',
		'premi.presentation'
	]);
	
	angular.module('premi.userManager', [
		'ui.router'
	]);
	
	angular.module('premi.editor', [
		'ui.router',
		'premi.editor.frameEditor',
		'premi.editor.infographicEditor',
		'premi.editor.trailsEditor',
		'premi.fallback',
		'interact'
	]);
		angular.module('premi.editor.frameEditor', [
			'ui.router',
			'interact'
		]);
		
		angular.module('premi.editor.infographicEditor', [
			'ui.router',
			'interact',
		]);
		
		angular.module('premi.editor.trailsEditor', [
			'ui.router',
			'premi.trailMap'
		]);