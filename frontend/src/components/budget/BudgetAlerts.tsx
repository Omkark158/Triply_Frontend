import React from 'react';
import { Budget } from '../../context/TripContext';
import { AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

interface BudgetAlertsProps {
  budget: Budget;
}

export const BudgetAlerts: React.FC<BudgetAlertsProps> = ({ budget }) => {
  const percentSpent = (budget.spent_amount / budget.total_budget) * 100;
  const currencySymbol = budget.currency === 'USD' ? '$' : '₹';

  const alerts = [];

  // Critical alert - over 90%
  if (percentSpent > 90) {
    alerts.push({
      type: 'danger',
      icon: AlertTriangle,
      title: 'Budget Critical!',
      message: `You've spent ${percentSpent.toFixed(1)}% of your budget. Only ${currencySymbol}${budget.remaining_amount.toFixed(2)} remaining.`,
      color: 'red',
    });
  }
  // Warning alert - over 75%
  else if (percentSpent > 75) {
    alerts.push({
      type: 'warning',
      icon: TrendingUp,
      title: 'Budget Warning',
      message: `You've spent ${percentSpent.toFixed(1)}% of your budget. Consider monitoring your expenses.`,
      color: 'orange',
    });
  }
  // Success - under 50%
  else if (percentSpent < 50) {
    alerts.push({
      type: 'success',
      icon: CheckCircle,
      title: 'On Track!',
      message: `You're doing great! Only ${percentSpent.toFixed(1)}% of budget spent.`,
      color: 'green',
    });
  }

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert, idx) => {
        const Icon = alert.icon;
        return (
          <div
            key={idx}
            className={`bg-${alert.color}-50 border border-${alert.color}-200 rounded-lg p-4 flex items-start gap-3`}
          >
            <Icon className={`text-${alert.color}-600 flex-shrink-0 mt-0.5`} size={24} />
            <div>
              <h3 className={`font-semibold text-${alert.color}-900`}>{alert.title}</h3>
              <p className={`text-sm text-${alert.color}-800 mt-1`}>{alert.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BudgetAlerts;