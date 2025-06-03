import { useEffect, useState } from "react";
import type {
  AppData,
  Customer,
  CustomerId,
  TemplateId,
} from "./types";
import TodoList from "./components/TodoList";
import CustomerTabs from "./components/CustomerTabs";
import DishTabs from "./components/DishTabs";

const LOCAL_KEY = "appData";

function createInitialData(): AppData {
  return {
    templates: [
      {
        id: "kebab",
        name: "Kebab",
        items: [
          { id: "item-1", text: "Kebabkjøtt" },
          { id: "item-2", text: "Salat" },
          { id: "item-3", text: "Dressing" },
        ],
      },
    ],
    customers: [
      {
        id: "cust1",
        name: "Customer 1",
        checklist: {
          listId: "kebab",
          checked: {},
        },
      },
    ],
  };
}

function App() {
  const [data, setData] = useState<AppData>(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        /* fall through */
      }
    }
    const fresh = createInitialData();
    localStorage.setItem(LOCAL_KEY, JSON.stringify(fresh));
    return fresh;
  });

  const [selectedCustomerId, setSelectedCustomerId] = useState<CustomerId>(
    () => data.customers[0]?.id ?? ""
  );

  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId>(
    () => data.customers[0]?.checklist.listId ?? data.templates[0]?.id ?? ""
  );

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
  }, [data]);

  const handleSelectCustomer = (id: CustomerId) => {
    setSelectedCustomerId(id);
    const cust = data.customers.find(c => c.id === id);
    if (cust) {
      setSelectedTemplateId(cust.checklist.listId);
    }
  };

  const selectedCustomer = data.customers.find(c => c.id === selectedCustomerId);
  const selectedTemplate = data.templates.find(t => t.id === selectedTemplateId);

  const updateCustomer = (updated: Customer) => {
    const customers = data.customers.map(c =>
      c.id === updated.id ? updated : c
    );
    setData({ ...data, customers });
  };

  const updateTemplate = (updated: AppData["templates"][number]) => {
    const templates = data.templates.map(t =>
      t.id === updated.id ? updated : t
    );
    setData({ ...data, templates });
  };

  const addCustomer = () => {
    const id = crypto.randomUUID();
    const name = `Customer ${data.customers.length + 1}`;
    const listId = selectedTemplateId || data.templates[0].id;

    const newCustomer: Customer = {
      id,
      name,
      checklist: {
        listId,
        checked: {},
      },
    };

    const newData = { ...data, customers: [...data.customers, newCustomer] };
    setData(newData);
    handleSelectCustomer(id);
  };

  const removeCustomer = (id: CustomerId) => {
    if (data.customers.length <= 1) {
      alert("Kan ikke fjerne siste kunde.");
      return;
    }
    const remaining = data.customers.filter(c => c.id !== id);
    setData({ ...data, customers: remaining });
    const next = remaining[0];
    handleSelectCustomer(next.id);
  };

  const completeCustomer = () => {
    removeCustomer(selectedCustomerId);
  };

  const addTemplate = (name: string) => {
    const id = crypto.randomUUID();
    const newTemplate = { id, name, items: [] };
    setData({ ...data, templates: [...data.templates, newTemplate] });
    setSelectedTemplateId(id);
  };

  const renameTemplate = (id: TemplateId, name: string) => {
    const updated = data.templates.map(t =>
      t.id === id ? { ...t, name } : t
    );
    setData({ ...data, templates: updated });
  };

  const removeTemplate = (id: TemplateId) => {
    if (data.templates.length <= 1) {
      alert("Kan ikke fjerne siste rett.");
      return;
    }

    const customers = data.customers.filter(c => c.checklist.listId !== id);
    const templates = data.templates.filter(t => t.id !== id);

    setData({ customers, templates });

    if (selectedTemplateId === id) {
      setSelectedTemplateId(templates[0].id);
    }

    if (!customers.find(c => c.id === selectedCustomerId)) {
      handleSelectCustomer(customers[0].id);
    }
  };

  if (!selectedCustomer || !selectedTemplate) {
    return <div>Missing data.</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <CustomerTabs
        customers={data.customers}
        selectedId={selectedCustomerId}
        onSelect={handleSelectCustomer}
        onAdd={addCustomer}
        onRemove={removeCustomer}
      />

      <DishTabs
        templates={data.templates}
        selectedId={selectedTemplateId}
        onSelect={setSelectedTemplateId}
        onAdd={addTemplate}
        onRemove={removeTemplate}
        onRename={renameTemplate}
      />

      <TodoList
        template={selectedTemplate}
        customer={selectedCustomer}
        updateCustomer={updateCustomer}
        updateTemplate={updateTemplate}
        onCompleteCustomer={completeCustomer}
      />
    </div>
  );
}

export default App;
