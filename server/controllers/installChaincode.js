/**
 * Copyright 2017 IBM All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
'use strict'
var util = require('util')
var network = require('../models/network.js')
var logger = network.getLogger('install-chaincode')
// function installChaincode(org) {
var installChaincode = function* (peers, chaincodeName, chaincodePath,
  chaincodeVersion, username, org) {
  logger.debug(
    '\n============ Install chaincode on organizations ============\n')
  network.setupChaincodeDeploy()
  var client = network.getClientForOrg(org)

  return network.getOrgAdmin(org).then((user) => {
    var request = {
      targets: network.newPeers(peers),
      chaincodePath: chaincodePath,
      chaincodeId: chaincodeName,
      chaincodeVersion: chaincodeVersion
    }
    return client.installChaincode(request)
  }, (err) => {
    logger.error('Failed to enroll user \'' + username + '\'. ' + err)
    throw new Error('Failed to enroll user \'' + username + '\'. ' + err)
  }).then((results) => {
    var proposalResponses = results[0]
    var allGood = true
    for (var i in proposalResponses) {
      let oneGood = false
      if (proposalResponses && proposalResponses[0].response &&
        proposalResponses[0].response.status === 200) {
        oneGood = true
        logger.info('install proposal was good! Number:' + i)
      } else {
        logger.error('install proposal was bad! Number:' + i)
      }
      allGood = allGood & oneGood
    }
    if (allGood) {
      logger.info(util.format(
        'Successfully sent install Proposal and received ProposalResponse: Status - %s',
        proposalResponses[0].response.status))
      logger.debug('\nSuccessfully Installed chaincode on organization ' + org +
        '\n')
      return 'Successfully Installed chaincode on organization ' + org
    } else {
      logger.error(
        'Failed to send install Proposal or receive valid response. Response null or status is not 200. exiting...'
      )
      return 'Failed to send install Proposal or receive valid response. Response null or status is not 200. exiting...'
    }
  }, (err) => {
    logger.error('Failed to send install proposal due to error: ' + err.stack ? err.stack : err)
    throw new Error('Failed to send install proposal due to error: ' + err.stack ? err.stack : err)
  })
}
exports.installChaincode = installChaincode
