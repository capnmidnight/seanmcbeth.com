#include "Calculator.h"

namespace stm
{
    int why = 5;

    double Calculator::Calculate(double x, char op, double y) const
    {
        return calc(x, op, y);
    }

    double dublit(double x)
    {
        return 2 * x;
    }
}