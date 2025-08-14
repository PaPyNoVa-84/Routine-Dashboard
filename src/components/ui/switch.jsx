import React from 'react'
export function Switch({ checked, onCheckedChange }){
  return <input type="checkbox" role="switch" checked={!!checked} onChange={e=>onCheckedChange?.(e.target.checked)} className="h-5 w-10 appearance-none rounded-full bg-zinc-300 checked:bg-emerald-500 relative outline-none transition before:content-[''] before:absolute before:h-4 before:w-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 before:transition checked:before:translate-x-5" />
}
