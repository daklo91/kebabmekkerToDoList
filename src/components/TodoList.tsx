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
    const updatedItems = order.items.map(item =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    updateOrder({ ...order, items: updatedItems });
  };

  const totalPrice =
  (template?.basePrice ?? 0) +
  order.items.reduce((sum, item) => {
    const isOptional = template?.optionalItems.some(opt => opt.id === item.id);
    return sum + (isOptional ? item.price ?? 0 : 0);
  }, 0);

  const alreadyAdded = order.items.map(i => i.id);

  const handleAddExtras = (selected: TemplateItem[]) => {
    const newItems = selected.map(item => ({
      id: item.id,
      text: item.text,
      price: item.price,
      checked: false,
    }));
    updateOrder({ ...order, items: [...order.items, ...newItems] });
    setShowModal(false);
  };

  const removeItem = (id: string) => {
  const updatedItems = order.items.filter(item => item.id !== id);
  updateOrder({ ...order, items: updatedItems });
};

  return (
    <div>
      <div>{template?.name} {template?.basePrice}</div>
      <ul>
  {order.items.map(item => {
    const isOptional = template?.optionalItems.some(opt => opt.id === item.id);

    return (
      <li key={item.id} className="flex items-center space-x-2 mb-2">
        <input
          type="checkbox"
          checked={item.checked}
          onChange={() => toggleChecked(item.id)}
        />
        <span>{item.text}</span>
        {item.price !== undefined && (
          <span className="text-sm text-gray-500">({item.price} kr)</span>
        )}
        {isOptional && (
          <button onClick={() => removeItem(item.id)}>❌</button>
        )}
      </li>
    );
  })}
</ul>


      <div className="mt-4 font-bold">
        Total: {totalPrice} kr
      </div>

      <div className="mt-4">
        <button onClick={() => setShowModal(true)}>
          ➕ Legg til ekstra
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

      <div className="mt-4">
  <button onClick={onCompleteOrder}>✅ Ordre ferdig</button>
</div>
    </div>
  );
}


export default TodoList;
