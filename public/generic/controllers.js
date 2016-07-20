(function(){
    'use strict';

    angular.module('app.controllers')
    .controller('GenericCtrl', [
        '$anchorScroll', '$location',
        function($anchorScroll, $location) {

            var generic = this;

            generic.backToTop = function() {
                $anchorScroll("top-area");
            };

        }
    ]);

})();
