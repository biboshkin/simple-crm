import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import "./mocks/matchMedia";

configure({ adapter: new Adapter() });
