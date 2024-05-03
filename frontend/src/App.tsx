import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
function App() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    fetch("/api/expenses/total-spent")
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, []);
  return (
    <>
      <Button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </Button>
    </>
  );
}

export default App;
