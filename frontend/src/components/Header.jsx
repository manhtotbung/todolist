import React from 'react'

const Header = () => {
  return (
    <div className='space-y-2 text-center '>
        <img src="/logo.png" alt="logo" className="h-20 md:h-24 inline-block" />
      <p className='text-muted-foreground'>Giúp bạn quản lý nhiệm vụ cần làm!</p>
    </div>
  )
}

export default Header