import React from 'react'
export function Input(props){ return <input {...props} className={'border w-full rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 ring-zinc-300 '+(props.className||'')} /> }
