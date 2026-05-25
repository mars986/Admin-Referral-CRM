"use client";

import { useState } from "react";
import type { OrderRecord } from "@/lib/crm/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/crm/status-badge";
import { formatDate } from "@/lib/utils";

export function OrdersManager({ initialOrders }: { initialOrders: OrderRecord[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [draft, setDraft] = useState({
    email: "",
    product_name: "",
    subtotal: "0",
    total: "0",
  });

  async function createOrder() {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...draft,
        status: "Pending",
        payment_status: "Pending",
      }),
    });
    const payload = (await response.json()) as { data?: OrderRecord };
    if (payload?.data) {
      const nextOrder = payload.data;
      setOrders((current) => [nextOrder, ...current]);
      setDraft({ email: "", product_name: "", subtotal: "0", total: "0" });
    }
  }

  async function saveShipment(order: OrderRecord) {
    const response = await fetch(`/api/orders/${order.id}/shipment`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    const payload = (await response.json()) as { data?: OrderRecord };
    if (payload?.data) {
      const nextOrder = payload.data;
      setOrders((current) => current.map((item) => (item.id === order.id ? nextOrder : item)));
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Order</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <Input placeholder="Customer email" value={draft.email} onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))} />
          <Input placeholder="Product name" value={draft.product_name} onChange={(event) => setDraft((current) => ({ ...current, product_name: event.target.value }))} />
          <Input placeholder="Subtotal" value={draft.subtotal} onChange={(event) => setDraft((current) => ({ ...current, subtotal: event.target.value }))} />
          <Input placeholder="Total" value={draft.total} onChange={(event) => setDraft((current) => ({ ...current, total: event.target.value }))} />
          <div className="md:col-span-4">
            <Button onClick={createOrder}>Create Order</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tracking</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead className="text-right">Save</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <p className="font-semibold text-white">{order.product_name}</p>
                      <p className="text-xs text-slate-400">{order.email}</p>
                    </TableCell>
                    <TableCell>
                      <StatusBadge value={order.status} />
                    </TableCell>
                    <TableCell>
                      <div className="grid gap-2">
                        <Input
                          value={order.tracking_number ?? ""}
                          placeholder="Tracking number"
                          onChange={(event) =>
                            setOrders((current) =>
                              current.map((item) =>
                                item.id === order.id ? { ...item, tracking_number: event.target.value } : item,
                              ),
                            )
                          }
                        />
                        <Input
                          value={order.tracking_url ?? ""}
                          placeholder="Tracking URL"
                          onChange={(event) =>
                            setOrders((current) =>
                              current.map((item) =>
                                item.id === order.id ? { ...item, tracking_url: event.target.value } : item,
                              ),
                            )
                          }
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-400">
                      <p>Created: {formatDate(order.created_at)}</p>
                      <p>Shipped: {formatDate(order.shipped_at)}</p>
                      <p>Delivered: {formatDate(order.delivered_at)}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => void saveShipment(order)}>Save</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
