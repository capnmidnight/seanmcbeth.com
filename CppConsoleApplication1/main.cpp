#include <vector>
#include <iostream>
#include "Calculator.h"

using namespace std;
using namespace stm;

constexpr auto a = 4;
constexpr auto b = 5;
constexpr auto z = calc(a, '+', b);
static_assert(z == 9, "What?");

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

    cout << "Result: " << a << "+" << b << " = " << z << endl;
    cout << "Double it: " << b << " = " << dublit(b) << endl;
    cout << "Calculator!!!" << why << endl;
    cin >> x >> op >> y;
    result = c.Calculate(x, op, y);
    cout << "Result: " << x << op << y << " = " << result << endl;

    return 0;
}