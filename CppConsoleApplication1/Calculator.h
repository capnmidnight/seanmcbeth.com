#pragma once

namespace stm
{
    extern int why;

    class Calculator
    {
    public:
        double Calculate(double x, char op, double y) const;
    };

    template<typename NumberT>
    extern constexpr NumberT calc(const NumberT& x, const char& op, const NumberT& y)
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
            return 0;
        }
    }

    double dublit(double x);
}