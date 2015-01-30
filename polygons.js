exports.triangle = [
  [1, 2],
  [2, 2],
  [2, 1]
]

exports.I = [
  [0, 3],
  [1, 3],
  [1, 2],
  [2, 2],
  [2, 3],
  [3, 3],
  [3, 2],
  [3, 1],
  [3, 0],
  [2, 0],
  [2, 1],
  [1, 1],
  [1, 0],
  [0, 0],
  [0, 2]
]

exports.H = exports.I.map(function(p) {
  return [p[1], -p[0]]
})

exports['vertical line'] = [ 
  [0, 0],
  [1, 0],
  [2, 0]
]

exports['horizontal line'] = [
  [0, 0],
  [0, 1],
  [0, 2]
]

exports['square'] = [
  [0, 1],
  [1, 1],
  [1, 0],
  [0, 0]
]

exports['square-subdiv1'] = [
  [0, 0.5],
  [0, 0.75],
  [0, 1],
  [1, 1],
  [1, 0],
  [0, 0],
  [0, 0.25]
]

exports['square-subdiv2'] = [
  [0.25,0],
  [0, 0],
  [0, 1],
  [1, 1],
  [1, 0],
  [0.75,0],
  [0.5,0]
]

