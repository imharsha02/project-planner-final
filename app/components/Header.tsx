"use client"
import { TypographyH1 } from './Typography/TypographyH1'
import { Button } from '@/components/ui/button'
import { login, logout } from '../lib/actions/auth'
import { usePathname } from 'next/navigation'
const Header = () => {
  const pathName = usePathname();
  return (
    <>
      <div className='flex items-center w-full mx-auto'>
      <TypographyH1 className='py-3 tracking-wide w-full'>Project planner</TypographyH1>
      <div className='px-3'>
        {
          pathName=="/"?(<Button onClick={login} className='cursor-pointer'>Sign in with Github</Button>):<Button onClick={logout} className='cursor-pointer'>Sign out</Button>
        }
      </div>
    </div>
    </>
  )
}

export default Header