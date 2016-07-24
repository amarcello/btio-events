(function(){
    'use strict';

    angular.module('app.controllers')
    .controller('EventsCreateCtrl', [
        'EventsService', '$state',
        function(EventsService, $state) {

            var create = this;

            create.data = {}
            create.now = new Date(new Date().getTime() + 12 * 60 * 60 * 1000);

            create.submit = function() {
                EventsService.create(create.data).then(function(result) {
                    console.log(result);
                });
            }

        }
    ])

    .controller('EventsDetailCtrl', [
        'EventsService', '$mdDialog', '$state', '$stateParams',
        function(EventsService, $mdDialog, $state, $stateParams) {

            var detail = this;
            detail.attendee = {}
            detail.data = {};
            detail.invitee = function() {
                detail.sending = true;
                EventsService.leads(detail.attendee).then(function(result) {
                    detail.sending = false;
                    detail.success = result.success;
                    confirmation();
                });
            }
            detail.isLoading = true;
            detail.popup = {};
            detail.selected = [];
            detail.sending = false;
            detail.sessions = [
                {
                    "name"  : "Session 1 - January 2th, 2016",
                    "ID"   : "001"
                },
                {
                    "name"  : "Session 2 - January 7th, 2016",
                    "ID"   : "002"
                },
                {
                    "name"  : "Session 3 - January 14th, 2016",
                    "ID"   : "003"
                },
                {
                    "name"  : "Session 4 - January 21th, 2016",
                    "ID"   : "004"
                },
                {
                    "name"  : "Session 5 - January 28th, 2016",
                    "ID"   : "005"
                }
            ];

            EventsService.get($stateParams.eventId).then(function(result) {
                detail.attendee.event = result[0].ID;
                detail.data = result[0];
                detail.isLoading = false;
            });

            function confirmation(ev) {

                var message = (detail.success) ? "You've successfully signed to this event :)" : "It seems that you've already signed to this event. :(";

                $mdDialog.show(
                    $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title(detail.data.name)
                    .textContent(message)
                    .ariaLabel('Event Confirmation Dialog')
                    .ok('Got it')
                    .targetEvent(ev)
                );
            };

        }
    ])

})();
