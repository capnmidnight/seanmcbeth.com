#include "Calculator.h"

namespace stm
{
    int why = 5;

    const double Calculator::Calculate(const double x, const char op, const double y) const
    {
        switch (op)
        {
        case '+':
            return x + y;
        case '-':
            return x - y;
        case '*':
            return x * y;
        case '/':
            return x / y;
        default:
            return 0.0;
        }
    }
}