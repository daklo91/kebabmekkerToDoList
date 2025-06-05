import OptionalModal from "./OptionalModal";
import type { Order, Template, TemplateItem } from "../types";
import { useState } from "react";

type Props = {
  order: Order;
  updateOrder: (order: Order) => void;
  template?: Template;
  onCompleteOrder: () => void;
};

function TodoList({ order, updateOrder, template, onCompleteOrder }: Props) {
  const [showModal, setShowModal] = useState(false);

  const toggleChecked = (itemId: string) => {
    const updatedItems = order.items.map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    updateOrder({ ...order, items: updatedItems });
  };

  const totalPrice =
    (template?.basePrice ?? 0) +
    order.items.reduce((sum, item) => {
      const isOptional = template?.optionalItems.some(
        (opt) => opt.id === item.id
      );
      return sum + (isOptional ? item.price ?? 0 : 0);
    }, 0);

  const alreadyAdded = order.items.map((i) => i.id);

  const handleAddExtras = (selected: TemplateItem[]) => {
    const newItems = selected.map((item) => ({
      id: item.id,
      text: item.text,
      price: item.price,
      checked: false,
    }));
    updateOrder({ ...order, items: [...order.items, ...newItems] });
    setShowModal(false);
  };

  const removeItem = (id: string) => {
    const updatedItems = order.items.filter((item) => item.id !== id);
    updateOrder({ ...order, items: updatedItems });
  };

  return (
    <div className="bg-primary p-5 rounded-xl">
      <div className="text-2xl font-bold text-text-color">
        {template?.name}{" "}
        <span className="text-lg text-amber-100">
          ({template?.basePrice} kr)
        </span>
      </div>
      <ul>
        {order.items.map((item) => {
          const isOptional = template?.optionalItems.some(
            (opt) => opt.id === item.id
          );

          return (
            <li
              key={item.id}
              className="flex items-center space-x-2 mb-2 text-text-color"
            >
              <div
                onClick={() => toggleChecked(item.id)}
                className="cursor-pointer select-none"
              >
                {item.checked ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="oklch(96.2% 0.059 95.617)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-square-check-big"
                  >
                    <path d="M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="oklch(96.2% 0.059 95.617)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-square"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                  </svg>
                )}
              </div>
              <span className={`${item.checked ? "line-through" : ""}`}>
                {item.text}
              </span>
              {item.price !== undefined && (
                <span className="text-sm text-amber-100">
                  ({item.price} kr)
                </span>
              )}
              {isOptional && (
                <button
                  className="cursor-pointer"
                  onClick={() => removeItem(item.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-circle-x-icon lucide-circle-x"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="m15 9-6 6" />
                    <path d="m9 9 6 6" />
                  </svg>
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-4 font-bold text-white">
        Totalt: <span className="text-amber-100">{totalPrice} kr</span>
      </div>

      <div className="mt-4 bg-secondary w-fit hover:bg-secondary-dark text-text-color py-2 px-4 rounded-lg border-[1px] border-primary-dark bg-primary-color flex gap-2 items-center">
        <button
          className="flex gap-2 items-center"
          onClick={() => setShowModal(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="mt-[2px] lucide lucide-plus-icon lucide-plus"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Legg til ekstra
        </button>
      </div>

      {showModal && template && (
        <OptionalModal
          optionalItems={template.optionalItems}
          alreadyAddedIds={alreadyAdded}
          onConfirm={handleAddExtras}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="mt-4 font-bold w-full bg-lime-700 hover:bg-lime-600 text-text-color text-2xl py-2 px-4 rounded-lg border-[1px] border-primary-dark bg-primary-color flex gap-2 items-center">
        <button className="m-auto" onClick={onCompleteOrder}>
          Ordre ferdig
        </button>
      </div>
    </div>
  );
}

export default TodoList;
