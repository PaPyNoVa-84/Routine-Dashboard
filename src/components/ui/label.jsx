import React from 'react'
export function Label({children, htmlFor, className=''}){ return <label htmlFor={htmlFor} className={'text-sm text-zinc-700 '+className}>{children}</label> }
