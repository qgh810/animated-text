import { checkNode } from './utils/check'
import { showWarn } from './utils/log'

class AnimatedText {
  constructor (el, options) {
    this.initData(el, options) && this.init()
    this.play = this.play.bind(this)
  }

  /**
   * 检查和初始化传入参数
   */
  initData (el, options) {
    this.el = checkNode(el)
    if (!this.el) return
    options = this.checkOptions(options)
    this.options = options
    if (options.isNumber) {
      this.number = Number(this.el.innerText)
      if (!this.number && this.number !== 0) {
        this.options.isNumber = false
        return this.initData(el, this.options)
      }
      this.startNumber = options.startNumber - 0 || 0
      this.changeCount = options.changeCount - 0 || 24
    } else {
      this.text = this.el.innerText
      this.textArr = this.text.split('')
    }
    this.isNumber = options.isNumber
    this.time = options.time
    this.el.innerText = ''
    return true
  }

  /**
   * 检查并且初始化options
   */
  checkOptions (options) {
    if (typeof options === 'number') options = {time: options}
    options = options || {}
    let baseOptions = {
      time: 500,
      isNumber: false,
      startNumber: 0,
      changeCount: 24
    }
    for (let option in baseOptions) {
      !options[option] && (options[option] = baseOptions[option])
    }
    return options
  }

  init (time = this.time) {
    this.isNumber ? this.playNumberAnimation(time) : this.playTextAnimation(time)
  }

  playTextAnimation (time) {
    var textArr = [].concat(this.textArr)
    var currTextArr = []
    this.tid = setInterval(() => {
      var word = textArr.shift()
      if (!word) return clearInterval(this.tid)
      currTextArr.push(word)
      this.el.innerText = currTextArr.join('')
    }, time / this.textArr.length)
  }

  playNumberAnimation (time) {
    let changeCount = 31
    let targetNumber = this.number
    if (!targetNumber === 0) return
    let targetNumberDecimalLength = this.getDecimalLength(targetNumber)
    let StartNumberDecimalLength = this.getDecimalLength(this.startNumber)
    let decimalLength = Math.max(targetNumberDecimalLength, StartNumberDecimalLength)
    let d = this.number - this.startNumber
    let everyD = (d / changeCount).toFixed(decimalLength) - 0
    if (everyD === 0) {
      showWarn('差值过小无法动画')
      return this.el.innerText = targetNumber
    }
    var currNumber = this.startNumber
    this.tid = setInterval(() => {
      currNumber = (currNumber + everyD).toFixed(decimalLength) - 0
      if (Math.abs(currNumber - targetNumber) <= Math.abs(everyD)) {
        this.el.innerText = targetNumber
        return clearInterval(this.tid)
      }
      this.el.innerText = currNumber
    }, time / changeCount)
  }

  getDecimalLength (number) {
    let numberStr = number + ''
    return numberStr.split('.')[1] && numberStr.split('.')[1].length || 0
  }

  play (time = this.time) {
    clearInterval(this.tid)
    this.el.innerText = this.isNumber ? this.number : this.text
    var options = {
      time: this.time,
      isNumber: this.isNumber,
      startNumber: this.startNumber,
      changeCount: this.changeCount
    }
    this.initData(this.el, options) && this.init()
  }
}

module.exports = AnimatedText