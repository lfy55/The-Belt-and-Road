let messageDom = $("#message_wrap"),
  pieDOM = $("#pie_wrap"),
  lineDom = $("#line_wrap")

var video = document.createElement('video')
video.className = 'video'


function showDetail() {
  messageDom.animate({
    scaleIndex: 1,
  }, {
      step: function (now) {
        messageDom.css('transform', 'scale(' + now + ')');
        messageDom.css('left', +(1 - now) * 46.2 + 3.8 + '%');
        messageDom.css('bottom', +(1 - now) * 45 + 5 + '%');
        pieDOM.css('transform', 'scale(' + now + ')');
        pieDOM.css('left', +(1 - now) * 46.2 + 3.8 + '%');
        pieDOM.css('top', +(1 - now) * 40 + 10 + '%');
        lineDom.css('transform', 'scale(' + now + ')');
        lineDom.css('right', +(1 - now) * 46.2 + 3.8 + '%');
        lineDom.css('bottom', +(1 - now) * 45 + 5 + '%');
      },
      duration: 1500,
      done: function () { }
    })
}

function hideDetail(callback) {
  messageDom.animate({
    scaleIndex: 0,
  }, {
      step: function (now) {
        messageDom.css('transform', 'scale(' + now + ')');
        messageDom.css('left', +(1 - now) * 46.2 + 3.8 + '%');
        messageDom.css('bottom', +(1 - now) * 45 + 5 + '%');
        pieDOM.css('transform', 'scale(' + now + ')');
        pieDOM.css('left', +(1 - now) * 46.2 + 3.8 + '%');
        pieDOM.css('top', +(1 - now) * 40 + 10 + '%');
        lineDom.css('transform', 'scale(' + now + ')');
        lineDom.css('right', +(1 - now) * 46.2 + 3.8 + '%');
        lineDom.css('bottom', +(1 - now) * 45 + 5 + '%');
      },
      duration: 1500,
      done: function () {
        if (callback) callback();
      }
    })
}
// showDetail()