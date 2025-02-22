import { title } from 'process';
import React from 'react'


interface QuestionProps {
    _id: string;
    title: string; 
    tags: {
        _id: string;
        name: string;
    }[]; 
    author: {
        _id: string; 
        name: string; 
        picture: string; 
    };
    upvotes: number; 
    views: number; 
    answers: Array<object>;
    createdAt: Date;
}
const QuestionsCard = ({ _id, title, tags, author, views, upvotes, answers, createdAt} : QuestionProps) => {
  return (
    <div>QuestionsCard</div>
  )
}

export default QuestionsCard