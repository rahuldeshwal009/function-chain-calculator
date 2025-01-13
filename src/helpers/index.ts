// const sampleEquations1 = ['x + x', 'x + 2*x', 'x + 3*x', 'x + 4*x', 'x + 5*x']
// const sampleEquations2 = ["x+xx", "x + 2x", "x + 3x", "x + 4x", "x+(5x+2)"];

export const funcExecutionOrder = (execOrder: number[]) =>
  execOrder.reduce<Record<string, string>>((acc, curr) => {
    acc[`Function ${curr}`] = '';
    return acc;
  }, {});

export const funcNextIterator = (execOrder: number[]) =>
  execOrder.reduce<Record<string, string | undefined>>((acc, curr, index) => {
    acc[`Function ${curr}`] = execOrder[index + 1]
      ? `Function ${execOrder[index + 1]}`
      : undefined;
    return acc;
  }, {});

const sanitizeEquation = (equation: string) => {
  equation = equation.replace(/\s+/g, ''); // remove space
  equation = equation.replace(/(\d)(x)/g, "$1*$2"); //-> (i.e -> "2x" to "2*x"

  equation = equation.replace(/x+/g, (match) => match.split("").join(" * ")); //(i.e -> "xxx" to "x*x*x")

  return equation;
};

export function calculateEquation(equation: string, xValue: string) {
  const sanitizeExpression: string = sanitizeEquation(equation);

  const equationWithValues = sanitizeExpression.replace(/x/g, xValue);

  // Tokenize the equation into numbers and operators
  const tokens: string[] = equationWithValues
    .split(/\s*(\+|-|\*|\/|\^|\(|\))\s*/)
    .filter((token: string) => token.trim() !== "");

  // apply operators and calculate results
  function applyOperator(operators: string[], stack: number[]) {
    const right = stack.pop() ?? 0;
    const left = stack.pop() ?? 0;
    const operator = operators.pop();

    if (operator === "+") stack.push(left + right);
    if (operator === "-") stack.push(left - right);
    if (operator === "*") stack.push(left * right);
    if (operator === "/") stack.push(left / right);
    if (operator === "^") stack.push(Math.pow(left, right)); // Exponentiation
  }
  // handle operator precedence
  function precedence(op: string) {
    if (op === "+" || op === "-") return 1;
    if (op === "*" || op === "/") return 2;
    if (op === "^") return 3;
    return 0;
  }

  // Process the tokens
  const numbersStack: number[] = [];
  const operatorsStack: string[] = [];

  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];

    if (token === "(") {
      // If the token is a '(', push it to the operators stack
      operatorsStack.push(token);
    } else if (token === ")") {
      // If the token is a ')', pop from operators stack and apply operators until '(' is found
      while (operatorsStack[operatorsStack.length - 1] !== "(") {
        applyOperator(operatorsStack, numbersStack);
      }
      operatorsStack.pop(); // Pop '(' from stack
    } else if (/\d+(\.\d+)?/.test(token)) {
      // If the token is a number, push it to the numbers stack
      numbersStack.push(parseFloat(token));
    } else if (["+", "-", "*", "/", "^"].includes(token)) {
      // If the token is an operator
      while (
        operatorsStack.length &&
        precedence(operatorsStack[operatorsStack.length - 1]) >=
          precedence(token)
      ) {
        // Apply the operator if it has higher or equal precedence
        applyOperator(operatorsStack, numbersStack);
      }
      // Push the current operator to the operators stack
      operatorsStack.push(token);
    }

    i++;
  }

  // Apply remaining operators in the stack
  while (operatorsStack.length) {
    applyOperator(operatorsStack, numbersStack);
  }

  return numbersStack[0];
}
