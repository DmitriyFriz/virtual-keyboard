const KEY_LAYOUT = {

  rusKeys: {

    shiftOff: ['ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace', 'Tab', 'й', 'ц', 'у',
      'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', '\\', 'Del', 'CapsLock', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о',
      'л', 'д', 'ж', 'э', 'Enter', 'Shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', '▲',
      'Shift', 'Ctrl', 'Win', 'Alt', 'Space', 'Alt', '◄', '▼', '►', 'Ctrl'],

    shiftOn: ['ё', '!', '"', '№', ';', '%', ':', '?', '*', '(', ')', '_', '+', 'Backspace', 'Tab', 'й', 'ц', 'у',
      'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', '/', 'Del', 'CapsLock', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о',
      'л', 'д', 'ж', 'э', 'Enter', 'Shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', ',', '▲',
      'Shift', 'Ctrl', 'Win', 'Alt', 'Space', 'Alt', '◄', '▼', '►', 'Ctrl'],
  },

  engKeys: {

    shiftOff: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace', 'Tab', 'q', 'w', 'e',
      'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\', 'Del', 'CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j',
      'k', 'l', ';', '\'', 'Enter', 'Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '▲',
      'Shift', 'Ctrl', 'Win', 'Alt', 'Space', 'Alt', '◄', '▼', '►', 'Ctrl'],

    shiftOn: ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'Backspace', 'Tab', 'q', 'w', 'e',
      'r', 't', 'y', 'u', 'i', 'O', 'p', '{', '}', '|', 'Del', 'CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j',
      'k', 'l', ':', '"', 'Enter', 'Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '<', '>', '?', '▲',
      'Shift', 'Ctrl', 'Win', 'Alt', 'Space', 'Alt', '◄', '▼', '►', 'Ctrl'],
  },

  keyCode: ["Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9",
    "Digit0", "Minus", "Equal", "Backspace", "Tab", "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI",
    "KeyO", "KeyP", "BracketLeft", "BracketRight", "Backslash", "Delete", "CapsLock", "KeyA", "KeyS", "KeyD", "KeyF",
    "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote", "Enter", "ShiftLeft", "KeyZ", "KeyX", "KeyC",
    "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash", "ArrowUp", "ShiftRight","ControlLeft", "MetaLeft",
    "AltLeft", "Space", "AltRight", "ArrowLeft", "ArrowDown", "ArrowRight", "ControlRight"],
}

class VirtualKeyboard  {
  constructor(divWrapper, textArea){
    this.isEnglish = JSON.parse(localStorage.getItem('isEnglish'));
    this.isCaseUp = false;
    this.isShift = false;
    this.divWrapper = divWrapper;
    this.textArea = textArea;
    this.keys = null;
    this.keyboard = null;
  }

  createKeyboard() {
    let keyboardContainer = document.createElement('div');
    keyboardContainer.classList.add('keyboard');
    this.divWrapper.append(keyboardContainer);
    let keyLayout = this.isEnglish ? KEY_LAYOUT.engKeys.shiftOff : KEY_LAYOUT.rusKeys.shiftOff;

    for (let i = 0; i < keyLayout.length; i++ ) {
      let key = document.createElement('span');
      key.textContent = keyLayout[i];
      key.setAttribute('id', KEY_LAYOUT.keyCode[i]);
      key.classList.add('key');
      keyboardContainer.append(key);
    };
  }

  changeLayout() {
    let keyLayout = this.isEnglish ? KEY_LAYOUT.engKeys : KEY_LAYOUT.rusKeys;
    keyLayout = this.isShift ? keyLayout.shiftOn : keyLayout.shiftOff;
    this.keys.forEach((item, i) => {
      item.textContent = keyLayout[i];
    })
  }

  insertSymbol(key) {
    let symbol = '';
    switch(key.id) {
      case 'Space':
        symbol = ' ';
        break;
      case 'Tab':
        symbol = '    ';
        break;
      case 'Enter':
        symbol = '\n';
        break;
      default:
      symbol = this.isCaseUp ? key.textContent.toUpperCase() : key.textContent;
    }
    let cursorPosition = this.textArea.selectionStart;
    this.textArea.value = this.textArea.value.slice(0, cursorPosition) + symbol + this.textArea.value.slice(cursorPosition);
    this.textArea.selectionEnd = this.textArea.selectionStart = cursorPosition + symbol.length;
  }

  removeSelectedPiece() {
    let startSelected = this.textArea.selectionStart;
    let endSelected = this.textArea.selectionEnd;
    if (startSelected == endSelected) return false;
    this.textArea.value = this.textArea.value.slice(0, startSelected) + this.textArea.value.slice(endSelected);
    this.textArea.selectionEnd = this.textArea.selectionStart = startSelected;
    return true;
  }

  backspaceSymbol() {
    if (this.removeSelectedPiece()) return;
    let cursorPosition = this.textArea.selectionStart;
    if (!cursorPosition) return;
    this.textArea.value = this.textArea.value.slice(0, cursorPosition-1) + this.textArea.value.slice(cursorPosition);
    this.textArea.selectionEnd = this.textArea.selectionStart = cursorPosition-1;
  }

  deleteSymbol() {
    if (this.removeSelectedPiece()) return;
    let cursorPosition = this.textArea.selectionStart;
    this.textArea.value = this.textArea.value.slice(0, cursorPosition) + this.textArea.value.slice(cursorPosition+1);
    this.textArea.selectionEnd = this.textArea.selectionStart = cursorPosition;
  }

  pressKeyDown(key) {
    switch (key.id) {
      case 'ControlLeft':
      case 'MetaLeft':
      case 'AltLeft':
      case 'AltRight':
      case 'ControlRight':
        key.classList.add('active-key');
        break;
      case 'Delete':
        key.classList.add('active-key');
        this.deleteSymbol();
        break;
      case 'Backspace':
        key.classList.add('active-key');
        this.backspaceSymbol();
        break;
      case 'ShiftRight':
      case 'ShiftLeft':
        if(event.repeat) return;
        key.classList.add('active-key');
        this.isShift = true;
        this.changeLayout();
        this.keyboard.classList.toggle('upper-case');
        this.isCaseUp = !this.isCaseUp;
        break;
      case 'CapsLock':
        if(event.repeat) return;
        key.classList.toggle('active-key');
        this.keyboard.classList.toggle('upper-case');
        this.isCaseUp = !this.isCaseUp;
        break;
      default:
        key.classList.add('active-key');
        this.insertSymbol(key);
    }
  }

  pressKeyUp(key) {
    switch (key.id) {
      case 'ShiftRight':
      case 'ShiftLeft':
        key.classList.remove('active-key');
        this.isShift = false;
        this.changeLayout();
        this.keyboard.classList.toggle('upper-case');
        this.isCaseUp = !this.isCaseUp;
        break;
      case 'CapsLock':
        break;
      default:
        key.classList.remove('active-key');
    }
  }
};

window.addEventListener('DOMContentLoaded', () => {

  const divWrapper = document.createElement('div');
  divWrapper.classList.add('wrapper');

  let textArea = document.createElement('textarea');
  textArea.classList.add('textarea');
  divWrapper.append(textArea);
  document.body.append(divWrapper);

  virtualKeyboard = new VirtualKeyboard(divWrapper, textArea);

  virtualKeyboard.createKeyboard();

  let paragraph1 = document.createElement('p');
  paragraph1.textContent = 'Для переключения языка комбинация: левыe ctrl + alt';
  divWrapper.append(paragraph1) ;
  let paragraph2 = document.createElement('p');
  paragraph2.textContent = 'Клавиатура создана в операционной системе Windows';
  divWrapper.append(paragraph2) ;


  let keys = document.querySelectorAll('.key');
  virtualKeyboard.keys = keys;

  let keyboard = document.querySelector('.keyboard');
  virtualKeyboard.keyboard = keyboard;

  window.addEventListener('keydown', function(event){
    textArea.focus();
    event.preventDefault();
    keys.forEach(key => {
      if (key.id == event.code) {
        if (event.ctrlKey && event.altKey ) {
          if(event.repeat) return;
          key.classList.add('active-key');
          virtualKeyboard.isEnglish = !virtualKeyboard.isEnglish;
          localStorage.setItem('isEnglish', virtualKeyboard.isEnglish);
          virtualKeyboard.changeLayout();
        }
        virtualKeyboard.pressKeyDown(key);
    }
    })
  });

  window.addEventListener('keyup', function(event){
    keys.forEach(key => {
      if (key.id == event.code) {
        virtualKeyboard.pressKeyUp(key);
      }
    })
  });

  keyboard.addEventListener('mousedown', function(event){
    if (!event.target.classList.contains('key')) return;
    textArea.focus();
    let key = event.target;
    virtualKeyboard.pressKeyDown(key);

    window.addEventListener('mouseup', function(event){
      virtualKeyboard.pressKeyUp(key);
    },{once: true});
  });
});















