import React from "react";
import Inventory from "./Inventory.js";
import Board from "./Board.js";
import Fight from "./Fight.js";


export default function Game(props) {
    return (
        <div className="container">
            <Fight show={true} />
            <div className="row">
                <Inventory />
            </div>
            <div className="row">
                <Board />
            </div>
        </div>
    );
}