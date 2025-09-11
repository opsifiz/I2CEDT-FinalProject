import {handleCreateResult} from "./fetch.js";

const inputBtn = document.getElementById('input');

inputBtn.addEventListener("click", async () => {
    document.getElementById("llm-message").innerText = "Asking LLM...";
    await handleCreateResult();
})
