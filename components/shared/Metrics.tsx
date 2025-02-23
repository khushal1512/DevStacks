import Image from 'next/image';
import React from 'react'


interface MetricProps { 
  imgUrl: string; 
  alt: string; 
  value: string | number; 
  title: string; 
  href?: string; 
  isAuthor?: string;
  textStyles?:string; 
}

const Metrics = ({ imgUrl, alt, value, title, href, textStyles, isAuthor} : MetricProps ) => {
  return (
    <div className='flex-center flex-wrap gap-1'>
      <Image
        src={imgUrl}
        width={16}
        height={16}
        alt={alt}
        className={`object-contain ${href ? 'rounded-full' : ''}`}
    </div>
  )
}

export default Metrics