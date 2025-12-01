import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

const TaskListPagination = ({handleNext, handlePrev, handlePageChange, page, totalPage}) => {

{/* B1. Render lần đầu (page = 1)

generatePages(totalPage=5, page=1) ⇒ pagesToShow = [1, 2, 3, "…", 5]

JSX hiển thị các nút: 1 2 3 … 5

isActive={p === page} → nút 1 được highlight. */}
const generatePage = () => {
  const pages = [];
    if(totalPage < 4){
      // hien thi toan bo
      for(let i = 1; i <= totalPage; i++){
        pages.push(i);
      }
    }
    else {
      if(page <= 2){
        pages.push(1, 2, 3, "...", totalPage);
      }
      else if(page >= totalPage - 1) {
        pages.push(1, "...", totalPage -2, totalPage -1, totalPage);
      }
      else {
        pages.push(1,"...", page, "...", totalPage);
      }
    }
  return pages;
}

const pagesToShow = generatePage();

 return (
    <div className="flex justify-center mt-4">
      <Pagination>
      <PaginationContent>

        {/* truoc */}
        <PaginationItem>
          <PaginationPrevious
            onClick = {page === 1 ? undefined : handlePrev}
            className={cn(
              "cursor-pointer",
              page === 1 && "pointer-events-none opacity-50"
            )}
          />
        </PaginationItem>

        {pagesToShow.map((p, index)=>(
          <PaginationItem key={index}>
            {p === "..." ? (<PaginationEllipsis/>) : (
              <PaginationLink
              //neu p bang danh sach hien tai thi highlight no
                isActive = {p === page}
                onClick={()=>{
                  if(p!==page) handlePageChange(p); // ⬅️ newPage = p
                }}
                className='cursor-pointer'
              >
                {p}
              </PaginationLink>
            )} 
          </PaginationItem>
        ))}

        {/* trang sau */}
        <PaginationItem>
          <PaginationNext 
            onClick = {page === totalPage ? undefined : handleNext}
            className={cn(
              "cursor-pointer",
              page === totalPage && "pointer-events-none opacity-50"
            )}
          />
        </PaginationItem>

        
      </PaginationContent>
    </Pagination>
    </div>
  )
}

export default TaskListPagination