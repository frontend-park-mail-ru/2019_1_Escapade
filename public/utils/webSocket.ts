/* eslint-disable valid-jsdoc */

/** */
export class WebSocketInterface {
  connect: boolean;
  ws: WebSocket;
  /**
   *
   */
  constructor(address = 'ws://localhost:8081') {
    this.connect = true;
    // не работает ws.onopen пока не знаю почему
    this.ws = new WebSocket(address);
    this.ws.onopen = function(event) {
      console.log('Success onopen');
      this.connect = true;
    };
    this.ws.onclose = function(event) {
      if (event.wasClean) {
        console.log('Connection is closed clean');
      } else {
        console.log('Disconnection');
      }
      console.log('Code: ' + event.code + ' cause: ' + event.reason);
    };
    this.ws.onerror = function(error) {
      this.connect = false;
      console.log('Error ' + error.message);
    };
  }

  /**
   * sendMessage
  */
  sendMessage(data: string | ArrayBuffer | Blob | ArrayBufferView) {
    //if (this.connect) {
    this.ws.onopen = () => this.ws.send(data);
    //}
  }

  /**
   * SetCallback
  */
  setCallback(func: (arg0: any) => void) {
    this.ws.onmessage = function(event) {
      const incomingMessage = event.data;
      func(incomingMessage);
    };
  }

  /**
   * closeConnection
  */
  closeConnection(code: number, reason: string) {
    this.ws.close(code, reason);
  }
}


