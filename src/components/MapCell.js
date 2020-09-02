import React, { useRef } from "react";
import { Button, Overlay } from "react-bootstrap";
import { postRequest } from "../utils";
import urls from '../Urls';

export default function MapCell({ data: { type, playerName }, onClick }) {
    const username = localStorage.getItem('username');
    const background = {
        "PLAYER": playerName === username ? "red" : "orange",
        "EMPTY": "khaki",
        "TOWNHALL": "violet",
        "MOTEL": "seagrean",
        "INSTITUTE": "dimgray"
    }[type];

    const target = useRef(null);

    const fight = () =>
        postRequest(urls.defaultUrl + '/api/player/fight', { username: playerName });

    return (
        <th onClick={onClick} style={{ background, width: "40px", height: "40px" }}>
            <div className="w-100 h-100" ref={target} />
            <Overlay target={target.current} show={type === "PLAYER" && playerName !== username} placement="top">
                <Button onClick={fight}>Fight!</Button>
            </Overlay>
        </th>
    )
}