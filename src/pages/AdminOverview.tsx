import { Card } from "@/components/ui/card";
import { Users, FileText, GitMerge, Database, Activity, CheckCircle } from "lucide-react";

const AdminOverview = () => {
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      subtitle: "Active users",
      icon: Users,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Data Change Requests",
      value: "156",
      subtitle: "Pending approval",
      icon: FileText,
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
    {
      title: "Merge/Match Proposals",
      value: "45",
      subtitle: "Awaiting review",
      icon: GitMerge,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Active Rules",
      value: "28",
      subtitle: "Merge & survivorship",
      icon: Database,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
  ];

  const recentActivity = [
    {
      type: "DCR Approved",
      entity: "Physician Account",
      id: "HCP1001",
      user: "Aditya Jha",
      time: "2 hours ago",
      icon: CheckCircle,
      iconColor: "text-green-600",
    },
    {
      type: "Rule Created",
      entity: "Facility Account",
      id: "Rule #3",
      user: "Ujjwal Sirothia",
      time: "5 hours ago",
      icon: Database,
      iconColor: "text-blue-600",
    },
    {
      type: "Match Approved",
      entity: "Physician Accounts",
      id: "HCP1002, HCP2104",
      user: "Vishant",
      time: "1 day ago",
      icon: GitMerge,
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Overview</h1>
        <p className="text-muted-foreground mt-1">
          Manage your MDM system and monitor activities
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="h-5 w-5" />
          <h2 className="text-xl font-bold">Recent Activity</h2>
        </div>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className={`p-2 rounded-lg bg-muted`}>
                <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{activity.type}</p>
                  <span className="text-sm text-muted-foreground">•</span>
                  <p className="text-sm text-muted-foreground">{activity.entity}</p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  ID: {activity.id}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span>By {activity.user}</span>
                  <span>•</span>
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
          <Database className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="font-bold mb-1">Manage Rules</h3>
          <p className="text-sm text-muted-foreground">
            Configure merge/match and survivorship rules
          </p>
        </Card>
        <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
          <FileText className="h-8 w-8 text-yellow-600 mb-4" />
          <h3 className="font-bold mb-1">Review DCRs</h3>
          <p className="text-sm text-muted-foreground">
            Approve or reject data change requests
          </p>
        </Card>
        <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
          <GitMerge className="h-8 w-8 text-purple-600 mb-4" />
          <h3 className="font-bold mb-1">Match Proposals</h3>
          <p className="text-sm text-muted-foreground">
            Review and approve merge/match suggestions
          </p>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
