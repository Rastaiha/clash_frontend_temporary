import React, { useState, useEffect } from "react";
import Inventory from "./Inventory.js";
import Board from "./Board.js";
import Fight from "./Fight.js";
import urls from "../Urls.js";
import SockJS from "sockjs-client";
import { Client } from '@stomp/stompjs';

export default function Game(props) {
    const [wsClient, setWSClient] = useState(null);
    useEffect(() => {
        const socket = () => new SockJS(urls.socketUrl);
        const createdClient = new Client({
            webSocketFactory: socket,
            reconnectDelay: 0,
            connectHeaders: {
                login: {},
                passcode: localStorage.getItem('username'),
            },
            heartbeatIncoming: 5000,
            heartbeatOutgoing: 5000,
            debug: (text) => console.log(text),
            onConnect: frame => {
                console.log('shit: ' + frame);
                setWSClient(createdClient);
            },
            onDisconnect: () => { },
            // onWebSocketClose,
        });
        createdClient.activate();
        return () => createdClient.deactivate();
    }, []);
    return (
        <div className="container">
            {wsClient && (
                <>
                    <Fight wsClient={wsClient} />
                    <div className="row">
                        <Inventory />
                    </div>
                    <div className="row">
                        <Board wsClient={wsClient} />
                    </div>
                </>
            )}
        </div>
    );
}