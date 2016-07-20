var express     = require('express')
,   app         = express()
,   bodyParser  = require('body-parser')
,   morgan      = require('morgan')
,   jsforce     = require('jsforce')
,   conn        = new jsforce.Connection()
,   port        = process.env.PORT || 5000
,   apiroutes   = express.Router();

//get request parameters
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

//connect to salesforce with config vars from heroku
conn.login(process.env.USERNAME, process.env.PASSWORD, function(err, res) {
    if (err) { return console.error(err); }
    console.info('[connected do salesforce]');
});

//API endpoint to fetch all events or a single event
apiroutes.get('/events', function(req, res) {

    var eventId = req.query.eventid || null, records = [], query,
    select = "SELECT Id, AcceptedEventInviteeIds, ActivityDateTime, Description, EndDateTime, OwnerId, Seats__c, StartDateTime, Subject, Thumb__c FROM Event";

    if(eventId) select += " WHERE Id = '"+eventId+"'";

    query = conn.query(select).on("record", function(record) {
        records.push(record);
    }).on("end", function() {
        res.json(records);
    }).on("error", function(err) {
        res.json({success: false, msg: '[ERROR] ' + err});
    }).run({
        autoFetch : true,
        maxFetch  : 4000
    });

});

//API endpoint to create an event - feature available only for salesforce users
apiroutes.get('/create', function(req, res) {
    conn.sobject("Event").create(JSON.parse(req.query.data), function(err, ret) {
        if (err || !ret.success) { return console.error(err, ret); }
        res.json(ret);
    });
});

//API endpoint to create an invitee - feature available only for salesforce users
apiroutes.get('/invitees', function(req, res) {

    var self = {
        //first check if there's already a lead with the same e-mail
        check : function() {
            var data = JSON.parse(req.query.data), records = [];
            conn.query("SELECT Id FROM Lead WHERE Email ='"+data.Email+"'").on("record", function(record) {
                records.push(record);
            }).on("end", function() {
                if(!records[0]) {
                    self.create();
                }
                else {
                    self.relation(records[0].Id);
                }
                //res.json(record);
            }).on("error", function(err) {
                res.json({success: false, msg: '[ERROR] ' + err});
            }).run({
                autoFetch : true,
                maxFetch  : 4000
            });
        },
        //if the check() returns 0, then create the lead
        create : function(code) {
            conn.sobject("Lead").create(JSON.parse(req.query.data), function(err, ret) {
                var relation = (code) ? code : ret.id;
                if (err || !ret.success) { return console.error(err, ret); }
                self.relation(ret.id)
            });
        },
        //create the relation to the event
        relation: function(lead) {
            conn.sobject("EventRelation").create({EventId: req.query.eventId, RelationId: lead, Status: "Accepted"}, function(err, ret) {
                if(ret) {
                    res.json({'success': true, 'lead' : lead, 'relation' : ret});
                } else {
                    res.json({success: false, msg: '[ERROR] ' + err});
                }
            });
        }
    }

    self.check();

});

app.use('/api', apiroutes);
app.listen(port);
