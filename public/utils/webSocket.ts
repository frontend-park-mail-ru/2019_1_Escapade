import Bus from "./bus";

export class WebSocketInterface {
  ws: WebSocket;
  dataJSON: any;
  connect: boolean;
  countOfrefresh: number;

  constructor(address = 'ws://localhost:8081') {
    this.connectWS(address);
    this.countOfrefresh = 2;
  }

  connectWS(address : string) {
    this.connect = true;
    // не работает ws.onopen пока не знаю почему
    this.ws = new WebSocket(address);
    this.ws.onopen = function (event) {
      console.log('Success onopen');
    };
    this.ws.onclose = (function (event : any) {
      if (event.wasClean) {
        console.log('Connection is closed clean');
      } else {
        console.log('Disconnection');
        if (this.countOfrefresh-- < 0) {
          return;
        }
        window.location.reload();
      }
      console.log('Code: ' + event.code + ' cause: ' + event.reason);
    }).bind(this);
    this.ws.onerror = (function (error : any) {
      console.log('ws error');
      if (this.countOfrefresh-- < 0) {
        return;
      }
      window.location.reload();
      return;
    }).bind(this);;

    console.log('_connect begin');
    if (this.ws) {
      this.setCallback(this._getInfoCallBack.bind(this));
    }
    console.log('_connect end');
    //Bus.on('sendInfoToWS', this._sendInfoJSON.bind(this));
  }
  /**
   * _getRoomsCallBack
   */
  _getInfoCallBack(data: string) {  
    console.log('_getInfoCallBack begin') 
    try {
      this.dataJSON = JSON.parse(data);
    } catch (e) {
      console.log('debugging - ', data);
      return;
    }
    Bus.emit('getInfoFromWS', this.dataJSON);

    console.log('_getInfoCallBack end')
  }

  /**
   * _sendInfo
   */
  sendInfoJSON(data : any) { 
    const dataJSON = JSON.stringify(data);
    console.log(dataJSON);
    this.sendMessage(dataJSON);
  }


  sendMessage(data: any) {
    //if (this.connect) {
    this.ws.send(data);
    //}
  }


  setCallback(func: (arg0: any) => void) {
    this.ws.onmessage = function (event) {
      const incomingMessage = event.data;
      func(incomingMessage);
    };
  }

  closeConnection(code: number = 1000, reason: string = 'closing') {
    if (this.ws) {
      this.ws.close(code, reason);
    }
  }
}


