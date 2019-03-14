import * as types from '@/modules-constant.js'
import store from '@/store'

let legalHotkeyStart = ['Ctrl', 'Shift', 'Alt'] //定义可以作为热键的起始按键，用于过滤不关按键的频繁触发行为
let legalSingleKey = [
  'F1',
  'F2',
  'F3',
  'F4',
  'F5',
  'F6',
  'F7',
  'F8',
  'F9',
  'F10',
  'F11',
  'F12',
  'Delete',
  'Escape',
  'Enter',
  'Tab',
  'ArrowUp',
  'ArrowLeft',
  'ArrowRight',
  'AltGraph'
]
let hotkeyHandler = {
  decodeKey: function(event) {
    let k = new Array()
    if (event.ctrlKey === true) {
      k.push('Ctrl')
    }
    if (event.shiftKey === true) {
      k.push('Shift')
    }
    if (event.altKey === true) {
      k.push('Alt')
    }
    if (event.type == 'mousewheel') {
      k.push('wheel')
      if (event.deltaY > 0) {
        k.push('up')
      } else if (event.deltaY) {
        k.push('down')
      }
    } else {
      if (legalSingleKey.indexOf(event.key) > -1) {
        k.push(event.key)
      }
      if (event.key && event.key.length == 1) {
        k.push(event.key)
      }
    }
    return k
  },
  forbidDefaultEvent: function(event, decodedKey) {
    switch (decodedKey.toString()) {
      case 'Ctrl,z':
      case 'Ctrl,y':
      case 'Ctrl,s':
      case 'Ctrl,+':
      case 'Ctrl,=':
      case 'Ctrl,-':
      case 'Ctrl,0':
      case 'Ctrl,wheel,up':
      case 'Ctrl,wheel,down':
        event.preventDefault()
        event.stopPropagation()
        break
      case 'Alt,e':
        event.preventDefault()
        event.stopPropagation()
        event.returnValue = false
        break
      default:
    }
  },
  checkShortKey: function(decodedKey) {
    if (
      (decodedKey.length > 1 && legalHotkeyStart.includes(decodedKey[0])) ||
      (decodedKey.length == 1 && legalSingleKey.includes(decodedKey[0]))
    )
      return true
    return false
  },
  handleKeyDown: function(event) {
    let decodedKey = this.decodeKey(event)
    if (this.checkShortKey(decodedKey)) {
      this.forbidDefaultEvent(event, decodedKey)
      store.dispatch(types.HANDLE_HOTKEY, decodedKey)
    }
  }
}
;(function() {
  document.addEventListener(
    'keydown',
    keyboardEvent => {
      hotkeyHandler.handleKeyDown(keyboardEvent)
    },
    true
  )
  document.onmousewheel = scrollEvent => {
    hotkeyHandler.handleKeyDown(scrollEvent)
  }
})()
export default hotkeyHandler
