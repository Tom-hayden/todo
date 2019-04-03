import FilterSelector from "./FilterSelector";
import {mount} from "enzyme";
import React from "react";

it("Calls onChange when filter is selected", () => {
    const onChangeMock = jest.fn();
    const event = {target: {value: "complete"} }
    const wrapper = mount(<FilterSelector onFilterChange={onChangeMock}/>);

    wrapper.find("FilterSelector").simulate("change", event)
    expect(onChangeMock).toHaveBeenCalledWith("complete");
})
