(function(){
    'use strict';

    angular.module('app.controllers')
    .controller('MainCtrl', [
        'EventsService', '$state',
        function(EventsService, $state) {

            var main = this;
            main.isLoading = true;

            EventsService.get().then(function(result) {
                main.isLoading = false;
                main.items = result;
            });

            main.today = new Date();

        }
    ]);

})();
