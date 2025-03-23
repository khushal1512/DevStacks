'use client'
import React from 'react'
import Image from 'next/image';
import { getFormattedNumber } from '@/lib/utils';
import { UserId, Voting } from '@/lib/actions/shared.types';
import { downvoteQuestion, upvoteQuestion } from '@/lib/actions/question.action';
import { usePathname, useRouter } from 'next/navigation';
import { toggleSaveQuestion } from '@/lib/actions/user.action';


interface Props extends UserId, Voting {
    type: string;
    itemId: string;
    upvotes: number;
    downvotes: number;
    hasSaved?: boolean;
  }

const Votes = ({
    type,
    itemId,
    userId,
    upvotes,
    hasupVoted,
    downvotes,
    hasdownVoted,
    hasSaved,
  }: Props) => {
    const router = useRouter();
    const pathname = usePathname();

    const handleSave = async () => {
        await toggleSaveQuestion({
          userId: JSON.parse(userId),
          questionId: JSON.parse(itemId),
          path: pathname,
        });
      };
  const handleVote = async (action: string) => {
      if (!userId) {
        return new Error("Cannot upvote")
      }
  
      if (action === "upvote") {
        if (type === "Question") {
          await upvoteQuestion({
            questionId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            hasupVoted,
            hasdownVoted,
            path: pathname,
          });
        } else if (type === "Answer") {
          await upvoteAnswer({
            answerId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            hasupVoted,
            hasdownVoted,
            path: pathname,
          });
        }
      }
  
      if (action === "downvote") {
        if (type === "Question") {
          await downvoteQuestion({
            questionId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            hasupVoted,
            hasdownVoted,
            path: pathname,
          });
        } else if (type === "Answer") {
          await downvoteAnswer({
            answerId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            hasupVoted,
            hasdownVoted,
            path: pathname,
          });
        }
      }
    };
  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasupVoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            width={18}
            height={18}
            alt="upvote"
            className="cursor-pointer"
            onClick={() => handleVote("upvote")}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {getFormattedNumber(upvotes)}
            </p>
          </div>
        </div>

        <div className="flex-center gap-1.5">
          <Image
            src={
              hasdownVoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            width={18}
            height={18}
            alt="downvote"
            className="cursor-pointer"
            onClick={() => handleVote("downvote")}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {getFormattedNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>

      {type === "Question" && (
        <Image
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          width={18}
          height={18}
          alt="star"
          className="cursor-pointer"
          onClick={handleSave()}
        />
      )}
    </div>
  )
}

export default Votes

function downvoteAnswer(arg0: { answerId: any; userId: any; hasupVoted: boolean; hasdownVoted: boolean; path: any; }) {
    throw new Error('Function not implemented.');
}
function upvoteAnswer(arg0: { answerId: any; userId: any; hasupVoted: boolean; hasdownVoted: boolean; path: any; }) {
    throw new Error('Function not implemented.');
}

