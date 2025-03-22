"use client";

import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from 'next/navigation'; 
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { QuestionsSchema } from "@/lib/validations";
import { Badge } from "lucide-react";
import Image from "next/image";
import { createQuestion } from "@/lib/actions/question.action";
import { useTheme } from "@/context/ThemeProvider";

const type: any = 'create'
interface Props {
  mongoUserId: string; 
}
const Question = ( {mongoUserId} : Props) => {
  const { mode } = useTheme();
  const router = useRouter(); 
  const pathname = usePathname(); 
  const editorRef = useRef(null);
  const [isSubmitting, setisSubmitting] = useState(false);
  // const log = () => {
  //   if (editorRef.current) {
  //     console.log(editorRef.current.getContent());
  //   }
  // };
  const form = useForm<z.infer<typeof QuestionsSchema>>({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: "",
      explanation: "",
      tags: [],
    },
  });

  async function onSubmit(values: z.infer<typeof QuestionsSchema>) {
    setisSubmitting(true);
    try {
      // make async call to API -> create a question 
      // navigate to home page to view question posted 
      await createQuestion({
        title: values.title,
        content: values.explanation,
        tags: values.tags,
        author: JSON.parse(mongoUserId),
        path: pathname,
      }); 

      router.push('/');
    } catch (error) {
      
    } finally {
      setisSubmitting(false); 
    }
  }

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault();

      const tagInput = e.target as HTMLInputElement;
      const tagvalue = tagInput.value.trim();

      if (tagvalue !== "") {
        if (tagvalue.length > 15) {
          return form.setError("tags", {
            type: "required",
            message: "Tag must be less than 15 characters",
          });
        }

        if (!field.value.includes(tagvalue as never)) {
          form.setValue("tags", [...field.value, tagvalue]);
          tagInput.value = "";
          form.clearErrors("tags");
        }
      } else {
        form.trigger();
      }
    }
  };
  
  const handleTagRemove = (tag: string , field: any) =>{ 
    const newTags = field.value.filter((t: string) => t !== tag);
     form.setValue('tags' ,newTags);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragrph-seminold text-dark400_light800">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 test-dark300_light700 m-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular text mt-2.5 text-light-500">
                Be specific and imagine you&apos;re asking a question to another
                person.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragrph-seminold text-dark400_light800">
                Detailed Explanation of your problem{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  tinymceScriptSrc={
                    process.env.PUBLIC_URL + "/tinymce/tinymce.min.js"
                  }
                  onInit={(evt, editor) =>
                    // @ts-ignore
                    editorRef.current = editor
                  }
                  onBlur={field.onBlur}
                  onEditorChange={(content) => field.onChange(content)}
                  initialValue=""
                  init={{
                    height: 350,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "fullscreen",
                      "codesample",
                      "insertdatetime",
                      "media",
                      "table",
                      "preview",
                    ],
                    toolbar:
                      "undo redo | blocks | " +
                      "codesample" +
                      "bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | ",
                    content_style: "body { font-family:Inter; font-size:16px }",
                    skin: mode === 'dark' ? 'oxide-dark' : 'oxide',
                    content_css: mode === 'dark'  ? 'dark' : 'light',
                  }}
                />
              </FormControl>
              <FormDescription className="body-regular text mt-2.5 text-light-500">
                Introduce the problem and expand on what you put in the tile.
                Minimum 20 characters.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragrph-seminold text-dark400_light800">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <>
                  <Input
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 test-dark300_light700 m-h-[56px] border"
                    placeholder="Add Tags..."
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />
                  {field.value.length > 0 && (
                    <div className="flex-start mt-2.5 gap-2.5">
                      {field.value.map((tag: any) => (
                        <Badge key={tag} className="suble-medium background-light800_dark300 text-light400_light500 flex items-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                        onClick={() => handleTagRemove(tag, field)}>
                          {tag}
                          <Image
                            src="/assets/icons/close.svg/"
                            alt="close icon"
                            width={12}
                            height={12}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription className="body-regular text mt-2.5 text-light-500">
                Add upto 3 tags to describe what your question is about. You
                need to press enter to add a tag
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button type="submit" className="primary-gradient w-fit !text-light-900 disabled={isSubmitting}">
          {
            isSubmitting ? (
              <>
                {type === 'edit' ? 'Editing...' : 'Posting...'}
              </>
            ) : (
              <>
                {type === 'edit' ? 'Edit Question' : 'Ask Question'}
              </>
            )
          }
        </Button>
      </form>
    </Form>
  );
};

export default Question;
