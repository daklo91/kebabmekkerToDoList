import type { CustomerId, Customer } from "../types";

type Props = {
  customers: Customer[];
  selectedId: CustomerId;
  onSelect: (id: CustomerId) => void;
  onAdd: () => void;
  onRemove: (id: CustomerId) => void;
};

function CustomerTabs({ customers, selectedId, onSelect, onAdd, onRemove }: Props) {
  return (
    <div className="flex space-x-2 mb-4">
      {customers.map((customer) => (
        <div key={customer.id} className="flex items-center space-x-1">
          <button
            onClick={() => onSelect(customer.id)}
            className={customer.id === selectedId ? "font-bold underline" : ""}
          >
            {customer.name}
          </button>
          {customers.length > 1 && (
            <button onClick={() => onRemove(customer.id)}>❌</button>
          )}
        </div>
      ))}
      <button onClick={onAdd}>➕ Add Customer</button>
    </div>
  );
}

export default CustomerTabs;
