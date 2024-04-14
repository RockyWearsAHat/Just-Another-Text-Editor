// Import methods to save and get data from the indexedDB database in './database.js'
import { getDb, putDb } from "./database";
import { header } from "./header";

export default class {
  constructor() {
    const localData = localStorage.getItem("content");

    // check if CodeMirror is loaded
    if (typeof CodeMirror === "undefined") {
      throw new Error("CodeMirror is not loaded");
    }

    this.editor = CodeMirror(document.querySelector("#main"), {
      value: "",
      mode: "javascript",
      theme: "monokai",
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      indentUnit: 2,
      tabSize: 2,
    });

    // When the editor is ready, set the value to whatever is stored in indexeddb.
    // Fall back to localStorage if nothing is stored in indexeddb, and if neither is available, set the value to header.

    // Ensure the database has been set up before making any calls incase the user cleared their cache when uninstalling the
    // PWA from their homescreen
    getDb().then((data) => {
      this.editor.setValue(data || localData || header);
    });

    let timeout;
    this.editor.on("change", () => {
      clearTimeout(timeout);
      localStorage.setItem("content", this.editor.getValue());
      timeout = setTimeout(async () => {
        putDb(localStorage.getItem("content"));
      }, 300); //Autosave, I'm sure there is some way to do this with onbeforeunload
      //Or when the user leaves/refreshes the page, but I don't know, if someone can type
      //fast enough to not set this off I will be more than impressed
    });

    // Save the content of the editor when the editor itself is loses focus
    this.editor.on("blur", async () => {
      await putDb(localStorage.getItem("content"));
    });

    this.editor.on("focus", async () => {
      const data = await getDb();
      this.editor.setValue(data);
    });
  }
}
