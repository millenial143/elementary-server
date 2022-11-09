import {Server, Socket} from "socket.io";
import express from "express";
import {createServer} from "http";

export default class MainNet{
    public static app = express();
    public static httpServer = createServer(MainNet.app);

}