#include <iostream>
#include "Calculator.h"

using namespace std;
using namespace stm;

int main()
{
    atexit([] {
        cout << "All done!" << endl;
    });

    Calculator c;
    double x, y, result;
    char op;

    cout << "Calculator!!!" << endl;
    cin >> x >> op >> y;
    result = c.Calculate(x, op, y);
    cout << "Result: " << x << op << y << " = " << result << endl;

    return 0;
}