import CompleteButton from "./CompleteButton";
import renderer from "react-test-renderer";

it("renders correctly", () => {
    const todoID = "3";
    const todo = {
        id: todoID
    };
    const socket = {};
    const component = renderer.create(
        CompleteButton({todo, socket})
    ).toJSON();

    expect(component).toMatchSnapshot();
});
