import React from "react";

function FilterSelector({onFilterChange}) {
    return (
        <select id="filter-dropdown" name="filter" 
            onChange={(event) => onFilterChange(event.target.value)}>
            <option value="all" id="dropdown-all">All</option>
            <option value="active" id="dropdown-active">Active</option>
            <option value="complete" id="dropdown-complete">Complete</option>
        </select>
    )
}

export default FilterSelector;