import TodoPage from "./TodoPage";
import todoFilters from "./TodoListFilters"
import {shallow} from "enzyme";
import React from "react";

it("Updates state on filter change", () => {
    const wrapper = shallow(<TodoPage />)

    wrapper.instance().onFilterChange("active");
    expect(wrapper.state().filter.name).toEqual(todoFilters.active.name)

})