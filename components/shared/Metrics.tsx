import Image from 'next/image';
import Link from 'next/link';
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

  const metricsContent = (
    <>
      <Image
        src={imgUrl}
        width={16}
        height={16}
        alt={alt}
        className={`object-contain ${href ? 'rounded-full' : ''}`}
        />
        <p className={`${textStyles} flex items-center gap-1`}>
          {value}

          <span className={`small-regular line-clamp-1 ${isAuthor === "true" ? 'max-sm:hidden' : ''}`}>
          {title}
          </span>
        </p>
    </>
  )

  if(href) {
    return (
      <Link href={href} className='flex-center gap-1'>
        {metricsContent}
      </Link>
    )
  }
  return (
    <div className='flex-center flex-wrap gap-1'>
      {metricsContent}
    </div>
  )
}

export default Metrics