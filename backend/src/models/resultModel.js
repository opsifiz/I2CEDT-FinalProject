import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  userPrompt: {
    type: String,
    required: true,
  },
  algorithm: {
    type: String,
    required: true,
  },
  timeComplexity: {
    type: String,
    required: true,
  },
  textMessage: {
    type: String,
    required: true,
  },
  LLMMessage: {
    type: String,
    required: true,
  },
});

const Result = mongoose.model("Result", resultSchema);

export default Result;
