import React from 'react'
import { TypographyH1 } from './Typography/TypographyH1'
import { Button } from '@/components/ui/button'
import { login } from '../lib/actions/auth'

const Header = () => {
  return (
    <>
      <div className='flex items-center w-full mx-auto'>
      <TypographyH1 className='py-3 tracking-wide w-full'>Project planner</TypographyH1>
      <div className='px-3'>
        <Button onClick={login} className='cursor-pointer'>Sign in with Github</Button>
      </div>
    </div>
    </>
  )
}

export default Header