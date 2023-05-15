#include "Calculator.h"

namespace stm
{
    int why = 5;

    const double Calculator::Calculate(const double x, const char op, const double y) const
    {
        return calc(x, op, y);
    }
}