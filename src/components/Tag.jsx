import React from 'react'

export default function Tag({
    children
}) {
  return (
    <div className='lg:px-[50px] py-[8px] px-[20px] text-center rounded-full text-[var(--color-primary)] border border-[var(--color-primary)]'>
        <p className='p-body2'>{children}</p>
    </div>
  )
}
