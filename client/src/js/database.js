import { openDB } from "idb";

const initdb = async () =>
  openDB("jate", 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains("jate")) {
        console.log("jate database already exists");
        return;
      }
      db.createObjectStore("jate", { keyPath: "id", autoIncrement: true });
      console.log("jate database created");
    },
  });

// TODO: Add logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => {
  const db = await openDB("jate", 1);
  const tx = db.transaction("jate", "readwrite");
  const store = tx.objectStore("jate");
  const installedContent = await store.getAll();
  const installed =
    installedContent.length && installedContent[0].installed
      ? installedContent[0].installed
      : false;
  await store.clear();
  await store.put({ content, installed });
  await tx.done;
  return true;
};

// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {
  const db = await openDB("jate", 1);
  const tx = db.transaction("jate", "readonly");
  const store = tx.objectStore("jate");
  let data = await store.getAll();
  let rtnData = "";
  if (data == null || data.length == 0 || !data[0].content) {
    rtnData = "";
  } else {
    rtnData = data[0].content;
  }
  await tx.done;
  return rtnData;
};

export const setInstalled = async (val) => {
  const db = await openDB("jate", 1);
  const tx = db.transaction("jate", "readwrite");
  const store = tx.objectStore("jate");
  const contentContent = await store.getAll();
  const content =
    contentContent.length && contentContent[0].content
      ? contentContent[0].content
      : "";
  await store.clear();
  await store.put({ content, installed: val });
  await tx.done;
  return true;
};

export const getInstalled = async () => {
  const db = await openDB("jate", 1);
  const tx = db.transaction("jate", "readonly");
  const store = tx.objectStore("jate");
  let data = await store.getAll();
  let rtnData = false;
  if (data == null || data.length == 0 || !data[0].installed) {
    rtnData = false;
  } else {
    rtnData = data[0].installed;
  }
  await tx.done;
  return rtnData;
};

initdb();
