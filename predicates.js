'use strict'

var pointInPolygon = require('point-in-polygon')
var robustPointInPolygon = require('robust-point-in-polygon')
var pointInBigPolygon = require('point-in-big-polygon')
var pointInRegion = require('point-in-region')
var turfInside = require('turf-inside')
var turfPoint = require('turf-point')
var turfPolygon = require('turf-polygon')
var InNOut = require('in-n-out')

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

exports['turf-inside'] = function(poly) {
  var tpoly = turfPolygon([poly])
  return function(x) {
    if(turfInside(turfPoint(x), tpoly)) {
      return -1
    }
    return 1
  }
}

exports['in-n-out'] = function(poly) {
  var query = new InNOut.GeoFence(poly)
  return function(x) {
    if(query.inside(x)) {
      return -1
    }
    return 0
  }
}