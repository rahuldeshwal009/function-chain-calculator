import { useCallback, useMemo, useState } from "react";
import { calculateEquation, funcExecutionOrder, funcNextIterator } from "../helpers";
import { EXECUTION_ORDER } from "../constants";

export const useEquationsAndIterator = () => {     
  const [equations, setEquations] = useState(() => funcExecutionOrder(EXECUTION_ORDER));

  const nextIterator = useMemo(() => funcNextIterator(EXECUTION_ORDER), []);

  const handleEquationChange = (equation: string, functionName: string) => {
    setEquations((prevEquations) => {
      const updatedEquations = { ...prevEquations };
      updatedEquations[functionName] = equation;
      return updatedEquations;
    });
  };

  const calculateFinalResult = useCallback((x: string) => {
    if (!x) return;
    let result = Number(x);

    const expressions = Object.values(equations);

    expressions.forEach((equation) => {
      if (equation) {
        result = Number(calculateEquation(equation, String(result)));
      }
    });

    return result;
  }, [equations]);

  return {
    equations,
    handleEquationChange,
    nextIterator,
    calculateFinalResult,
  }
}