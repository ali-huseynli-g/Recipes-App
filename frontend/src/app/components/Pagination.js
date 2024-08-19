"use client";
import Pagination from "react-bootstrap/Pagination";

export default function RecipesPagination({
  totalRecipes,
  recipesPerPage,
  currentPage,
  setCurrentPage,
}) {
  let items = [];

  for (
    let number = 1;
    number <= Math.ceil(totalRecipes / recipesPerPage);
    number++
  ) {
    items.push(
      <Pagination.Item
        key={number}
        className="paginationNumber"
        active={number === currentPage}
        onClick={() => {
          setCurrentPage(number);
        }}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <div>
      <Pagination size="sm">
        <Pagination.First
          onClick={() => {
            setCurrentPage(1);
          }}
          className="paginationNavigation"
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={() => {
            setCurrentPage(currentPage - 1);
          }}
          className="paginationNavigation"
          disabled={currentPage === 1}
        />
        {items}
        <Pagination.Next
          onClick={() => {
            setCurrentPage(currentPage + 1);
          }}
          className="paginationNavigation"
          disabled={currentPage === Math.ceil(totalRecipes / recipesPerPage)}
        />
        <Pagination.Last
          onClick={() => {
            setCurrentPage(Math.ceil(totalRecipes / recipesPerPage));
          }}
          className="paginationNavigation"
          disabled={currentPage === Math.ceil(totalRecipes / recipesPerPage)}
        />
      </Pagination>
    </div>
  );
}
