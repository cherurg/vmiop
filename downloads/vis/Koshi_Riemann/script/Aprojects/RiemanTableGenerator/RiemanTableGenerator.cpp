#include<fstream>

using namespace std;

ofstream fout("RiemanTable.js");

const int N = 400;

bool Eratosphen[N];



int gcd(int a,int b)
{

	if(a < b)
	{
		return gcd(b,a);
	}
	if(a!= 0 &&  b!=0)
	{
		return gcd(a%b,b);
	}
	return a+b;
}


int main()
{
    fout << "var Eratosphen = [ 1, 2";
    Eratosphen[0] = true;
    Eratosphen[1] = true;
    Eratosphen[2] = true;
    for(int i = 3; i < N; ++ i)
    {
        Eratosphen[i] = false;
        int j;
        for(j = 2; j < i & (i%j != 0); ++j);
        if(j == i)
        {
            fout << ", "<<i;
            Eratosphen[i] = true;
        }
    }
    fout<< " ];"<<endl;
    fout << "var RiemanTable = [ [], [], ";
    fout << "[0.5]";
    for(int i = 3; i <= N; ++i)
    {
        if(Eratosphen[i])
        {
            fout << ", []";
        }
        else{
            fout << ", [ "<<(double)1/(double)i;
            for(int j = 2; j < i; ++j)
            {
                if(gcd(i,j) == 1)
                {
                    fout<<", "<<(double)j/(double)i;
                }
            }
            fout<<" ]";
        }
    }
    fout << " ];";
    return 0;
}
