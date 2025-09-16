import Result from "../models/resultModel.js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const requestLLM = async (textMessage) => {
    try{
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
        return LLMMessage;
    }catch(err){
        console.error("Error sending request to LLM:", err);
        return "No response";
    }
}

export const createResult = async (req, res) => {
    try{
        const {userPrompt, algorithm, timeComplexity, textMessage} = req.body;
        const LLMMessage = await requestLLM(textMessage);

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
    res.status(200).json(results);
};

export const updateResult = async (req, res) => {
    try{
        // res.status(501).json({message: "Not Done Yet. Wait for Update <3!!!"});
        const {id} = req.params;
        const {LLMMessage} = req.body;
        const updatedResult = await Result.findByIdAndUpdate(
            id,
            {LLMMessage},
            {new: true}
        );
        if(!updatedResult){
            res.status(404).json({ message: "Result not found." });
        }
        res.status(200).json(updatedResult);
    }catch(err){
        res.status(500).json({error: "Internal Server Error."});
    }
};

export const filterResult = async (req, res) => {
    try{
        const {algorithm, timeComplexity, subMessage} = req.body;
        
        let filter = {};
        if(algorithm && algorithm !== "anything"){
            filter.algorithm = algorithm;
        }
        if(timeComplexity && timeComplexity !== "anything"){
            filter.timeComplexity = timeComplexity;
        }
        if (subMessage && subMessage !== "-") {
        // ใช้ regex สำหรับตรวจ substring ใน textMessage
        filter.textMessage = { $regex: subMessage, $options: "i" }; // "i" = case-insensitive
        }
        const results = await Result.find(filter);
        res.status(200).json(results);
    }catch(err){
        res.status(500).json({error: "Internal Server Error."});
    }
};

export const deleteResult = async (req, res) => {
    try{
        const {id} = req.params;
        const deletedResult = await Result.findByIdAndDelete(id);
        res.status(200).json({message: "Deleted Successfully.", item: deletedResult});
    }catch(err){
        res.status(500).json({error: "Internal Server Error."});
    }
};
