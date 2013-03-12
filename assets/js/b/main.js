
// # main

/*globals Zepto*/
;(function($) {

  // ## animate waves
  $('body').addClass('animate')

  // ## connect to websockets
  /*globals io*/
  var socket = io.connect('//')

  // ## bind trigger for shake
  var isMobile = {
    Android: function() {
      return navigator.userAgent.match(/Android/i)
    },
    BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i)
    },
    iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i)
    },
    Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i)
    },
    Windows: function() {
      return navigator.userAgent.match(/IEMobile/i)
    },
    any: function() {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows())
    }
  }

  function shake() {
    var data = {
      url: '/shake',
      method: 'GET'
    }
    // TODO: could use socket.request here
    socket.send(JSON.stringify(data))
  }

  // ## update
  socket.on('update', update)
  function update(speeds) {

    for(var i in speeds) {

      var $boat = $('#' + i)
        , speed = speeds[i]

      // if $boat doesn't exist then create it
      if ($boat.length === 0) {
        $boat = $('<div class="boat hidden" id="' + i + '"></div>')
        $('body').append($boat)
      }

      console.log('i', i)
      console.log('socket.sessionid', socket.socket.sessionid)

      if (parseInt(i, 10) === parseInt(socket.socket.sessionid, 10))
        $boat.html('YOU')

      // take the screen width and divide by 10 for intervals
      var width = $(window).width()
        , interval = width / 10

      // add half the width to center $boat
      $boat.css('left', ( (interval * speed) + (width/2) ) + 'px')

      if ($boat.hasClass('hidden'))
        $boat.removeClass('hidden')


    }
  }

  // ## connect
  socket.on('connect', connect)
  function connect() {
    if (isMobile.any()) {
      alert('Shake Your Phone to Race!')
    }
    socket.send(JSON.stringify({
      url: '/join',
      method: 'GET'
    }))
    if (isMobile.any())
      window.addEventListener('shake', shake, false)
    else
      $('#shake').removeClass('hidden').on('click', shake)
  }

  // ## disconnect
  socket.on('disconnect', disconnect)
  function disconnect() {
    if (isMobile.any())
      window.removeEventListener('shake')
    else
      $('#shake').addClass('hidden').off('click')
  }

})(Zepto)
