module.exports = {
  cred_questions: [
  {
    type: 'input',
    name: 'rax_username',
    message: 'Please enter your Rackspace username',
    validate: function (value) {
      var pass = value.match(/^(\w+)$/);
      if (pass) {
        return true;
      }
      else {
        return 'Please enter a valid user name'
      }
    }
  },
  {
    type: 'input',
    name: 'rax_api_token',
    message: 'Please enter your Rackspace API key',
    validate: function (value) {
      var pass = value.match(/^(\w+)$/);
      if (pass) {
        return true;
      }
      else {
        return 'Please enter a valid Rackspace API token'
      }
    }
  },
  {
    type: 'list',
    name: 'rax_region',
    message: 'Please select a region',
    choices: ['ORD', 'DFW', 'IAD', 'SYD']
  }

  ],
  dns_questions: [
  {
    type: 'list',
    name: 'dns_action',
    message: 'Please select an action',
    choices: [{name: 'List Zones', value: 'LZ'},
    {name: 'Add New Zone', value: 'AZ'},
    {name: 'Delete Zone', value: 'DZ'},
    {name: 'List Zone Records', value: 'LZR'},
    {name: 'Add Zone Records', value: 'AZR'},
    {name: 'Delete DNS Records', value: 'DZR'}],
    filter: function (val) { return val.toUpperCase(); }
  }
  ],
  new_zone_questions: [
  {
    type: 'input',
    name: 'dns_name',
    message: 'Please enter zone name',
    validate: function (value) {
      var pass = value.match(/^(\S+)$/);
      if (pass) {
        return true;
      }
      else {
        return 'Please enter a valid user name'
      }
    }
  },
  {
    type: 'input',
    name: 'dns_admin_email',
    message: 'Please enter admin email address',
    validate: function (value) {
      var pass = value.match(/^(.+)$/);
      if (pass) {
        return true;
      }
      else {
        return 'Please enter a valid Rackspace API token'
      }
    }
  },
  {
    type: 'input',
    name: 'dns_ttl',
    message: 'Please enter TTL (in seconds)',
    default: 300
  },
  {
    type: 'input',
    name: 'dns_comments',
    message: 'Please zone comments (optional)'
  },
  ],
  del_zone_questions:[
    {
      type: 'input',
      name: 'zone_id',
      message: 'Please enter the (unique) id of the Zone you want to delete',
      validate: function (value) {
        var pass = value.match(/^(\d+)$/);
        if (pass) {
          return true;
        }
        else {
          return 'Please enter a valid Zone Id (i.e. numerical value)'
        }
      }
    }
  ],
  zone_recs_questions: [
    {
      type: 'input',
      name: 'zone_id',
      message: 'Please enter Zone id (you might want to run list zones first)',
      validate: function (value) {
        var pass = value.match(/^(\d+)$/);
        if (pass) {
          return true;
        }
        else {
          return 'Please enter a valid Zone Id (i.e. numerical value)'
        }
      }
    }
  ],
  add_zone_rec_questions: [
    {
      type: 'input',
      name: 'zone_id',
      message: 'Please enter Zone id (you might want to run list zones first)',
      validate: function (value) {
        var pass = value.match(/^(\d+)$/);
        if (pass) {
          return true;
        }
        else {
          return 'Please enter a valid Zone Id (i.e. numerical value)'
        }
      }
    },
    {
      type: 'input',
      name: 'rec_name',
      message: 'Please enter a Record name',
      validate: function (value) {
        var pass = value.match(/^(.+)$/);
        if (pass) {
          return true;
        }
        else {
          return 'Please enter a valid Record name (e.g sub.example.org)'
        }
      }
    },
    {
      type: 'list',
      name: 'rec_type',
      message: 'Please enter Zone id (you might want to run list zones first)',
      choices: ['A','AAAA'],
      filter: function (val) { return val.toUpperCase(); }
    },
    {
      type: 'input',
      name: 'rec_data',
      message: 'Please enter record data (i.e. IPv4 or IPv6 address)',
      validate: function (val) {
        var ipv6 = val.match(/(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/);
        var ipv4 = val.match(/((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])/);
        if (ipv4 || ipv6) {
          return true;
        }
        else {
          return 'Enter a valid IPv4 or IPv6 address.'
        }
      }
    }
  ],
  del_zone_rec_questions: [
    {
      type: 'input',
      name: 'zone_id',
      message: 'Please enter Zone id (you might want to run list zones first)',
      validate: function (value) {
        var pass = value.match(/^(\d+)$/);
        if (pass) {
          return true;
        }
        else {
          return 'Please enter a valid Zone Id (i.e. numerical value)';
        }
      }
    },
    {
      type: 'input',
      name: 'rec_id',
      message: 'Please enter a Record id',
      validate: function (value) {
        var pass = value.match(/^(.+)$/);
        if (pass) {
          return true;
        }
        else {
          return 'Please enter a valid Record id (e.g A-0000000)';
        }
      }
    }
  ]
}