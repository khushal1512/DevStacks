import React, { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AnswerValidation } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { Editor } from '@tinymce/tinymce-react'
import { useTheme } from '@/context/ThemeProvider'
import { Button } from '../ui/button'
import Image from 'next/image'
import { createAnswer } from '@/lib/actions/answer.action'
import { usePathname } from 'next/navigation'

interface Props {
  question: string; 
  questionId: string; 
  authorId: string;
}
const Answer = ( { question, questionId, authorId} : Props) => {
    const pathname = usePathname();
    const [ isSubmitting, setisSubmitting] = useState(false); 
    const {mode} = useTheme();
    const editorRef = React.useRef(null)

    const form = useForm<z.infer<typeof AnswerValidation>>({
        resolver: zodResolver(AnswerValidation),
        defaultValues: {
            answer: ''
        }
    })

    const handleCreateAnswer = async () => {
      setisSubmitting(true); 
       
      try {
        await createAnswer({
          content: values.answer,
          author: JSON.parse(authorId),
          question: JSON.parse(questionId),
          path: pathname,
        });

        form.reset(); 

        if(editorRef.current) {
          const editor = editorRef.current as any; 

          editor.setContent(''); 

        }
      } catch (error) {
        
      } finally {
        setisSubmitting(false);
      }
    }
  return (
    <div>
      <div className='flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
        <h4 className="paragraph-semibold text-dark400_light800">Write your answer here</h4>

        <Button className="btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500">
          <Image
            src="/assets/icons/stars.svg"
            alt="star"
            width={12}
            height={12}
            className={`object-contain`}
            />
            { isSubmitting ? 'Generating' : 'Generate Answer'}
            </Button>
      </div>
    <Form {...form}>
        <form 
        className='mt-6 flex w-full flex-col gap-10'
        onSubmit={form.handleSubmit(handleCreateAnswer)}>
            <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
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
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button
          type='submit'
          className='priamry-gradient w-fit text-white'
          disabled={isSubmitting}
          >
            { isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
        </form>
    </Form>
    </div>
  );
};

export default Answer