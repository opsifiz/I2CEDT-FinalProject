import {handleCreateResult, handleFilterResult} from "./fetch.js";

const inputBtn = document.getElementById('input');
const queryBtn = document.getElementById('query');
const searchToggle = document.getElementById('queryToggle')
const searchModal = document.getElementById('queryModal')
const closeSearchToggle = document.getElementById('closeQueryModal')

inputBtn.addEventListener("click", async () => {
    document.getElementById("llm-message").innerText = "Asking LLM...";
    await handleCreateResult();
})

searchToggle.addEventListener("click", async () => {
    document.getElementById("queryModal").style.display = "block";
    document.querySelector("section.queryResults").innerHTML = "";
    document.getElementById("algorithm-query").value = "none";
    document.getElementById("time-complexity-query").value = "anything";
    document.getElementById("prompt-query").value = "";
})

closeSearchToggle.addEventListener("click", async () => {
    document.getElementById("queryModal").style.display = "none";
})

window.onclick = function(e){
    if(e.target == searchModal){
        searchModal.style.display = "none";
    }
}

queryBtn.addEventListener("click", async () => {
    await handleFilterResult();
})