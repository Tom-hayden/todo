import React from "react";

function FilterSelector() {
    return (
        <select id="filter-dropdown" name="filter">
            <option value="all" id="dropdown-all">All</option>
            <option value="active" id="dropdown-active">Active</option>
            <option value="complete" id="dropdown-complete">Complete</option>
        </select>
    )
}

export default FilterSelector;