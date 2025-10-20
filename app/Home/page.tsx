"use client"
import {z} from 'zod'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TypographyH2 } from '../components/Typography/TypographyH2'
import { TypographyP } from '../components/Typography/TypographyP'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
const formSchema = z.object({
  department:z.string().nonempty(),
  projectName: z.string().min(2),
  projectType:z.string(),
  Steps:z.string()
})
const HomePage = () => {
  return (
    <div>
      <TypographyH2 className=' border-none text-center tracking-wide
'>Start by choosing your project</TypographyH2>

    <Card className='flex items-center space-x-2 w-max mx-auto p-2'>
      <CardContent className='space-y-3'>
        <div className='flex items-center space-x-1'>
          <TypographyP>Department: </TypographyP>
          <Select>
          <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Project department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Architecture</SelectItem>
          <SelectItem value="dark">Computer Science</SelectItem>
          <SelectItem value="system">Electrical</SelectItem>
          <SelectItem value="system">Artificial Intaligence</SelectItem>
        </SelectContent>
      </Select>
        </div>

        <div className='flex items-center space-x-1'>
      <TypographyP>Project Name: </TypographyP>
      <Input type='text' placeholder='Project name' />
        </div>
      </CardContent>
    </Card>
  </div>
  )
}

export default HomePage