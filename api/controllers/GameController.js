/*---------------------
	:: Game
	-> controller
---------------------*/
var GameController = {}

/*
GameController.create = function(req, res) {
  if (typeof req.body.name !== 'string' || req.body.name === '')
    return res.next(new Error('Room name empty'))
  res.redirect('/join/' + req.body.name)
}

GameController.join = function(req, res) {
  if (!req.params.name)
    return res.next(new Error('Room name empty'))
  res.render('game/join', { name: req.params.name, link: 'http://74.207.230.207:1337/' + req.params.name })
}
*/

/*globals sails*/
sails.speeds = {}

GameController.join = function(req, res) {
  if (!req.isSocket)
    return res.next(new Error('Sockets only'))
  sails.speeds[req.socket.id] = 0
  sails.io.sockets.emit('update', sails.speeds)
  // decrease speed by 1 every 3 seconds
  setInterval(function() {
    sails.speeds[req.socket.id] = sails.speeds[req.socket.id] - 1
    if (sails.speeds[req.socket.id] < -5)
      sails.speeds[req.socket.id] = -5
    sails.io.sockets.emit('update', sails.speeds)
  }, 3000)
}

GameController.shake = function(req, res) {

  console.log('req.isSocket', req.isSocket)
  console.log('req.socket.id', req.socket.id)

  if (!req.isSocket)
    return res.next(new Error('Sockets only'))

  // get the user's socket id
  var id = req.socket.id

  // increase the user's speed by 1 and emit to everyone
  sails.speeds[id] = sails.speeds[id] + 1

  // set max speed to 5
  if (sails.speeds[id] > 5)
    sails.speeds[id] = 5

  sails.io.sockets.emit('update', sails.speeds)

  // TODO: there should be a better way to do this in scope
  // e.g. via `{ action: 'join', sails: true }` or something
  //  which would then do GameController(sails) maybe?

}

module.exports = GameController


