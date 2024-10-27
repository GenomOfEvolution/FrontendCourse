const extractTokens = (inputString: string): string[] => {
    const chars = inputString.split('');
    const tokens: string[] = [];
    let currentNumber = '';
    
    chars.forEach((char, index) => {
        if (/\d/.test(char)) {
            currentNumber += char;
        } else {
            if (currentNumber.length > 0) {
                tokens.push(currentNumber);
                currentNumber = '';
            }

            if (char === " ") {
                return;
            }
            
            if (!/[()*/+\-]/.test(char)) {
                throw new Error(`Недопустимый символ: ${char} на позиции ${index}`);
            }
            tokens.push(char);
        }
    });

    if (currentNumber.length > 0) {
        tokens.push(currentNumber);
    }

    return tokens;
}

const processOperation = (operatorStack: string[], expressionStack: string[]) => {
    const curOper = operatorStack.pop()!;
    const operand1 = expressionStack.pop()!;
    const operand2 = expressionStack.pop()!;
    const newExpr = operand1 + " " + operand2 + " " + curOper;
    expressionStack.push(newExpr);
}

const prefixToPostfix = (tokens: string[]): string => {
    const operatorStack: string[] = [];
    const expressionStack: string[] = [];
    tokens = tokens.reverse();

    let index: number = 0;

    tokens.forEach(token => {
        if (!isNaN(parseInt(token))) {
            expressionStack.push(token);
            return;
        } 
        
        if (token === ")") {
            operatorStack.push(token);
            return;
        } 
        
        if (token === "(") {
            let curOper: string = "";
            while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== ")" ) {
                if (expressionStack.length < 2) {
                    throw new Error(`Неправильное выражение: недостаточно операндов для операции на позиции ${tokens.length - index}`);
                }

                processOperation(operatorStack, expressionStack);
            }

            if (operatorStack.length === 0) {
                throw new Error(`Неправильное выражение: несоответствие скобок на позиции ${tokens.length - index}`);
            }

            operatorStack.pop();
            return;
        } 
        
        operatorStack.push(token);
    });
    
    while (operatorStack.length > 0) {
        if (expressionStack.length < 2) {
            throw new Error("Неправильное выражение: недостаточно операндов для операции в конце выражения");
        }

        processOperation(operatorStack, expressionStack);
    }

    return expressionStack.pop()!;
}

const executeOperator = (num1: number, num2: number, oper: string): number => {
    switch (oper) {
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case '*':
            return num1 * num2;
        case '/':
            if (num2 === 0) {
                throw new Error('Division by zero is not allowed');
            }
            return num1 / num2;
        default:
            throw new Error('Unsupported operator');
    }
}

const calculatePostfix = (tokens: string[]): number => {
    const stack: number[] = [];
    tokens.forEach(token => {
        const tokenAsInt = parseInt(token);
        if (!isNaN(tokenAsInt)) {
            stack.push(tokenAsInt);
        } else {
            if (stack.length < 2) {
                throw new Error("Недостаточно операндов!");
            }

            const num2: number = stack.pop()!;
            const num1: number = stack.pop()!;

            stack.push(executeOperator(num1, num2, token));
        }
    });

    return stack.pop()!;
} 

const calc = (expr: string): number => {
    let res: number;
    let tokens: string[];

    try {
        tokens = extractTokens(expr);
        tokens = extractTokens(prefixToPostfix(tokens!));
        res = calculatePostfix(tokens);
    } catch (error) {
        console.log(error.message);
    }
    return res!;
}

console.log(calc("+ 3 4"));
console.log(calc("* 7 (- 5 6) "));
console.log(calc("* (* 1 - 0 1) 2"));

export {};