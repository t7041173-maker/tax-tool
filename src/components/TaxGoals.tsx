import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, Plus } from "lucide-react";

interface TaxGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  category: string;
  deadline: string;
  status: 'on-track' | 'behind' | 'completed';
}

const taxGoals: TaxGoal[] = [
  {
    id: '1',
    title: 'Save ₹50,000 in taxes',
    target: 50000,
    current: 32000,
    category: 'Tax Savings',
    deadline: '31 Mar 2024',
    status: 'on-track'
  },
  {
    id: '2',
    title: 'Maximize 80C deductions',
    target: 150000,
    current: 125000,
    category: 'Investment',
    deadline: '31 Mar 2024',
    status: 'behind'
  },
  {
    id: '3',
    title: 'Health insurance optimization',
    target: 25000,
    current: 25000,
    category: 'Insurance',
    deadline: '31 Dec 2024',
    status: 'completed'
  }
];

export const TaxGoals = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'on-track':
        return 'bg-primary text-primary-foreground';
      case 'behind':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success';
      case 'on-track':
        return 'bg-primary';
      case 'behind':
        return 'bg-warning';
      default:
        return 'bg-muted';
    }
  };

  return (
    <Card className="shadow-elevated">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Tax Goals</h2>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </Button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-6">
          {taxGoals.map((goal) => {
            const progress = (goal.current / goal.target) * 100;
            
            return (
              <div key={goal.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{goal.title}</h3>
                    <p className="text-sm text-muted-foreground">{goal.category}</p>
                  </div>
                  <Badge className={getStatusColor(goal.status)}>
                    {goal.status === 'on-track' ? 'On Track' : 
                     goal.status === 'behind' ? 'Behind' : 'Completed'}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">
                      ₹{goal.current.toLocaleString()} / ₹{goal.target.toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(progress, 100)} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{progress.toFixed(1)}% complete</span>
                    <span>Due: {goal.deadline}</span>
                  </div>
                </div>

                {goal.status !== 'completed' && (
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-primary">
                      {goal.id === '1' ? 'Invest ₹18,000 more in ELSS' :
                       goal.id === '2' ? 'Need ₹25,000 more investment' :
                       'Goal achieved!'}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Goal Insights */}
        <div className="mt-6 p-4 rounded-lg bg-accent/50">
          <h3 className="font-semibold text-accent-foreground mb-3">Smart Insights</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <p>You're on track to save ₹45,000 this year with current investments</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-warning mt-2" />
              <p>Consider increasing PPF contribution by ₹1,000/month to maximize 80C</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-success mt-2" />
              <p>Health insurance goal completed! Consider senior citizen coverage</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button className="w-full mt-6 bg-gradient-primary hover:bg-primary-hover">
          Get Personalized Recommendations
        </Button>
      </div>
    </Card>
  );
};