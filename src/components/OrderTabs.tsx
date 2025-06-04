import type { Order, OrderId } from "../types";

type Props = {
  orders: Order[];
  selectedId: OrderId | null;
  onSelect: (id: OrderId) => void;
  onAdd: () => void;
  onRemove: (id: OrderId) => void;
};

function OrderTabs({ orders, selectedId, onSelect, onAdd, onRemove }: Props) {
  return (
    <div className="flex space-x-2 mb-4">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center space-x-1">
          <button
            onClick={() => onSelect(order.id)}
            className={order.id === selectedId ? "font-bold underline" : ""}
          >
            {order.name}
          </button>
          <button onClick={() => onRemove(order.id)}>❌</button>
        </div>
      ))}
      <button onClick={onAdd}>➕ Ny ordre</button>
    </div>
  );
}

export default OrderTabs;
