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
  return [p[1], p[0]]
})

exports.line = [ 
  [0, 0],
  [1, 0],
  [2, 0]
]