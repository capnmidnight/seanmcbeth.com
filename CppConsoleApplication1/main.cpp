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
    auto x{ 0.0 },
        y{ 0.0 },
        result{ 0.0 };
    auto op = '\0';

    cout << "Calculator!!!" << why << endl;
    cin >> x >> op >> y;
    result = c.Calculate(x, op, y);
    cout << "Result: " << x << op << y << " = " << result << endl;

    return 0;
}