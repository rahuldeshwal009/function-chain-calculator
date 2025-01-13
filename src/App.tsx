import { useMemo, useState } from "react";
import { useEquationsAndIterator } from "./hooks/useEquationsAndIterator";
import "./App.css";

function App() {
  const [initialInput, setInitialInput] = useState<string | undefined>();

  const {
    equations,
    nextIterator,
    handleEquationChange,
    calculateFinalResult,
  } = useEquationsAndIterator();

  const output = useMemo(
    () => calculateFinalResult(String(initialInput)),
    [initialInput, calculateFinalResult]
  );

  return (
    <>
      <div className="flex-container">
        <div className="box ">
          <div className="initial-input">
            <input
              type="text"
              placeholder="Initial input"
              onChange={(e) => setInitialInput(e.target.value)}
            />{" "}
          </div>
        </div>

        {Object.keys(equations).map((functionName) => (
          <div className="box">
            <div className="heading">
              <div className="dots">
                <div>...</div>
                <div>...</div>
              </div>

              <div className="title">
                <h3>{functionName}</h3>
              </div>
            </div>

            <div>
              <label htmlFor={functionName}>Equation</label>
              <input
                type="text"
                id={functionName}
                placeholder="Enter equation"
                value={equations[functionName] ?? ""}
                className={equations[functionName] ? "" : "error"}
                onChange={(e) => {
                  // if (ARITHMETIC_OPERATORS_REGEX.test(e.target.value)) {
                  handleEquationChange(e.target.value, functionName);
                  // }
                }}
              />
            </div>

            <div>
              <label htmlFor="dropdown">Next function</label>
              <select id="dropdown" name="dropdown" disabled>
                <option
                  value={nextIterator[functionName] ?? ""}
                  // disabled={Boolean(!nextIterator[functionName])}
                  selected={nextIterator[functionName] === functionName}
                >
                  {nextIterator[functionName] ?? "-"}
                </option>
              </select>
            </div>
          </div>
        ))}

        <div className="box output">
          <span>{`Output: ${output ?? ''}`}</span>
        </div>
      </div>
    </>
  );
}

export default App;
