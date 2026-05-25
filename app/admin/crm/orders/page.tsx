import { OrdersManager } from "@/components/crm/orders-manager";
import { listOrders } from "@/lib/crm/service";

export default async function OrdersPage() {
  return (
    <div data-admin-page>
      <OrdersManager initialOrders={await listOrders()} />
    </div>
  );
}
