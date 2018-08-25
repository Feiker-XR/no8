function CountDownTimer () {
  this.handlers = {}
  this.betEndSeconds = 0
  this.drawSeconds = 0
  this.hour = ''
  this.minute = ''
  this.second = ''
  this.intevalId = ''
}

CountDownTimer.prototype = {
  constructor: CountDownTimer,
  on: function (eventName, callBack) {
    this.handlers[eventName] = callBack
  },
  trigger: function (eventName, argument) {
    this.handlers[eventName](argument)
  },
  setOptions: function (options) {
    const {endSeconds, drawSeconds} = options
    this.betEndSeconds = endSeconds || 0
    this.drawSeconds = drawSeconds || 0
  },
  start: function () {
    const _this = this
    _this.stop()
    _this.intevalId = setInterval(function () {
      _this.update()
    }, 1000)
  },
  update: function () {
    this.betEndSeconds > 0 && this.betEndSeconds--

    this.drawSeconds > 0 && this.drawSeconds--

    if (this.betEndSeconds <= 0) {
      this.trigger('onBetEnd')
    } else {
      this.trigger('onBetEndTime', this.formatter(this.betEndSeconds))
    }

    if (this.drawSeconds <= 0) {
      this.trigger('onDrawEnd')
      this.stop()
    } else {
      this.trigger('onDrawEndTime', this.formatter(this.drawSeconds))
    }
  },
  formatter: function (time) {
    this.hour = parseInt(parseInt(time / 60) / 60)
    this.minute = parseInt(time / 60) % 60
    this.second = parseInt(time) % 60
    if (this.hour < 10) {
      this.hour = `0${this.hour}`
    }
    if (this.minute < 10) {
      this.minute = `0${this.minute}`
    }
    if (this.second < 10) {
      this.second = `0${this.second}`
    }
    return this.hour * 1 > 0 ? `${this.hour}:${this.minute}:${this.second}` : `${this.minute}:${this.second}`
  },
  stop: function () {
    clearInterval(this.intevalId)
  }
}

export default CountDownTimer
