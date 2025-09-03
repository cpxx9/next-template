import Charts from "@/app/admin/overview/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUserCount } from "@/lib/actions/user.actions";
import { requireAdmin } from "@/lib/auth-guard";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/utils";
import { BadgeDollarSign, Barcode, CreditCard, Users } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

const AdminOverviewPage = async () => {
  await requireAdmin();
  const { userCount } = await getUserCount();

  return (
    <div className="space-y-2">
      <h1 className="h2-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(userCount || 0)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
