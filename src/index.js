function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    let arr = split(expr);
    let reversePolishNotation = [];
    let stack = [];
    let priority = {
        '^': 3,
        '*': 2,
        '/': 2,
        '+': 1,
        '-': 1,
    };

    arr.forEach(element => {
        let number = parseFloat(element);

        if(isNaN(number) === false) {
            reversePolishNotation.push(number);
        }
        else {
            if(element === ')') {
                let prevElement = stack.pop();

                while(prevElement !== '(' && stack.length) {
                    reversePolishNotation.push(prevElement);
                    prevElement = stack.pop();
                }
                
                if(prevElement !== '(') {
                    throw Error('ExpressionError: Brackets must be paired');
                }
            }
            else {
                while( stack.length && priority[element] <= priority[stack[stack.length - 1]]) {
                    reversePolishNotation.push(stack.pop());
                }

                stack.push(element);
            }
        }
    });

    while(stack.length) {
        let element = stack.pop();
        if(element === '(') {
            throw Error('ExpressionError: Brackets must be paired');
        }

        reversePolishNotation.push(element);
    }

    return calculateReversePolishNotation(reversePolishNotation);
}

function calculateReversePolishNotation(arr) {
    let operators = {
        '*': (x, y) => x * y,
        '/': (x, y) => { if(y) { return x / y; } throw TypeError('TypeError: Division by zero.');},
        '+': (x, y) => x + y,
        '-': (x, y) => x - y,
        '^': (x, y) => Math.pow(x, y)
    };

    let stack = [];
    arr.forEach((element) => {
        if(operators[element]) {
            [y, x] = [stack.pop(), stack.pop()];
            stack.push(operators[element](x, y));
        }
        else {
            stack.push(element);
        }
    });

    return stack.pop();
}

function split(str) {
    let isPrevSymbolOperator = false;
    let arr = str.trim().replace(/\s/g, '').split('');
    let resultArr = arr.reduce((acc, element, index) => {
        if(/[\/\*\-\+\^\(\)]/.test(element)) {
            isPrevSymbolOperator = true;

            if(index === 0) {
                acc.pop();
            }

            acc.push(element);
        }
        else {
            if(isPrevSymbolOperator) {
                acc.push(element);
            }
            else {
                acc[acc.length - 1] = acc[acc.length - 1] + element;
            }

            isPrevSymbolOperator = false;
        }
            return acc;
    }, ['']);

    return resultArr;
}

module.exports = {
    expressionCalculator
}