"use server";

import { connectToDatabase } from "../mongoose";
import User from "@/database/user.model";
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, GetSavedQuestionParams, GetUserByIdParams, GetUserStatsParams, ToggleSaveQuestionParams, UpdateUserParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import { FilterQuery } from "mongoose";
import Answer from "@/database/answer.model";
import Tag from "@/database/tag.model";

export async function getUserById(params: any) {
  try {
    connectToDatabase();
    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

 export async function getUserInfo(params: GetUserByIdParams) {
    try {
      connectToDatabase();
  
      const { userId } = params;
  
      const user = await User.findOne({ clerkId: userId });

      const totalQuestions = await Question.countDocuments({ author: user._id });
      const totalAnswers = await Answer.countDocuments({ author: user._id });

      if (!user) {
        throw new Error("User not found");
      }
      return {
        user,
        totalQuestions,
        totalAnswers,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  
export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();
    const newUser = await User.create(userData);

    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = params;
    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
    try {
      connectToDatabase();
  
      const { clerkId } = params;
      
      const user = await User.findOneAndDelete({clerkId}); 

      if(!user) {
        throw new Error('User not found'); 
      }

      // delete user's entire history on application from DB

      //const userQuestionIds = await Question.find({ author: user._id}).distinct('id'); 

      await Question.deleteMany({ author: user._id}); 

      const deletedUser = await User.findByIdAndDelete(user._id); 

      return deletedUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase(); 

    // const { page = 1, pageSize = 20, filter, searchQuery} = params; 

    const users = await User.find({})
      .sort({ createdAt : -1});

    return { users };
  } catch (error) {
    console.log(error); 
    throw error;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase();

    const { userId, questionId, path } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const isQuestionSaved = user.saved.includes(questionId);

    if (isQuestionSaved) {
      // remove question from saved
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      );
    } else {
      // add question to saved
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true }
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSavedQuestions(params: GetSavedQuestionParams) {
  try {
    connectToDatabase();

    const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params;

    // Calculate the number of questions to skip based on the page number and page size
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [{ title: { $regex: new RegExp(searchQuery, "i") } }];
    }

    let sortOptions = {};

    switch (filter) {
      case "most_recent":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "most_voted":
        sortOptions = { upvotes: -1 };
        break;
      case "most_viewed":
        sortOptions = { views: -1 };
        break;
      case "most_answered":
        sortOptions = { answers: -1 };
        break;
      default:
        break;
    }

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: sortOptions,
        skip: skipAmount,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!user) {
      throw new Error("User not found");
    }

    const savedQuestions = user.saved;

    return { questions: savedQuestions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;

    const totalQuestions = await Question.countDocuments({
      author: userId,
    });

    // Calculate the number of questions to skip based on the page number and page size
    const skipAmount = (page - 1) * pageSize;

    const userQuestions = await Question.find({ author: userId })
      .sort({ createdAt: -1, views: -1, upvotes: -1 })
      .skip(skipAmount)
      .limit(pageSize)
      .populate("tags", "_id name")
      .populate("author", "_id clerkId name picture");

    const isNext = totalQuestions > skipAmount + userQuestions.length;

    return { totalQuestions, questions: userQuestions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}