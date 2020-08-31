import React from "react";
import Inventory from "./Inventory.js";
import Board from "./Board.js";


export default function Game(props) {
    return (
        <div className="container">
            <div>
                <Inventory />
            </div>
            <div className="row">
                <Board />
            </div>
        </div>
    );
}