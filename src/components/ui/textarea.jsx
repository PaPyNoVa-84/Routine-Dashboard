import React from 'react'
export function Textarea({className='', ...props}){ return <textarea {...props} className={'border w-full rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 ring-zinc-300 '+className} /> }
