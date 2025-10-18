import React from 'react'
import { TypographyH1 } from '../components/Typography/TypographyH1'
import { Button } from '@/components/ui/button'
import { logout } from '../lib/actions/auth'
const HomeLayout = ({children}:{children: React.ReactNode}) => {
  return (
    <>
    <div className='flex items-center w-full mx-auto'>
      <TypographyH1 className='py-3 tracking-wide w-full'>Project planner</TypographyH1>
      <div className='px-3'>
        <Button onClick={logout} className='cursor-pointer'>Sign out</Button>
      </div>
    </div>
    {children}
    </>
  )
}

export default HomeLayout