import Link from "next/link";
import { title } from "process";
import React from "react";
import RenderTag from "../shared/RenderTag";
import Metrics from "../shared/Metrics";
import { getTimestamp } from "@/lib/utils";

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

const QuestionsCard = ({
  _id,
  title,
  tags,
  author,
  views,
  upvotes,
  answers,
  createdAt,
}: QuestionProps) => {
  return (
    <div className="card-wrapper p-9 sm:rounded-[10px] sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimestamp(createdAt)}
          </span>
          <Link href={`/questions/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>

        {/* {if signed in add edit delete action} */}
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
        ))}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metrics
          imgUrl="/assets/icons/avatar.svg"
          alt="user"
          value={author.name}
          title={` - asked ${getTimestamp(createdAt)}`}
          href={`/profile/${author._id}`}
          isAuthor="true"
          textStyles="small-medium text-dark400_light700"
        />

        <Metrics
          imgUrl={author.picture}
          alt="Upvotes"
          value={upvotes}
          title="Votes"
          textStyles="small-medium text-dark400_light800"
        />

        <Metrics
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={upvotes}
          title="Votes"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
    </div>
  );
};

export default QuestionsCard;
