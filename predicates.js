'use strict'

var pointInPolygon = require('point-in-polygon')
var robustPointInPolygon = require('../robust-pnp')
var pointInBigPolygon = require('point-in-big-polygon')
var pointInRegion = require('point-in-region')

exports['point-in-polygon'] = function(poly) {
  return function(x) {
    if(pointInPolygon(x, poly)) {
      return -1
    } else {
      return 1
    }
  }
}

exports['robust-point-in-polygon'] = function(poly) {
  return function(x) {
    return robustPointInPolygon(poly, x)
  }
}

exports['point-in-big-polygon'] = function(poly) {
  return pointInBigPolygon([poly], true)
}

exports['point-in-region'] = function(poly) {
  var ids = new Array(poly.length)
  for(var i=0; i<poly.length; ++i) {
    ids[i] = i
  }
  var pred = pointInRegion(poly, [[ids]])
  return function(x) {
    if(pred(x) < 0) {
      return 1
    } else {
      return -1
    }
  }
}