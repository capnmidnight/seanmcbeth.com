#pragma once

namespace stm
{
    extern int why;

    class Calculator
    {
    public:
        const double Calculate(const double x, const char op, const double y) const;
    };
}