import React from 'react'
import { Card } from './ui/card'
import { Circle } from 'lucide-react'

function TaskEmptyState({filter}) {
  return (
   <Card className='p-8  text-center border-0 bg-gradient-card shadow-custom-md'>
    <div className='space-y-3'>
        <Circle className='size-12 mx-auto text-muted-foreground' />
        <div>
            <h3 className='font-medium text-foreground'>
                {
                    filter === 'active' ? 'khong co nhiem vu nao dang lam':
                    filter === 'completed' ? 'chua co nhiem vu nao hoan thanh':
                    "chua co nhiem vu"
                }
            </h3>
             
            <p className='text-sm text-muted-foreground'>
                {
                    filter === 'all' ? 'them nhiem vu dau tien de bat dau!':
                    `chuyen sang "tat ca" de thay nhung nhiem vu ${filter === 'active' ? 'da hoan thanh' : 'dang lam'}`
                }
            </p>
        </div>
    </div>
   </Card>
  )
}

export default TaskEmptyState