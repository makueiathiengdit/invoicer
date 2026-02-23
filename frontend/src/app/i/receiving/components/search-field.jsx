import { Search } from "lucide-react";
import React from "react";

const SearchField = () => {
  return (
    <div>
      <form className="max-w-md mx-auto">
        <label
          htmlFor="search"
          className="block mb-2.5 text-sm font-medium text-heading sr-only "
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <Search className="text-teal-600 w-4 h-4" />
          </div>
          <input
            type="search"
            id="search"
            className="block w-full p-3 ps-9  border border-teal-600 text-heading text-sm rounded focus:ring-teal-600 focus:border-teal-600 shadow-xs placeholder:text-teal-600"
            placeholder="Search"
            required
          />
          <button
            type="button"
            className="absolute end-1.5 bottom-1.5 text-white bg-primary hover:bg-teal-600 box-border border border-transparent focus:ring-4 focus:ring-teal-600 shadow-xs font-medium leading-5 rounded text-xs px-3 py-1.5 focus:outline-none"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchField;
