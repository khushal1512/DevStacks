import React from 'react'
import { URLProps } from '@/types'


const page = ({ params, searchParams}: URLProps) => {
  return (
    <div>{params.id}</div>
  )
}

export default page