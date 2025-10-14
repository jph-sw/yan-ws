import express from "express";
import expressWebsockets from "express-ws";
import { Hocuspocus } from "@hocuspocus/server";
import { Database } from "@hocuspocus/extension-database";
import { SQLite } from "@hocuspocus/extension-sqlite";

const hocuspocus = new Hocuspocus({
  extensions: [
    new SQLite({
      database: "local.db",
    }),
  ],
});

const { app } = expressWebsockets(express());

app.ws("/collaboration", (websocket, request) => {
  hocuspocus.handleConnection(websocket, request);
});

app.listen(1234, () => console.log("Listening on http://127.0.0.1:1234"));
