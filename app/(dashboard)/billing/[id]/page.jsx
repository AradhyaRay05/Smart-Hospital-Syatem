"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getBillById, markBillPaid } from "@/actions/billing";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FormSelect } from "@/components/shared/form-select";
import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2, Printer, CheckCircle } from "lucide-react";

export default function BillDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payMethod, setPayMethod] = useState("CASH");

  useEffect(() => {
    getBillById(params.id).then((result) => {
      if (result.success) setBill(result.data);
      else { toast.error(result.message); router.push("/billing"); }
      setLoading(false);
    });
  }, [params.id]);

  const handleMarkPaid = async () => {
    const result = await markBillPaid(params.id, payMethod);
    if (result.success) {
      toast.success(result.message);
      setBill({ ...bill, paymentStatus: "PAID", paymentMethod: payMethod });
    } else { toast.error(result.message); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  if (!bill) return null;

  return (
    <div>
      <PageHeader title="Invoice" description={`Invoice #${bill.id.slice(0, 8)}`} breadcrumbs={[{ label: "Billing", href: "/billing" }, { label: "Invoice" }]}>
        <Button onClick={() => window.print()}><Printer className="mr-2 size-4" />Print</Button>
      </PageHeader>

      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Hospital Invoice</CardTitle>
              <p className="text-sm text-muted-foreground">Date: {format(new Date(bill.createdAt), "MMMM dd, yyyy")}</p>
            </div>
            <Badge variant={bill.paymentStatus === "PAID" ? "default" : "secondary"} className="text-sm">
              {bill.paymentStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Patient</p>
              <p className="font-medium">{bill.patient.firstName} {bill.patient.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Doctor</p>
              <p className="font-medium">Dr. {bill.appointment?.doctor?.user?.firstName} {bill.appointment?.doctor?.user?.lastName}</p>
              <p className="text-xs text-muted-foreground">{bill.appointment?.doctor?.department?.name}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-muted-foreground">Consultation Fee</span><span className="font-medium">${bill.consultationFee.toFixed(2)}</span></div>
            {bill.additionalCharges > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Additional Charges</span><span className="font-medium">${bill.additionalCharges.toFixed(2)}</span></div>}
            {bill.discount > 0 && <div className="flex justify-between"><span className="text-green-600">Discount</span><span className="font-medium text-green-600">-${bill.discount.toFixed(2)}</span></div>}
            <Separator />
            <div className="flex justify-between text-lg"><span className="font-bold">Total</span><span className="font-bold">${bill.totalAmount.toFixed(2)}</span></div>
          </div>

          {bill.paymentStatus === "PAID" && (
            <><Separator /><div className="flex justify-between"><span className="text-muted-foreground">Payment Method</span><span className="font-medium">{bill.paymentMethod}</span></div></>
          )}

          {bill.paymentStatus === "PENDING" && (
            <><Separator />
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <FormSelect
                    options={[{ value: "CASH", label: "Cash" }, { value: "CARD", label: "Card" }, { value: "UPI", label: "UPI" }]}
                    onValueChange={setPayMethod}
                    placeholder="Payment method"
                  />
                </div>
                <Button onClick={handleMarkPaid}><CheckCircle className="mr-2 size-4" />Mark as Paid</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
