
col = require('cli-color');

_ = require('underscore');

table = require('cli-table');

module.exports = {
  print_dns_list: function(items) {
    var t;
    t = new table({
      head: ['Zone ID', 'Zone Name'],
      colsWidths: [100, 100]
    });
    _.each(items, function(zone) {
      t.push([zone.id, zone.name]);
    });
    console.log(t.toString());
  },
  print_zone_records: function(recs) {
    var t;
    t = new table({
      head: ['Record ID', 'Type', 'Name', 'Data'],
      colsWidths: [100, 20, 100, 100]
    });
    _.each(recs, function(rec) {
      t.push([rec.id, rec.type, rec.name, rec.data]);
    });
    console.log(t.toString());
  }
};


