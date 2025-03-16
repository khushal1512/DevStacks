"use server"

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import { CreateAnswerParams } from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";


export async function createAnswer(params: CreateAnswerParams) {
    try {
      connectToDatabase();
  
      const { content, author, question, path } = params;
  
      const newAnswer = await Answer.create({
        content,
        author,
        question,
        path,
      });
  
      // add the answer to the question's answers array
  
      // create an interaction record for the user's create_answer actions
  
      // increment author's reputation by +S for creating a answer
      await User.findByIdAndUpdate(author, { $inc: { reputation: 10 } });
  
      revalidatePath(path);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  