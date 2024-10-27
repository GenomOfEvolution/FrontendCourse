"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var extractTokens = function (inputString) {
    var chars = inputString.split('');
    var tokens = [];
    var currentNumber = '';
    chars.forEach(function (char, index) {
        if (/\d/.test(char)) {
            currentNumber += char;
        }
        else {
            if (currentNumber.length > 0) {
                tokens.push(currentNumber);
                currentNumber = '';
            }
            if (char === " ") {
                return;
            }
            if (!/[()*/+\-]/.test(char)) {
                throw new Error("\u041D\u0435\u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u044B\u0439 \u0441\u0438\u043C\u0432\u043E\u043B: ".concat(char, " \u043D\u0430 \u043F\u043E\u0437\u0438\u0446\u0438\u0438 ").concat(index));
            }
            tokens.push(char);
        }
    });
    if (currentNumber.length > 0) {
        tokens.push(currentNumber);
    }
    return tokens;
};
var processOperation = function (operatorStack, expressionStack) {
    var curOper = operatorStack.pop();
    var operand1 = expressionStack.pop();
    var operand2 = expressionStack.pop();
    var newExpr = operand1 + " " + operand2 + " " + curOper;
    expressionStack.push(newExpr);
};
var prefixToPostfix = function (tokens) {
    var operatorStack = [];
    var expressionStack = [];
    tokens = tokens.reverse();
    var index = 0;
    tokens.forEach(function (token) {
        if (!isNaN(parseInt(token))) {
            expressionStack.push(token);
            return;
        }
        if (token === ")") {
            operatorStack.push(token);
            return;
        }
        if (token === "(") {
            var curOper = "";
            while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== ")") {
                if (expressionStack.length < 2) {
                    throw new Error("\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E\u0435 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u0438\u0435: \u043D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u043E\u043F\u0435\u0440\u0430\u043D\u0434\u043E\u0432 \u0434\u043B\u044F \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u0438 \u043D\u0430 \u043F\u043E\u0437\u0438\u0446\u0438\u0438 ".concat(tokens.length - index));
                }
                processOperation(operatorStack, expressionStack);
            }
            if (operatorStack.length === 0) {
                throw new Error("\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E\u0435 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u0438\u0435: \u043D\u0435\u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0438\u0435 \u0441\u043A\u043E\u0431\u043E\u043A \u043D\u0430 \u043F\u043E\u0437\u0438\u0446\u0438\u0438 ".concat(tokens.length - index));
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
    return expressionStack.pop();
};
var executeOperator = function (num1, num2, oper) {
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
};
var calculatePostfix = function (tokens) {
    var stack = [];
    tokens.forEach(function (token) {
        var tokenAsInt = parseInt(token);
        if (!isNaN(tokenAsInt)) {
            stack.push(tokenAsInt);
        }
        else {
            if (stack.length < 2) {
                throw new Error("Недостаточно операндов!");
            }
            var num2 = stack.pop();
            var num1 = stack.pop();
            stack.push(executeOperator(num1, num2, token));
        }
    });
    return stack.pop();
};
var calc = function (expr) {
    var res;
    var tokens;
    try {
        tokens = extractTokens(expr);
        tokens = extractTokens(prefixToPostfix(tokens));
        res = calculatePostfix(tokens);
    }
    catch (error) {
        console.log(error.message);
    }
    return res;
};
console.log(calc("+ 3 4"));
console.log(calc("* 7 (- 5 6) "));
console.log(calc("* (* 1 - 0 1) 2"));
