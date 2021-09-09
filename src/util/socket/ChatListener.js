import io from "socket.io-client";
import {SOCKET_GATEWAY} from "../constants";
import Parser from "./Parser";

class ChatListener {
    constructor() {
        this.socket = io.connect(SOCKET_GATEWAY, {
            path: '/',
            query: "",
            transports: ['websocket'],
        });
    }

    start() {
        this.listener();
        this.listenConnectionError();
    }

    stop() {
        this.socket.disconnect();
    }

    listenConnectionError() {
        this.socket.on('connect_error', () => {
            console.log('Issue connecting to gateway.');
        });
    }

    listener() {
        this.socket.on("message", data => Parser.message(data));
    }
}

export default ChatListener;