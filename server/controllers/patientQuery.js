const patient = require('../models/patient')
const referral = require('../models/referral')

function count (obj) {
  var objType = typeof obj
  if (objType === 'string') {
    return obj.length
  } else if (objType === 'object') {
    var objLen = 0
    for (var i in obj) {
      objLen++
    }
    return objLen
  }
  return false
}

// 返回医院下的所有病人
const getAllPatient = function* () {
  const hospitalName = this.params.hospitalName
  const result = yield patient.queryAllPatient(hospitalName)
  this.body = result
}

// 返回医院下的所有normal病人
const getNormalPatientAsSender = function* () {
  const hospitalName = this.params.hospitalName
  const result = yield patient.queryAllPatient(hospitalName)
  var msg = JSON.parse(result)
  // 处理返回数据
  var con = count(msg)
  for (var i = 0; i < con; i++) {
    var hospital = msg[i].State.HospitalName
    if (hospital !== '华工校医院') {
      msg.splice(i, 1)
    }
  }
  for (var k = 0; k < con; k++) {
    var state = msg[k].State.Referral
    if (state !== 'normal') {
      msg.splice(k, 1)
    }
  }
  this.body = msg
}
// 返回医院下的所有undeal病人
const getUndealPatientAsSender = function* () {
  const hospitalName = this.params.hospitalName
  const result = yield patient.queryAllPatient(hospitalName)
  var msg = JSON.parse(result)
  // 处理返回数据
  var con = count(msg)
  for (var i = 0; i < con; i++) {
    var hospital = msg[i].State.HospitalName
    if (hospital !== '华工校医院') {
      msg.splice(i, 1)
    }
  }
  for (var k = 0; k < con; k++) {
    var state = msg[k].State.Referral
    if (state !== 'undeal') {
      msg.splice(k, 1)
    }
  }
  this.body = msg
}
// 返回医院下的所有dealed病人
const getDealedPatientAsSender = function* () {
  const hospitalName = this.params.hospitalName
  const result = yield patient.queryAllPatient(hospitalName)
  var msg = JSON.parse(result)
  // 处理返回数据
  var con = count(msg)
  for (var i = 0; i < con; i++) {
    var hospital = msg[i].State.HospitalName
    if (hospital !== '华工校医院') {
      msg.splice(i, 1)
    }
  }
  for (var k = 0; k < con; k++) {
    var state = msg[k].State.Referral
    if (state !== 'accept' || state !== 'reject') {
      msg.splice(k, 1)
    }
  }
  this.body = msg
}

const getUndealPatientAsReceiver = function* () {
  const hospitalName = this.params.hospitalName
  const result = yield patient.queryAllPatient(hospitalName)
  var msg = JSON.parse(result)
  // 处理返回数据
  var con = count(msg)
  for (var i = 0; i < con; i++) {
    var hospital = msg[i].State.HospitalName
    if (hospital === '华工校医院') {
      msg.splice(i, 1)
    }
  }
  for (var k = 0; k < con; k++) {
    var state = msg[k].State.Referral
    if (state !== 'undeal') {
      msg.splice(k, 1)
    }
  }
  this.body = msg
}

const getDealedPatientAsReceiver = function* () {
  const hospitalName = this.params.hospitalName
  const result = yield patient.queryAllPatient(hospitalName)
  var msg = JSON.parse(result)
  // 处理返回数据
  var con = count(msg)
  for (var i = 0; i < con; i++) {
    var hospital = msg[i].State.HospitalName
    if (hospital === '华工校医院') {
      msg.splice(i, 1)
    }
  }
  for (var k = 0; k < con; k++) {
    var state = msg[k].State.Referral
    if (state !== 'accept' || state !== 'reject') {
      msg.splice(k, 1)
    }
  }
  this.body = msg
}

// 返回病人的病例
const getCasesByPatientId = function* () {
  const patientId = this.params.patientId
  const result = yield patient.queryCasesByPatientId(patientId)
  this.body = result
}
// 返回病人信息
const getPatientInfoByPatientId = function* () {
  const patientId = this.params.patientId
  const result = yield patient.queryPatientByPatientId(patientId)
  this.body = result
}
// 返回生成的转诊单
const getReferralByPatientId = function* () {
  const patientId = this.params.patientId
  const result = yield referral.generateReferralByPatientId(patientId)
  this.body = result
}

module.exports = {
  getAllPatient,
  getCasesByPatientId,
  getPatientInfoByPatientId,
  getReferralByPatientId,
  getNormalPatientAsSender,
  getUndealPatientAsSender,
  getDealedPatientAsSender,
  getDealedPatientAsReceiver,
  getUndealPatientAsReceiver
}