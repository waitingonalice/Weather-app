import Root from "./pages/root";
import imgURL from "assets/bg-light.png";

const App = () => (
  <div
    className={`bg-[url(${imgURL})] min-h-screen h-full flex justify-center p-4`}
  >
    <Root />
  </div>
);

export default App;
