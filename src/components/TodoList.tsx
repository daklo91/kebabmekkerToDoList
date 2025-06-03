import TodoItem from "./TodoItem";
import type { Customer, TodoListTemplate, TodoItem as ITodoItem } from "../types";

type Props = {
    template: TodoListTemplate;
    customer: Customer;
    updateCustomer: (customer: Customer) => void;
    updateTemplate: (template: TodoListTemplate) => void;
    onCompleteCustomer: () => void; // new
  };

function TodoList({ template, customer, updateCustomer, updateTemplate, onCompleteCustomer }: Props) {
  const toggleChecked = (itemId: string) => {
    const prev = customer.checklist.checked[itemId] || false;
    const newChecked = {
      ...customer.checklist.checked,
      [itemId]: !prev,
    };
    updateCustomer({
      ...customer,
      checklist: {
        ...customer.checklist,
        checked: newChecked,
      },
    });
  };

  const updateText = (itemId: string, text: string) => {
    const newItems = template.items.map(item =>
      item.id === itemId ? { ...item, text } : item
    );
    updateTemplate({ ...template, items: newItems });
  };

  const deleteItem = (itemId: string) => {
    const newItems = template.items.filter(item => item.id !== itemId);
    updateTemplate({ ...template, items: newItems });

    // Also remove from checked
    const newChecked = { ...customer.checklist.checked };
    delete newChecked[itemId];
    updateCustomer({
      ...customer,
      checklist: {
        ...customer.checklist,
        checked: newChecked,
      },
    });
  };

  const addItem = () => {
    const id = crypto.randomUUID();
    const newItem: ITodoItem = { id, text: "" };
    updateTemplate({ ...template, items: [...template.items, newItem] });
  };

  const resetChecked = () => {
    updateCustomer({
      ...customer,
      checklist: {
        ...customer.checklist,
        checked: {},
      },
    });
  };

  return (
    <div>
      <h2>{template.name}</h2>
      <ul>
        {template.items.map(item => (
          <TodoItem
            key={item.id}
            item={item}
            checked={!!customer.checklist.checked[item.id]}
            onToggle={() => toggleChecked(item.id)}
            onTextChange={(text) => updateText(item.id, text)}
            onDelete={() => deleteItem(item.id)}
          />
        ))}
      </ul>
      <div className="mt-4 space-x-2">
        <button onClick={addItem}>Legg til ny</button>
        <button onClick={onCompleteCustomer}>Kunde Ferdig</button>
      </div>
    </div>
  );
}

export default TodoList;
