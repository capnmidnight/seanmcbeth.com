#include <iostream>
#include <vector>

using namespace std;

constexpr char const* names[] = {
    "Dave",
    "Mark",
    "Charles"
};

int main()
{
    for (auto& name : names)
    {
        cout << "Hello " << name << "!" << endl;
    }
}