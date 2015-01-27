'use strict'

var WIDTH = 512
var HEIGHT = 512

var nextafter = require('nextafter')
var ndarray = require('ndarray')
var PREDICATES = require('./predicates')
var POLYGONS   = require('./polygons')

var canvasRegular = getCanvas('regular', WIDTH, HEIGHT)
var contextRegular = canvasRegular.getContext('2d')
var pixelsRegular = getPixels(contextRegular, WIDTH, HEIGHT)

var canvasZoomed = getCanvas('zoom', WIDTH, HEIGHT)
var contextZoomed = canvasZoomed.getContext('2d')
var pixelsZoomed = getPixels(contextRegular, WIDTH, HEIGHT)

var activePolygon = Object.keys(POLYGONS)[0]
var activePredicate = Object.keys(PREDICATES)[0]
var boundPredicate = null
var bounds = [0,0,2,2]
var zoomCoord = [1-1e-14,2-1e-13]

populateSelect('polygons', POLYGONS, function(poly) {
  activePolygon = poly
  setPolygon()
})

populateSelect('predicates', PREDICATES, function(pred) {
  activePredicate = pred
})

function setPolygon() {
  var verts = {}
  var poly = POLYGONS[activePolygon]
  var v = ''
  for(var i=0; i<poly.length; ++i) {
    v = poly[i].join()
    verts[v] = i
  }
  populateSelect('vertices', verts, setVertex)
  setVertex(v)
}

function setVertex(v) {
  var p = v.split(',')
  var x = +p[0]
  var y = +p[1]
  for(var i=0; i<256; ++i) {
    x = nextafter(x, -Infinity)
    y = nextafter(y, -Infinity)
  }
  zoomCoord = [x,y]
  repaintZoom()
}

function populateSelect(name, values, listener) {
  var select = document.getElementById(name)
  if(!select) {
    select = document.createElement('select')
    document.body.appendChild(select)
    select.id = name
  }
  var items = Object.keys(values)
  for(var i=0; i<items.length; ++i) {
    var option = document.createElement('option')
    option.text = items[i]
    option.value = items[i]
    select.add(option, i)
  }
  function itemChanged() {
    var value = select.value
    listener(value)
    notifyChanged()
  }
  select.addEventListener('change', itemChanged)
}

function getCanvas(name, width, height) {
  var canvas = document.getElementById(name)
  if(!canvas) {
    canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    canvas.id = name
  }
  canvas.width = width
  canvas.height = height
  return canvas
}

function getPixels(context, w, h) {
  return context.getImageData(0,0,w,h)
}

function renderPolygon(pixels, coordRect, zoom, pred) {
  var w = pixels.shape[0]
  var h = pixels.shape[1]
  var x = coordRect[0]
  for(var i=0; i<w; ++i) {
    var y = coordRect[1]
    for(var j=0; j<h; ++j) {
      var o = pred([x,y])
      if(o < 0) {
        pixels.set(i, j, 0, 0xff)
        pixels.set(i, j, 1, 0)
        pixels.set(i, j, 2, 0)
      } else if(o > 0) {
        pixels.set(i, j, 0, 0)
        pixels.set(i, j, 1, 0)
        pixels.set(i, j, 2, 0xff)        
      } else if(o === 0) {
        pixels.set(i, j, 0, 0)
        pixels.set(i, j, 1, 0xff)
        pixels.set(i, j, 2, 0)
      } else {
        pixels.set(i, j, 0, 0xff)
        pixels.set(i, j, 1, 0xff)
        pixels.set(i, j, 2, 0xff)
      }
      pixels.set(i, j, 3, 0xff)

      if(zoom) {
        y = nextafter(y, Infinity)
      } else {
        y = coordRect[1] + (coordRect[3] - coordRect[1]) / h * (j + 1)
      }
    }
    if(zoom) {
      x = nextafter(x, Infinity)
    } else {
      x = coordRect[0] + (coordRect[2] - coordRect[0]) / w * (i + 1)
    }
  }
}

function repaintZoom() {
  var pdata = ndarray(pixelsZoomed.data, [WIDTH, HEIGHT,4])
  renderPolygon(pdata, zoomCoord, true, boundPredicate)
  contextZoomed.putImageData(pixelsZoomed, 0, 0)
}

function repaintAll() {
  var pdata = ndarray(pixelsRegular.data, [WIDTH, HEIGHT,4])
  renderPolygon(pdata, bounds, false, boundPredicate)
  contextRegular.putImageData(pixelsRegular, 0, 0)
  repaintZoom()
}

function computeBounds(poly) {
  var bounds = [Infinity, Infinity, -Infinity, -Infinity]
  for(var i=0; i<poly.length; ++i) {
    var p = poly[i]
    for(var j=0; j<2; ++j) {
      bounds[j] = Math.min(p[j], bounds[j])
      bounds[j+2] = Math.max(p[j], bounds[j+2])
    }
  }
  var w = bounds[2] - bounds[0]
  var h = bounds[3] - bounds[1]
  bounds[0] -= 0.125 * w
  bounds[1] -= 0.125 * h
  bounds[2] += 0.125 * w
  bounds[3] += 0.125 * h
  return bounds
}

function notifyChanged() {
  var poly = POLYGONS[activePolygon]
  var pred = PREDICATES[activePredicate]
  boundPredicate = pred(poly)
  bounds = computeBounds(poly)
  repaintAll()
}

notifyChanged()
setPolygon()