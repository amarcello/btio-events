(function(){
    'use strict';

    angular.module('app.services', [])
    .service('EventsService', [
        '$q', '$http',
        function($q, $http) {

            var self = {
                get : function(code) {
                    return $q(function(resolve, reject) {

                        var req = {
                            method: 'GET',
                            url: '/api/events',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        };

                        if(code) {
                            req.params = { eventid: code }
                        }

                        $http(req).then(function(result) {
                            if (result.status === 200) {
                                var events = [];
                                angular.forEach(result.data, function(item) {
                                    if(item.Subject){
                                        var closed, soldout, final = {
                                            "ID"    : item.Id,
                                            "dates" : {
                                                end   : item.EndDateTime,
                                                start : item.StartDateTime
                                            },
                                            "description" : item.Description,
                                            "img"   : item.Thumb__c,
                                            "name"  : item.Subject,
                                            "seats" : {
                                                "total" : (item.Seats__c) ? item.Seats__c : 0,
                                                "joined": (item.AcceptedEventInviteeIds) ? item.AcceptedEventInviteeIds.length : 0
                                            }
                                        }

                                        final.soldout = (final.seats.total === final.seats.joined)

                                        events.push(final);
                                    }
                                });
                                resolve(events);
                            } else {
                                reject(result.data.statusTxt);
                            }
                        });
                    });
                },

                create : function(obj) {

                    var data, dtSet = {
                        start : {
                            day: obj.start_date.getDate(),
                            month: obj.start_date.getMonth(),
                            year: obj.start_date.getFullYear(),
                            hour: obj.start_time.getHours(),
                            minu: obj.start_time.getMinutes()
                        },
                        end : {
                            day: obj.end_date.getDate(),
                            month: obj.end_date.getMonth(),
                            year: obj.end_date.getFullYear(),
                            hour: obj.end_time.getHours(),
                            minu: obj.end_time.getMinutes()
                        }
                    }

                    dtSet.start.final = new Date(dtSet.start.year, dtSet.start.month, dtSet.start.day, dtSet.start.hour, dtSet.start.minu);
                    dtSet.end.final = new Date(dtSet.end.year, dtSet.end.month, dtSet.end.day, dtSet.end.hour, dtSet.end.minu);

                    data = {
                        "ActivityDateTime": dtSet.start.final,
                        "Description" : obj.description,
                        "EndDateTime": dtSet.end.final,
                        "Seats__c": obj.seats,
                        "StartDateTime": dtSet.start.final,
                        "Subject": obj.title,
                        "Thumb__c": obj.thumb
                    }

                    return $q(function(resolve, reject) {

                        var req = {
                            method: 'GET',
                            url: '/api/create',
                            params: { data: JSON.stringify(data) },
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        };

                        $http(req).then(function(result) {
                            if (result.status === 200) {
                                resolve(result.data);
                            } else {
                                reject(result.data.statusTxt);
                            }
                        });
                    });
                },

                leads : function(attendee) {

                    var data = {
                        "Company": attendee.company,
                        "Email" : attendee.email,
                        "FirstName": attendee.first_name,
                        "LastName": attendee.last_name,
                        "Phone": attendee.phone
                    }

                    return $q(function(resolve, reject) {

                        var req = {
                            method: 'GET',
                            url: '/api/invitees',
                            params: { data: JSON.stringify(data), eventId: attendee.event },
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        };

                        $http(req).then(function(result) {
                            if (result.status === 200) {
                                resolve(result.data);
                            } else {
                                reject(result.data.statusTxt);
                            }
                        });
                    });
                }

            }

            return self;

        }
    ])

})();
