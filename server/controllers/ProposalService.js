'use strict';

var rp = require('request-promise');
var config = require('config');
var url = require('url');

var request_parameters = config.get('request_parameters');
var utils = require('../util/utils.js');

var debug = true;

exports.proposalCountVotesPOST = function(args, res, next) {
  /**
   * Request a votes counting to validate a stored proposal
   *
   * body Countvotes-proposal-body Body in JSON
   * returns countvotes-proposal-response
   **/
  var examples = {};
  examples['application/json'] = {
    "proposalID": "aeiou",
    "requestorID": "aeiou",
    "proposalStatus": "aeiou"
  };
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }

  var options = [
    args.body.value.proposalID
  ];
    
  rp({
    method: 'POST',
    uri: url.format({
        protocol: 'http',
        hostname: request_parameters.registry.ip,
        port: request_parameters.registry.port,
        pathname: request_parameters.path.registry_invoke
    }),
    body: 
    {
      "channel": "mychannel",
      "peer": "0",
      "chaincodeName": "governance-01",
      "fcn": "countVote",
      "args": options
    },
    header:{'User-Agent': 'Service-Ledger-Interface'},
    json: true
  }).then(response => {
    if(debug) {
        if(debug) console.log("---->response from Service-Ledger: ");
        if(debug) console.log(response);
    }

    var value_content = JSON.parse(response.message);
    if(debug) console.log(value_content);

    // TODO: verificare se la lettura del LOG contenga i dati necessari
    examples['application/json'].requestorID = value_content.requestorID;
    examples['application/json'].proposalID = args.body.value.proposalID;
    examples['application/json'].proposalStatus = value_content.proposalStatus;


    if(Object.keys(examples).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
        res.end();
    }
  }).catch(err => {
    if(err.statusCode == 404)
    {
      if(debug) console.log("---->Proposal not found!");
      examples['application/json'].requestorID = "none";
      examples['application/json'].proposalID = args.body.value.proposalID;
      examples['application/json'].proposalStatus = "none";
      
    } else {
      if(debug) console.log("---->error when request to get the proposal!");
      examples['application/json'].requestorID  = "error";
      examples['application/json'].proposalID = args.body.value.proposalID;
      examples['application/json'].proposalStatus = "error";
    }
    if(Object.keys(examples).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
      res.end();
    }
  });
}

exports.proposalGetProposalPOST = function(args, res, next) {
  /**
   * getting a proposal
   *
   * body Get-proposal-body Body in JSON
   * returns get-proposal-response
   **/
  var examples = {};
  examples['application/json'] = {
    "requestorID" : "aeiou",
    "proposalID" : "aeiou",
    "proposalDescription" : "aeiou",
    "proposalType" : "aeiou",
    "proposalQuorum" : "aeiou",
    "votersNumber" : "aeiou",
    "proposalStatus" : "aeiou"
  };

  var options = [
    args.body.value.proposalID
  ];


  rp({
    method: 'POST',
    uri: url.format({
        protocol: 'http',
        hostname: request_parameters.registry.ip,
        port: request_parameters.registry.port,
        pathname: request_parameters.path.registry_invoke
    }),
    body: 
    {
      "channel": "mychannel",
      "peer": "0",
      "chaincodeName": "governance-01",
      "fcn": "getProposal",
      "args": options
    },
    header:{'User-Agent': 'Service-Ledger-Interface'},
    json: true
  }).then(response => {
    if(debug) {
        console.log("---->response from Service-Ledger: ");
        console.log(response);

        var response_str = response.message;
        var response_clean = response_str.split('payload:')[1];
        console.log(response_clean); //messagio da parseare dopo il payload
    }

    var value_content = JSON.parse(response.message);
    if(debug) console.log(value_content);
    if(debug) console.log(value_content.payload);
    
    // TODO: verificare se la lettura del LOG contenga i dati necessari
    examples['application/json'].requestorID = value_content.proposalID;
    examples['application/json'].proposalID = args.body.value.proposalID;
    examples['application/json'].proposalDescription = value_content.proposalDescription;
    examples['application/json'].proposalType = value_content.proposalType;
    examples['application/json'].proposalQuorum = value_content.proposalQuorum;
    examples['application/json'].votersNumber = value_content.votersNumber;
    examples['application/json'].proposalStatus = value_content.proposalStatus;


    if(Object.keys(examples).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
         res.end();
    }
  }).catch(err => {
    if(err.statusCode == 404)
    {
      if(debug) console.log("---->Proposal not found!");
      examples['application/json'].requestorID = "none";
      examples['application/json'].proposalID = args.body.value.proposalID;
      examples['application/json'].proposalDescription = "none";
      examples['application/json'].proposalType = "none";
      examples['application/json'].proposalQuorum = "none";
      examples['application/json'].votersNumber = "none";
      examples['application/json'].proposalStatus = "none";
    } else {
      if(debug) console.log("---->error when request to get the proposal!");
      examples['application/json'].requestorID = "none";
      examples['application/json'].proposalID = args.body.value.proposalID;
      examples['application/json'].proposalDescription = "error";
      examples['application/json'].proposalType = "error";
      examples['application/json'].proposalQuorum = "error";
      examples['application/json'].votersNumber = "error";
      examples['application/json'].proposalStatus = "error";
    }
    if(Object.keys(examples).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
      res.end();
    }
  });
}

exports.proposalSubmitProposalPOST = function(args, res, next) {
  /**
   * Submitting a proposal
   *
   * body Submit-proposal-body Body in JSON
   * returns ack-response
   **/
  var examples = {};
  
  // input parameters for the request passed in 'args'
  var options = [
    //aggiustare ordine
    args.body.value.requestorID,
    args.body.value.proposalID,
    args.body.value.proposalDescription,
    args.body.value.proposalType,
    args.body.value.proposalQuorum,
    args.body.value.votersNumber
  ];

  rp({
    method: 'POST',
    uri: url.format({
        protocol: 'http',
        hostname: request_parameters.registry.ip,
        port: request_parameters.registry.port,
        pathname: request_parameters.path.registry_invoke
    }),
    body:
    {
      "channel": "mychannel",
      "peer": "0",
      "chaincodeName": "governance-01",
      "fcn": "submitProposal",
      "args": options
    },
    header:{'User-Agent': 'Service-Ledger-Interface'},
    json: true
  }).then(response => {
    if(debug) {
        console.log("---->response from Service-Ledger: ");
        console.log(response);
        var response_clean = response.substr(0, 5);
        console.log("###### CLEAN ######");
        console.log(response_clean);
        console.log("###### CLEAN ######");
    }

    examples['application/json'].message = response.message;

    if (Object.keys(examples).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
      res.end();
    }
  }).catch(err => {
    //if(debug) console.log(err);
    if (Object.keys(examples).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
      res.end();
    }
  });
}


exports.proposalVoteProposalPOST = function(args, res, next) {
  /**
   * vote for a submitted a proposal
   *
   * body Vote-proposal-body Body in JSON
   * returns ack-response
   **/
  var examples = {};

  var options = [
    args.body.value.proposalID,
    args.body.value.memberID,
    args.body.value.vote
  ];

	console.log(options);

  rp({
    method: 'POST',
    uri: url.format({
        protocol: 'http',
        hostname: request_parameters.registry.ip,
        port: request_parameters.registry.port,
        pathname: request_parameters.path.registry_invoke
    }),
    body: 
    {
      "channel": "mychannel",
      "peer": "0",
      "chaincodeName": "governance-01",
      "fcn": "vote",
      "args": options
    },
    header:{'User-Agent': 'Service-Ledger-Interface'},
    json: true
  }).then(response => {
    if(debug) {
        if(debug) console.log("---->response from Service-Ledger: ");
        if(debug) console.log(response);
    }

   var value_content = JSON.parse(response.message);
    if(debug) console.log(value_content);

    // TODO: verificare se la lettura del LOG contenga i dati necessari
    examples['application/json'].message = response.message;

    //aggiustare il parsing

    if(Object.keys(examples).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
          res.end();
    }
  }).catch(err => {
    if(err.statusCode == 404)
    {
      if(debug) console.log("---->Proposal to be voted not found!");
    } else {
      if(debug) console.log("---->error when request to get the proposal to be voted!");
    }
    if(Object.keys(examples).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
      res.end();
    }
  });
}
