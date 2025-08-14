import React from 'react'
export function Select({ value, onValueChange, children }){ return <div>{children({ value, onValueChange })}</div> }
export function SelectTrigger({ children, className='' }){ return <div className={'border rounded-xl px-3 py-2 text-sm '+className}>{children}</div> }
export function SelectValue(){ return null }
export function SelectContent({ children }){ return <div className="hidden">{children}</div> }
export function SelectItem({ value, children, onSelect }){ return null }
