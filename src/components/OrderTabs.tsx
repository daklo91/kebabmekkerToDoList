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
    <div className="flex space-x-2 mb-2">
      {orders.map((order) => (
        <div
          key={order.id}
          className={`${
            order.id === selectedId
              ? "bg-secondary hover:bg-secondary-dark"
              : "bg-primary hover:bg-primary-dark"
          } text-text-color font-bold border-[1px] border-primary-dark rounded-md py-2 px-4 flex items-center space-x-1`}
        >
          <button onClick={() => onSelect(order.id)}>{order.name}</button>
          <button className="" onClick={() => onRemove(order.id)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="mt-[2px] lucide lucide-circle-x-icon lucide-circle-x"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
          </button>
        </div>
      ))}
      <button
        className="bg-primary hover:bg-primary-dark border-[1px] border-primary-dark rounded-full py-2 px-2"
        onClick={onAdd}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="white"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-plus-icon lucide-plus"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
      </button>
    </div>
  );
}

export default OrderTabs;
