import QuestionsCard from "@/components/cards/QuestionsCard"
import HomeFilters from "@/components/home/HomeFilters"
import Filter from "@/components/shared/Filter"
import NoResult from "@/components/shared/NoResult"
import LocalSearchbar from "@/components/shared/search/LocalSearchbar"
import { Button } from "@/components/ui/button"
import { HomePageFilters } from "@/constants/filters"
import { getQuestions } from "@/lib/actions/question.action"
import Link from "next/link"
import React from "react"


const questions = [
  { 
    _id: "1", 
    title: "Cascading Deletes in SQLAlchemy?", 
    tags: [
      { _id: "1", name: "python" }, 
      { _id: "2", name: "sql" }
    ],
    author: {
      _id: "101",
      name: "John Doe",
      picture: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    upvotes: 10, 
    views: 100, 
    answers: [{}, {}], // Array of objects, even if empty
    createdAt: new Date("2021-09-01T12:00:00.000Z")
  },
  { 
    _id: "2", 
    title: "Cascading Deletes in Alchemy?", 
    tags: [
      { _id: "3", name: "database" }, 
      { _id: "4", name: "sqlalchemy" }
    ],
    author: {
      _id: "102",
      name: "John Do",
      picture: "https://randomuser.me/api/portraits/men/2.jpg"
    },
    upvotes: 15, 
    views: 250, 
    answers: [{}], 
    createdAt: new Date("2021-09-02T14:30:00.000Z")
  },
  { 
    _id: "3", 
    title: "Cascading in SQL?", 
    tags: [
      { _id: "5", name: "databases" }, 
      { _id: "6", name: "mysql" }
    ],
    author: {
      _id: "103",
      name: "Jon Doe",
      picture: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    upvotes: 20, 
    views: 300, 
    answers: [{}, {}, {}], 
    createdAt: new Date("2021-09-03T10:00:00.000Z")
  },
  { 
    _id: "4", 
    title: "Deletes in SQLAlchemy?", 
    tags: [
      { _id: "7", name: "orm" }, 
      { _id: "8", name: "flask" }
    ],
    author: {
      _id: "104",
      name: "Joh Doe",
      picture: "https://randomuser.me/api/portraits/men/4.jpg"
    },
    upvotes: 30, 
    views: 500, 
    answers: [{}], 
    createdAt: new Date("2021-09-04T08:45:00.000Z")
  }
];

export default async function Home() {

  const result = await getQuestions({});

  console.log(result.questions);
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar 
          route="/"
          iconPosition="left"
          placeholder=""
          imgSrc="/assets/icons/search.svg"
          otherClasses="flex-1"
          />
          <Filter 
            filters={HomePageFilters}
            otherClasses="min-h-[56px] sm:min-w-[170px]"
            containerClasses="hidden max-md:flex"
            />
      </div>
      <HomeFilters />

      <div className="mt-10 flex w-full flex-col gap-6">
        { 
          questions.length > 0 ? 
          questions.map((question) => (
            <QuestionsCard 
            key={question._id}
            _id={question._id}
            title={question.title}
            tags={question.tags}
            author={question.author}
            upvotes={question.upvotes}
            views={question.views}
            answers={question.answers}
            createdAt={question.createdAt}
            />
          )) : 
          <NoResult 
          title="There's no question to show"
          description="Be the first to break the silence! Ask a Question 
            and kickstart the discussion. Our query could be the 
            next big thing others learn from. Get involved!"
          link="/ask-question"
          linkTitle="Ask a Question"
          />
        }
      </div>
    </>
  )
}

