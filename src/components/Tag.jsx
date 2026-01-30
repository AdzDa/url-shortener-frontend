import React from 'react'

export default function Tag({
    children
}) {
  return (
    <div className='px-[50px] py-[8px] text-center rounded-full text-[var(--color-primary)] border border-[var(--color-primary)]'>
        <p className='p-body2'>{children}</p>
    </div>
  )
}
