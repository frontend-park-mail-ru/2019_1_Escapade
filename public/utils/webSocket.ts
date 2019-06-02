import Bus from "./bus";

export class WebSocketInterface {
  ws: WebSocket;
  dataJSON: any;
  connect: boolean;
  countOfrefresh: number;
  address: string;

  constructor(address = 'ws://localhost:8081') {
    this.connectWS(address);
    this.address = address;
    this.countOfrefresh = 150;
  }

  connectWS(address : string) {
    this.connect = true;
    // не работает ws.onopen пока не знаю почему
    this.ws = new WebSocket(address);

    this.ws.onclose = (function (event : any) {
      if (!event.wasClean) {
        console.log('Disconnection');
        if (this.countOfrefresh-- < 0) {
          return;
        }
        this.connectWS(this.address);
      }
    }).bind(this);
    this.ws.onerror = (function (error : any) {
      if (this.countOfrefresh-- < 0) {
        return;
      }
      this.connectWS(this.address);
      return;
    }).bind(this);;

    if (this.ws) {
      this.setCallback(this._getInfoCallBack.bind(this));
    }
    //Bus.on('sendInfoToWS', this._sendInfoJSON.bind(this));
  }
  /**
   * _getRoomsCallBack
   */
  _getInfoCallBack(data: string) {  
    try {
      this.dataJSON = JSON.parse(data);
    } catch (e) {
      return;
    }
    Bus.emit('getInfoFromWS', this.dataJSON);

  }

  /**
   * _sendInfo
   */
  sendInfoJSON(data : any) { 
    const dataJSON = JSON.stringify(data);
    //console.log(dataJSON);
    this.sendMessage(dataJSON);
  }


  sendMessage(data: any) {
    this.ws.send(data);
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


