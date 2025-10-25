import React from 'react'

const Footer = ({ completedTasksCount = 2, activeTasksCount = 3 }) => {
  return (
    <>
      {(completedTasksCount + activeTasksCount > 0) && (
        <div className='text-center'>
          <p className='text-sm text-muted-foreground'>
            {completedTasksCount > 0 && (
              <>
                ban da hoan thanh {completedTasksCount} viec
                {/* nếu activetaskscount > 0 thì render vế sau &&, nếu ko thì ẩn */}
                {activeTasksCount > 0 && `, con ${activeTasksCount} viec nua thoi!`}
              </>
            )}

            {completedTasksCount === 0 && activeTasksCount > 0 && (
              <>Hay bat dau lam {activeTasksCount} nhiem vu nao!</>
            )}
          </p>
        </div>
      )}
    </>
  );
};


export default Footer