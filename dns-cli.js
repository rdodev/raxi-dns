
pkgcloud = require('pkgcloud');
_ = require('underscore');
inq = require('inquirer');
col = require('cli-color');
qs = require('./promptqs');
p = require('./printer');
client = null;

_s = require('./settings');
rax_username = _s.rax_username;
rax_api_key = _s.rax_api_key;
default_region = _s.default_region;

function RaxDNSCli () {

  this.start = function () {
    this.checkCredentials();
    this.getInitialInfo();
  };

  this.checkCredentials = function () {
    if (rax_username && rax_api_key) {
      this.credentials_set = true;
    }
  };

  this.getInitialInfo = function() {
    var creds, e;
    console.log(col.cyan('Welcome to Rackspace DNS CLI.\n'));
    if (!this.credentials_set) {
      this.promptForCredentials();
    }
    creds = {
      username: this.rax_username || rax_username,
      apiKey: this.rax_api_token || rax_api_key,
      region: this.rax_region || default_region,
      provider: 'rackspace'
    };

    try {
      client = pkgcloud.dns.createClient(creds);
      this.actionPrompt();
    } 
    catch (e) {
      console.log(col.red('There was an issue authenticating. Please try again. ' + e.message));
    }
  };

  this.promptForCredentials = function () {
    _this = this;
    inq.prompt(qs.cred_questions, function(ans) {
      _this.rax_username = ans.rax_username;
      _this.rax_api_token = ans.rax_api_token;
      _this.rax_region = ans.rax_region;
    });
  };

  this.actionPrompt = function () {
    var _this = this;
    return inq.prompt(qs.dns_questions, function(ans) {
      var q;
      q = ans.dns_action;
      if (q === 'LZ') {
        _this.listZones();
      } 
      else if (q === 'AZ') {
        _this.createZone();
      } 
      else if (q === 'DZ') {
        _this.deleteZone();
      } 
      else if (q === 'LZR') {
        _this.listZoneRecords();
      } 
      else if (q === 'AZR') {
        _this.addZoneRecord();
      } 
      else if (q === 'DZR') {
        _this.deleteZoneRecord();
      }
    });
  };

  this.listZones = function () {
    client.getZones(function (err, zones) {
      if (err) {
        console.log(col.red(err.message));
      }
      else {
        p.print_dns_list(zones);
      }
    });
  };

  this.createZone = function () {
    var _this = this;
    inq.prompt(qs.new_zone_questions, function (ans) {
      var z_details;
      z_details = {
        name: ans.dns_name,
        email: ans.dns_admin_email,
        ttl: ans.dns_ttl,
        comment: ans.dns_comments || 'N/A'
      };
      client.createZone(z_details, function (err, zone) {
        if (!err) {
          console.log(col.green("Zone " + zone.name + " was successfully created.\n"));
        } else {
          console.log(col.red(err.message));
        }
      });
    });
  };

  this.deleteZone = function () {
    inq.prompt(qs.del_zone_questions, function (ans) {
      var _this = this;
      console.log(col.blackBright("About to delete zone " + ans.zone_id + "."));
      client.deleteZone(ans.zone_id, function (e) {
        if (!e) {
          console.log(col.green("Zone " + ans.zone_id + " was successfully deleted."));
        } else {
          console.log(col.red("There was an issue deleting Zone: " + e.message + "."));
        }
      });
    });
  };

  this.listZoneRecords = function() {
    var _this = this;
    inq.prompt(qs.zone_recs_questions, function (ans) {
      client.getZone(ans.zone_id, function (err, zone) {
        if (!err && zone) {
          console.log(col.blackBright('Retriving records, please wait ...'));
          client.getRecords(zone, function (e, recs) {
            if (!e) {
              p.print_zone_records(recs);
            } else {
              console.log(col.red('There was an issue retrieving Zone records: ' + e.message));
            }
          });
        } 
        else {
          console.log(col.red('There was an issue while retrieving Zone: ' + err.message));
        }
      });
    });
  };

  this.addZoneRecord = function () {
    return inq.prompt(qs.add_zone_rec_questions, function (ans) {
      var _this = this;
      client.getZone(ans.zone_id, function (err, zone) {
        var rec_details;
        if (!err) {
          console.log(col.blackBright('Parent zone found ...'));
          rec_details = {
            name: ans.rec_name,
            type: ans.rec_type,
            data: ans.rec_data
          };
          client.createRecord(zone, rec_details, function (e, rec) {
            console.log(col.blackBright('Creating record ...'));
            if (!e) {
              console.log(col.green("Record type " + rec.type + " with data " + rec.data + " was successfully created."));
            } else {
              console.log(col.red('There was an issue while creating DNS Record: ' + e.result.details));
            }
          });
        } 
        else {
          console.log(col.red('There was an issue retrieving parent zone: ' + err.message));
        }
      });
    });
  };

  this.deleteZoneRecord = function () {
    inq.prompt(qs.del_zone_rec_questions, function (ans) {
      console.log(col.blackBright("About to delete Record " + ans.rec_id + " of Zone " + ans.zone_id));
      client.deleteRecord(ans.zone_id, ans.rec_id, function (e) {
        if (!e) {
          console.log(col.green('Record successfully deleted.'));
        } else {
          console.log(col.red(e.message));
        }
      });
    });
  };

};

    

rax = new RaxDNSCli();
rax.start();