'use strict';

// Configuring the Articles module
angular.module('campagnes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Campagnes', 'campagnes', 'dropdown', '/campagnes(/create)?');
		Menus.addSubMenuItem('topbar', 'campagnes', 'Liste des campagnes', 'campagnes');
		Menus.addSubMenuItem('topbar', 'campagnes', 'Créer une campagne', 'campagnes/create');
	}
]);