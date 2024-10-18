const extractTokens = (inputString: string): string[] => {
    const chars = inputString.split('');
    let currentNumber = '';
    let tokens: string[] = [];

    chars.forEach((char, index) => {
        if (/\d/.test(char)) {
            currentNumber += char;
        } else {
            if (currentNumber.length > 0) {
                tokens.push(currentNumber);
                currentNumber = '';
            }
            if (/\s/.test(char)) {
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

const prefixToPostfix = (tokens: string[]): string => {
    let operatorStack: string[] = [];
    let expressionStack: string[] = [];

    tokens = tokens.reverse();

    let index: number = 0;

    tokens.forEach(token => {
        if (Number(token)) {
            expressionStack.push(token);
        } else if (token === ")") {
            operatorStack.push(token);
        } else if (token === "(") {
            let curOper: string = "";
            while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== ")" ) {

                if (expressionStack.length < 2) {
                    throw new Error(`Неправильное выражение: недостаточно операндов для операции на позиции ${tokens.length - index}`);
                }

                curOper = operatorStack.pop()!;
                let operand1 = expressionStack.pop()!;
                let operand2 = expressionStack.pop()!;
                let newExpr = operand1 + " " + operand2 + " " + curOper;
                expressionStack.push(newExpr);
            }

            if (operatorStack.length === 0) {
                throw new Error(`Неправильное выражение: несоответствие скобок на позиции ${tokens.length - index}`);
            }

            operatorStack.pop();
        } else {
            operatorStack.push(token);
        }
    });
    
    while (operatorStack.length > 0) {
        if (expressionStack.length < 2) {
            throw new Error("Неправильное выражение: недостаточно операндов для операции в конце выражения");
        }

        let curOper = operatorStack.pop()!;
        let operand1 = expressionStack.pop()!;
        let operand2 = expressionStack.pop()!;
        let newExpr = operand1 + " " + operand2 + " " + curOper;
        expressionStack.push(newExpr);
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
    let stack: number[] = [];

    tokens.forEach(token => {
        if (Number(token)) {
            stack.push(Number(token));
        } else {
            if (stack.length < 2) {
                throw new Error("Недостаточно операндов!");
            }

            let num2: number = stack.pop()!;
            let num1: number = stack.pop()!;

            try {
                stack.push(executeOperator(num1, num2, token));
            } catch (error) {
                console.log(error);
            }            
        }
    });

    return stack.pop()!;
} 

const calc = (expr: string): number => {
    let res: number;
    let tokens: string[];

    try {
        tokens = extractTokens(expr);
        let postFixExpr: string = prefixToPostfix(tokens!);
        tokens = extractTokens(postFixExpr);
        res = calculatePostfix(tokens);
    } catch (error) {
        console.log(error);
    }
    return res!;
}

console.log(calc("+ 3 4"));
console.log(calc("*(- 5 6) 7"));

export {};