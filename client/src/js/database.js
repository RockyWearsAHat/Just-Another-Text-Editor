import { openDB } from "idb";

import { header } from "./header";

const initdb = async () => {
  await openDB("jate", 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains("jate")) {
        console.log("jate database already exists");
        return Promise.resolve();
      }
      db.createObjectStore("jate", { keyPath: "id", autoIncrement: true });
      console.log("jate database created");

      putDb(localStorage.getItem("content") || header).then(() => {
        return Promise.resolve();
      });
    },
  });
};

// TODO: Add logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => {
  const db = await openDB("jate", 1);
  const tx = db.transaction("jate", "readwrite");
  const store = tx.objectStore("jate");
  const data = await store.getAll();
  let installed = false;
  if (data != null && data.length > 0 && data[0].content) {
    installed = data[0].installed;
  }
  await store.clear();
  await store.put({ content, installed });
  await tx.done;
  return Promise.resolve(true);
};

// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {
  const db = await openDB("jate", 1);
  const tx = db.transaction("jate", "readonly");
  const store = tx.objectStore("jate");
  let data = await store.getAll();
  let rtnData = "";
  if (data != null && data.length > 0 && data[0].content) {
    rtnData = data[0].content;
  }
  await tx.done;
  return Promise.resolve(rtnData);
};

export const setInstalled = async (installed) => {
  const db = await openDB("jate", 1);
  const tx = db.transaction("jate", "readwrite");
  const store = tx.objectStore("jate");
  const data = await store.getAll();
  let content = "";
  if (data != null && data.length > 0 && data[0].content) {
    content = data[0].content;
  }
  await store.clear();
  await store.put({ content, installed });
  await tx.done;
  return Promise.resolve(true);
};

export const getInstalled = async () => {
  const db = await openDB("jate", 1);
  const tx = db.transaction("jate", "readonly");
  const store = tx.objectStore("jate");
  let data = await store.getAll();
  let rtnData = false;
  if (data != null && data.length > 0 && data[0].installed) {
    rtnData = data[0].installed;
  }
  await tx.done;
  return Promise.resolve(rtnData);
};

initdb();
