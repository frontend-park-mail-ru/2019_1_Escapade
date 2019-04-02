import {WebSocketInterface} from '../utils/webSocket.js';
// создать подключение


// отправить сообщение из формы publish
/** */
export class ChatView {
  /**
   *
   * @param {*} parent
   */
  constructor() {
    const ws = new WebSocketInterface('ws://localhost:8081');
    ws.setCallback(this.showMessage);
    document.forms.publish.onsubmit = function() {
      console.log("Hellooooooo");
      const outgoingMessage = this.message.value;
      ws.sendMessage(outgoingMessage);
      return false;
    };
  }

  /**
 *
 * show message
 * @param {function} message
 */
  showMessage(message) {
    const messageElem = document.createElement('div');
    messageElem.appendChild(document.createTextNode(message));
    document.getElementById('subscribe').appendChild(messageElem);
  }
}

export default new ChatView;
