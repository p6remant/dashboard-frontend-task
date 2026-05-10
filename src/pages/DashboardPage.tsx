import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/lib/api';

export default function DashboardPage() {
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: Users,
      description: 'Active users in the system',
    },
    {
      title: 'Avg Salary',
      value: `$${Math.round(users.reduce((sum, u) => sum + u.salary, 0) / users.length || 0).toLocaleString()}`,
      icon: DollarSign,
      description: 'Average employee salary',
    },
    {
      title: 'Active Users',
      value: users.filter((u) => u.active).length,
      icon: Users,
      description: 'Currently active employees',
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold tracking-tight">Welcome to Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}
            className="border-neutral-100 dark:border-neutral-700/70">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
