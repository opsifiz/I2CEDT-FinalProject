import Result from "../models/resultModel.js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const createResult = async (req, res) => {
    try{
        // console.log(message);
        // const res = await requestToLLM({"text":message});
        // return res;
        const {userPrompt, algorithm, timeComplexity, textMessage} = req.body;
        const llmResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": GEMINI_API_KEY,
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {text: textMessage}
                            ]
                        }
                    ]
                })
            }
        );

        const data = await llmResponse.json();
        const LLMMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
        if(LLMMessage === "No response"){
            res.status(503).json({message: "ERROR : Service Unavailable."});
        }else{
            const newResult = new Result({
                ...req.body,
                LLMMessage: LLMMessage,
            });
            await newResult.save();
            res.status(200).json({message: LLMMessage});
        }
    }catch(err){
        res.status(500).json({error: "Internal Server Error."});
    }
};

export const getResult = async (req, res) => {
    const results = await Result.find();
    return results;
};

export const updateResult = async (req, res) => {
    try{
        res.status(200).json({message: "Not Done Yet. Wait for Update!!!"});
    }catch(err){
        res.status(500).json({error: "Internal Server Error."});
    }
};

export const filterResult = async (req, res) => {
    try{
        res.status(200).json({message: "Not Done Yet. Wait for Update!!!"});
    }catch(err){
        res.status(500).json({error: "Internal Server Error."});
    }
};

export const deleteResult = async (req, res) => {
    try{
        res.status(200).json({message: "Not Done Yet. Wait for Update!!!"});
    }catch(err){
        res.status(500).json({error: "Internal Server Error."});
    }
};
