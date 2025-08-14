import React from 'react'
export function Button({ children, className='', variant='default', size='default', ...props }) {
  const base = 'inline-flex items-center justify-center px-3 py-2 rounded-2xl text-sm font-medium shadow-sm transition active:scale-[.98]';
  const variants = {
    default: 'bg-black text-white hover:opacity-90',
    secondary: 'bg-zinc-200 text-zinc-900 hover:bg-zinc-300',
    outline: 'border border-zinc-300 bg-white hover:bg-zinc-50',
    ghost: 'hover:bg-zinc-100'
  };
  const sizes = { icon:'h-9 w-9 p-0', default:'' };
  return <button className={[base, variants[variant], sizes[size], className].join(' ')} {...props}>{children}</button>
}
