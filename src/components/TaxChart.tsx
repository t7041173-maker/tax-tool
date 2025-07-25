import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const taxBreakdownData = [
  { name: 'Income Tax', value: 45000, color: '#8b5cf6' },
  { name: 'Health & Education Cess', value: 1800, color: '#06b6d4' },
  { name: 'Net Income After Tax', value: 653200, color: '#10b981' }
];

const deductionsData = [
  { name: '80C (EPF, ELSS)', value: 150000, color: '#0070ba' },
  { name: '80D (Health Ins.)', value: 25000, color: '#003087' },
  { name: 'Home Loan Interest', value: 200000, color: '#00a0e6' },
  { name: 'HRA', value: 240000, color: '#0099cc' },
  { name: 'Standard Deduction', value: 50000, color: '#66b3ff' }
];

const yearlyComparisonData = [
  { year: '2020-21', oldRegime: 195000, newRegime: 210000 },
  { year: '2021-22', oldRegime: 205000, newRegime: 215000 },
  { year: '2022-23', oldRegime: 165000, newRegime: 180000 },
  { year: '2023-24', oldRegime: 187200, newRegime: 198500 },
  { year: '2024-25', oldRegime: 187200, newRegime: 198500 }
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

// Custom tooltip for better value display
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
        <p className="font-semibold">{data.name}</p>
        <p className="text-primary">₹{data.value.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">
          {((data.value / taxBreakdownData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

export const TaxChart = () => {
  return (
    <Tabs defaultValue="breakdown" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="breakdown">Tax Breakdown</TabsTrigger>
        <TabsTrigger value="deductions">Deductions</TabsTrigger>
        <TabsTrigger value="comparison">Year Comparison</TabsTrigger>
      </TabsList>

      <TabsContent value="breakdown" className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4 text-center">Tax Breakdown Chart</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taxBreakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taxBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Tax Summary with Dynamic Labels</h3>
            <div className="space-y-4">
              {taxBreakdownData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">₹{item.value.toLocaleString()}</span>
                    <p className="text-xs text-muted-foreground">
                      {((item.value / taxBreakdownData.reduce((sum, i) => sum + i.value, 0)) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-border">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Annual Income:</span>
                  <span>₹7,00,000</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="deductions" className="mt-6">
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-center">Available Deductions</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={deductionsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={12}
              />
              <YAxis 
                tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`}
              />
              <Tooltip 
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                labelStyle={{ color: '#333' }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {deductionsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-success-light">
              <p className="font-semibold text-success">Total Deductions</p>
              <p className="text-2xl font-bold text-success">₹6,65,000</p>
            </div>
            <div className="p-4 rounded-lg bg-primary-light">
              <p className="font-semibold text-primary">Tax Savings</p>
              <p className="text-2xl font-bold text-primary">₹1,99,500</p>
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="comparison" className="mt-6">
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-center">5-Year Tax Comparison</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={yearlyComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
              <Tooltip 
                formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                labelStyle={{ color: '#333' }}
              />
              <Legend />
              <Bar 
                dataKey="oldRegime" 
                fill="#0070ba" 
                name="Old Regime"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="newRegime" 
                fill="#003087" 
                name="New Regime"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-6 p-4 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm text-muted-foreground">Average Old Regime</p>
                <p className="font-bold text-primary">₹1,87,880</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <p className="text-sm text-muted-foreground">Average New Regime</p>
                <p className="font-bold text-primary">₹2,00,400</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <p className="text-sm text-muted-foreground">5-Year Savings</p>
                <p className="font-bold text-success">₹62,600</p>
              </div>
            </div>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
};