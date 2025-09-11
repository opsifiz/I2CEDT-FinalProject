import {getResult, createResult} from "./api.js";

function drawResult(results) {
    const llm_text = document.getElementById("llm-message");
    llm_text.innerText = results.message;
}

export async function fetchLatest() {
    
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
    await drawResult(result);
}

