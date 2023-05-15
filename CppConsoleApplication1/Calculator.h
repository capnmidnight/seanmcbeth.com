#pragma once

namespace stm
{
    extern int why;

    class Calculator
    {
    public:
        const double Calculate(const double x, const char op, const double y) const;
    };

    extern constexpr double calc(const double x, const char op, const double y)
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