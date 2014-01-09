pkgcloud  = require 'pkgcloud'
_         = require 'underscore'
inq       = require 'inquirer'
col       = require 'cli-color'
qs        = require './promptqs'
p         = require './printer.coffee'
client    = null;

{rax_username, rax_api_key, default_region}  = require './settings.coffee'


class RaxDNSCli
  
  start: () ->
      @checkCredentials()
      @getInitialInfo()

  checkCredentials: () ->
      if rax_username and rax_api_key
          @credentials_set = true

  getInitialInfo: () ->
    console.log col.cyan 'Welcome to Rackspace DNS CLI.\n'
    if not @credentials_set
        @promptForCredentials()
    else
      creds =
        username: @rax_username or rax_username,
        apiKey: @rax_api_token or rax_api_key,
        provider: 'rackspace'

    try
      client = pkgcloud.dns.createClient creds
    catch e
      console.log col.red 'There was an issue authenticating. Please try again. ' + e

    @actionPrompt()

  promptForCredentials: () =>
    inq.prompt qs.cred_questions, (ans) =>
      @rax_username  = ans.rax_username
      @rax_api_token = ans.rax_api_token
      @rax_region = ans.rax_region        

  actionPrompt: () ->
    inq.prompt qs.dns_questions, (ans) =>
      q = ans.dns_action
      if q == 'LZ'
        @listZones()
      else if q == 'AZ'
        @createZone()
      else if q == 'DZ'
        @deleteZone()
      else if q == 'LZR'
        @listZoneRecords()
      else if q == 'AZR'
        @addZoneRecord()
      else if q == 'DZR'
        @deleteZoneRecord()

  listZones: () ->
      client.getZones (err, zones) ->
          if err
              console.log col.red err
          p.print_dns_list zones

  createZone: () ->
      inq.prompt qs.new_zone_questions, (ans) =>
          z_details =
              name: ans.dns_name,
              email: ans.dns_admin_email,
              ttl: ans.dns_ttl,
              comment: ans.dns_comments or 'N/A'
          
          client.createZone z_details, (err, zone) ->
              if not err
                  console.log col.green "Zone #{zone.name} was successfully created.\n"
              else
                  console.log col.red err

  deleteZone: () ->
    inq.prompt qs.del_zone_questions, (ans) ->
      console.log col.blackBright "About to delete zone #{ans.zone_id}."
      client.deleteZone ans.zone_id, (e) ->
        if not err
          console.log col.green "Zone #{zone.name} was successfully deleted."
        else
          console.log col.red 'There was an issue while deleting zone: ' + e
  
  listZoneRecords: () ->
    inq.prompt qs.zone_recs_questions, (ans) =>
      client.getZone ans.zone_id, (err, zone) ->
        if not err and zone
          console.log col.blackBright 'Retriving records, please wait ...'
          client.getRecords zone, (err, recs) ->
            if not err
              p.print_zone_records recs
            else
              console.log 'There was an issue retrieving Zone records: ' + err
        else
          console.log 'There was an issue while retrieving Zone: ' + err

  addZoneRecord: () ->
    inq.prompt qs.add_zone_rec_questions, (ans) ->
      client.getZone ans.zone_id, (err, zone) =>
        if not err
          console.log col.blackBright 'Parent zone found ...'
          rec_details =
            name: ans.rec_name,
            type: ans.rec_type,
            data: ans.rec_data
          client.createRecord zone, rec_details, (e, rec) ->
            console.log col.blackBright 'Creating record ...'
            if not e
              console.log col.green "Record type #{rec.type} with data #{rec.data} was successfully created."
            else
              console.log col.red 'There was an issue while creating DNS Record: ' + e.result.details
        else
          console.log col.red 'There was an issue retrieving parent zone: ' + err

  deleteZoneRecord: () ->
    inq.prompt qs.del_zone_rec_questions, (ans) ->
      console.log col.blackBright "About to delete Record #{ans.rec_id} of Zone #{ans.zone_id}"
      client.deleteRecord ans.zone_id, ans.rec_id, (e) ->
        if not e
          console.log col.green 'Record successfully deleted.'
        else
          console.dir e



rax = new RaxDNSCli
rax.start()