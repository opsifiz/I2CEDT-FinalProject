import {createResult, updateResult, filterResult, deleteResult} from "./api.js";

function drawResult(results) {
    const llm_text = document.getElementById("llm-message");
    llm_text.innerText = results.message;
}

function drawModalResult(results) {
    const queryResults = document.querySelector("section.queryResults");
    if(results.length == 0){
        let textarea = document.createElement("textarea");
        textarea.classList.add("modal-text-input");
        textarea.readOnly = true;
        textarea.innerText = "Not Found in Database.";
        queryResults.appendChild(textarea);
        return;
    }
    for (const result of results) {
        // container สำหรับแต่ละ result
        const resultContainer = document.createElement("div");
        resultContainer.classList.add("result-container");
        resultContainer.dataset.id = result._id;

        // textarea
        const userTextArea = document.createElement("textarea");
        userTextArea.classList.add("modal-text-input");
        userTextArea.readOnly = true;
        userTextArea.value = result.textMessage;

        // textarea
        const textarea = document.createElement("textarea");
        textarea.classList.add("modal-text-input");
        textarea.readOnly = true;
        textarea.value = result.LLMMessage;

        const hr = document.createElement("hr");
        const br = document.createElement("br");

        // Dropdown Algorithm
        const algoDiv = document.createElement("div");
        algoDiv.classList.add("user-input");
        algoDiv.innerHTML = `
            <label for="algorithm" class="user-choice">Algorithm</label>
            <select name="algorithm" class="algorithm-select" disabled>
                <option value="none" ${result.algorithm === "none" ? "selected" : ""}>ไม่มี</option>
                <option value="anything" ${result.algorithm === "anything" ? "selected" : ""}>อะไรก็ได้</option>
                <option value="bfs" ${result.algorithm === "bfs" ? "selected" : ""}>BFS</option>
                <option value="dfs" ${result.algorithm === "dfs" ? "selected" : ""}>DFS</option>
                <option value="dp" ${result.algorithm === "dp" ? "selected" : ""}>Dynamic Programming</option>
                <option value="bs" ${result.algorithm === "bs" ? "selected" : ""}>Binary Search</option>
            </select>
        `;

        // Dropdown Time Complexity
        const bigoDiv = document.createElement("div");
        bigoDiv.classList.add("user-input");
        bigoDiv.innerHTML = `
            <label for="time-complexity" class="user-choice">Time Complexity</label>
            <select name="time-complexity" class="time-complexity-select" disabled>
                <option value="anything" ${result.timeComplexity === "anything" ? "selected" : ""}>อะไรก็ได้</option>
                <option value="1" ${result.timeComplexity === "1" ? "selected" : ""}>O(1)</option>
                <option value="logn" ${result.timeComplexity === "logn" ? "selected" : ""}>O(log n)</option>
                <option value="n" ${result.timeComplexity === "n" ? "selected" : ""}>O(n)</option>
                <option value="nlogn" ${result.timeComplexity === "nlogn" ? "selected" : ""}>O(n log n)</option>
                <option value="n2" ${result.timeComplexity === "n2" ? "selected" : ""}>O(n**2)</option>
                <option value="n3" ${result.timeComplexity === "n3" ? "selected" : ""}>O(n**3)</option>
                <option value="n4" ${result.timeComplexity === "n4" ? "selected" : ""}>O(n**4)</option>
            </select>
        `;

        // Save button
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        saveBtn.classList.add("save-btn");
        saveBtn.style.display = "none";
        saveBtn.addEventListener("click", () => {
            textarea.readOnly = true;
            editBtn.style.display = "inline";
            saveBtn.style.display = "none";
            cancelBtn.style.display = "none";
            console.log(textarea.value);
            handleUpdateResult(result._id, textarea.value);
        });

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancel";
        cancelBtn.classList.add("cancel-btn");
        cancelBtn.style.display = "none";
        cancelBtn.addEventListener("click", () => {
            textarea.readOnly = true;
            textarea.value = result.LLMMessage;
            editBtn.style.display = "inline";
            saveBtn.style.display = "none";
            cancelBtn.style.display = "none";
        });

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.classList.add("edit-btn");
        editBtn.addEventListener("click", () => {
            textarea.readOnly = false;
            textarea.focus();
            editBtn.style.display = "none";
            saveBtn.style.display = "inline";
            cancelBtn.style.display = "inline";
        });

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", async () => {
            await deleteResult(result._id);
            await handleFilterResult();
        });

        resultContainer.appendChild(hr);
        resultContainer.appendChild(userTextArea);
        resultContainer.appendChild(algoDiv);
        resultContainer.appendChild(bigoDiv);
        resultContainer.appendChild(saveBtn);
        resultContainer.appendChild(cancelBtn);
        resultContainer.appendChild(editBtn);
        resultContainer.appendChild(deleteBtn);
        resultContainer.appendChild(br);
        resultContainer.appendChild(textarea);

        queryResults.appendChild(resultContainer);
    }
}

export async function handleCreateResult() {
    const algo = document.getElementById("algorithm-input").value;
    const bigo = document.getElementById("time-complexity-input").value;
    const prompt = document.getElementById("prompt-input").value;
    let message = `จงแต่งโจทย์ Competitive Programming อย่างสั้น ไม่ต้องมีอักขระพิเศษ `;
    message += algo==="none"?
        `โดยไม่ต้องใช้ Algorithm ใดๆ`:
        `โดยใช้ Algorithm ${algo==="anything"?'อะไรก็ได้':algo}`;
    message += ` และมี Time Complexity เป็น ${bigo==="anything"?'อะไรก็ได้':bigo}`;
    let finalPrompt = prompt && prompt.trim().length > 0 ? prompt.trim() : "-";

    if (finalPrompt !== "-") {
        message += `\nโดยมีรายละเอียดเพิ่มเติมดังนี้ : ${finalPrompt}`;
    }
    message += `\nตอบการในรูปแแบบข้อความเท่านั้น`;
    // console.log(algo, bigo, prompt, message);
    const payload = {
        userPrompt: finalPrompt,
        algorithm: algo,
        timeComplexity: bigo,
        textMessage: message,
    };

    const result = await createResult(payload);
    drawResult(result);
}

export async function handleUpdateResult(id, newLLMResult) {
    const payload = {
        LLMMessage: newLLMResult
    }
    await updateResult(id, payload);
    await handleFilterResult();
}

export async function handleFilterResult() {
    document.querySelector("section.queryResults").innerHTML = "";
    const algo = document.getElementById("algorithm-query").value;
    const bigo = document.getElementById("time-complexity-query").value;
    const prompt = document.getElementById("prompt-query").value;
    
    let finalPrompt = prompt && prompt.trim().length > 0 ? prompt.trim() : "-";

    const payload = {
        algorithm: algo,
        timeComplexity: bigo,
        subMessage: finalPrompt,
    };

    const results = await filterResult(payload);
    console.log(results);
    drawModalResult(results);
}

export async function handleDeleteResult(id) {
    await deleteResult(id);
}