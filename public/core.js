(function(){
    'use strict';

    angular.module('app', [
        'ngMaterial',
        'ui.router',
        'app.controllers',
        'app.constants',
        'app.services'
    ])

    .config([
        '$mdThemingProvider', '$stateProvider', '$urlRouterProvider',
        function($mdThemingProvider, $stateProvider, $urlRouterProvider) {

            $mdThemingProvider.definePalette('eventIpsum', {
                '50'   : '#F3E5F5',
                '100'  : '#c9bcdb',
                '200'  : '#a992c6',
                '300'  : '#7f5dab',
                '400'  : '#653c99',
                '500'  : '#562990',
                '600'  : '#452075',
                '700'  : '#34175a',
                '800'  : '#250f42',
                '900'  : '#16062b',
                'A100' : '#a66af1',
                'A200' : '#6b32b3',
                'A400' : '#4e1398',
                'A700' : '#340075',
                'contrastDefaultColor': 'light'
            });

            $mdThemingProvider.theme('default')
            .primaryPalette('eventIpsum')
            .accentPalette('eventIpsum');

            $stateProvider.state('home', {
                url: '/',
                templateUrl: 'main/main.view.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            })

            .state('events-detail', {
                url: '/detail/:eventId',
                templateUrl: 'events/detail.view.html',
                controller: 'EventsDetailCtrl',
                controllerAs: 'detail'
            })

            .state('events-create', {
                url: '/create',
                templateUrl: 'events/create.view.html',
                controller: 'EventsCreateCtrl',
                controllerAs: 'create'
            })


            $urlRouterProvider.otherwise("/");
        }
    ])

})();

angular.module('app.controllers',[]);
angular.module('app.constants',[]);;
angular.module('app.services',[]);
