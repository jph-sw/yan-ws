import express from "express";
import expressWebsockets from "express-ws";
import { Hocuspocus } from "@hocuspocus/server";
import { Database } from "@hocuspocus/extension-database";

const hocuspocus = new Hocuspocus({
  extensions: [
    new Database({
      fetch: async ({ documentName }) => {
        const res = await fetch(
          `${process.env.YAN_URL}/api/get-document/${documentName}`,
        );
        const data = (await res.json()) as any;

        return new Promise((resolve) => {
          resolve(data.doc.data as any);
        });
      },
      store: async ({ documentName, state }) => {
        const res = await fetch(
          `${process.env.YAN_URL}/api/set-document/${documentName}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/octet-stream",
            },
            body: state,
          },
        );
      },
    }),
  ],
});

const { app } = expressWebsockets(express());

app.ws("/collaboration", (websocket, request) => {
  hocuspocus.handleConnection(websocket, request);
});

app.listen(1234, () => console.log("Listening on http://127.0.0.1:1234"));
