"use server";

import { connectToDatabase } from "../mongoose";
import User from "@/database/user.model";
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, UpdateUserParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

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