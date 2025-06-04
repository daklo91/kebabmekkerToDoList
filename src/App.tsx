import { useEffect, useState } from "react";
import type { AppData, Order, OrderId, Template } from "./types";
import OrderTabs from "./components/OrderTabs";
import TodoList from "./components/TodoList";
import TemplatePickerModal from "./components/TemplatePickerModal";
import TemplateManager from "./components/TemplateManager";

const LOCAL_KEY = "appData";

function createInitialData(): AppData {
  return {
    templates: [
      {
        id: "kebab",
        name: "Kebab",
        requiredItems: [
          { id: "item-1", text: "Kebabkjøtt", price: 30 },
          { id: "item-2", text: "Salat" },
          { id: "item-3", text: "Dressing" },
        ],
        optionalItems: [
          { id: "opt-1", text: "Ekstra kjøtt", price: 15 },
          { id: "opt-2", text: "Sterk saus" },
        ],
      },
      {
        id: "falaffel",
        name: "Falaffel",
        requiredItems: [
          { id: "item-1", text: "Kebabkjøtt", price: 30 },
          { id: "item-2", text: "Salat" },
          { id: "item-3", text: "Dressing" },
        ],
        optionalItems: [
          { id: "opt-1", text: "Ekstra kjøtt", price: 15 },
          { id: "opt-2", text: "Sterk saus" },
        ],
      },
    ],
    orders: [],
  };
}

function App() {
  const [data, setData] = useState<AppData>(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // fallback to initial
      }
    }
    const fresh = createInitialData();
    localStorage.setItem(LOCAL_KEY, JSON.stringify(fresh));
    return fresh;
  });
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<OrderId | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
  data.templates[0]?.id ?? null
  );
  const [showManager, setShowManager] = useState(false);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
  }, [data]);

  const selectedOrder = data.orders.find(o => o.id === selectedOrderId) ?? null;
  const selectedTemplate: Template | null =
    selectedOrder ? data.templates.find(t => t.id === selectedOrder.templateId) ?? null : null;

  const createOrderFromTemplate = (template: Template) => {
    const id = crypto.randomUUID();
    const name = `Order ${data.orders.length + 1}`;
    const items = template.requiredItems.map(item => ({
      id: item.id,
      text: item.text,
      price: item.price,
      checked: false,
    }));
    const newOrder: Order = {
      id,
      templateId: template.id,
      name,
      items,
    };
    const updatedOrders = [...data.orders, newOrder];
    setData({ ...data, orders: updatedOrders });
    setSelectedOrderId(id);
  };

  const updateOrder = (updated: Order) => {
    const updatedOrders = data.orders.map(o =>
      o.id === updated.id ? updated : o
    );
    setData({ ...data, orders: updatedOrders });
  };

  const removeOrder = (id: OrderId) => {
    const remaining = data.orders.filter(o => o.id !== id);
    setData({ ...data, orders: remaining });
    if (selectedOrderId === id) {
      setSelectedOrderId(remaining[0]?.id ?? null);
    }
  };

  const updateTemplate = (updated: Template) => {
  const updatedTemplates = data.templates.map(t =>
    t.id === updated.id ? updated : t
  );
  setData({ ...data, templates: updatedTemplates });
};

const createTemplate = () => {
  const newTemplate: Template = {
    id: crypto.randomUUID(),
    name: "Ny rett",
    basePrice: 0,
    requiredItems: [],
    optionalItems: [],
  };

  const updated = [...data.templates, newTemplate];
  setData({ ...data, templates: updated });
  setSelectedTemplateId(newTemplate.id);
};


const deleteTemplate = (id: string) => {
  const remainingTemplates = data.templates.filter(t => t.id !== id);
  const remainingOrders = data.orders.filter(o => o.templateId !== id);

  setData({
    templates: remainingTemplates,
    orders: remainingOrders,
  });

  if (selectedTemplateId === id) {
    setSelectedTemplateId(remainingTemplates[0]?.id ?? null);
  }
};


  return (
  <div className="p-4 space-y-4 flex items-center justify-center h-screen">
    <div>
      <OrderTabs
      orders={data.orders}
      selectedId={selectedOrderId}
      onSelect={setSelectedOrderId}
      onAdd={() => setShowTemplateModal(true)}
      onRemove={removeOrder}
    />

    {selectedOrder && selectedTemplate && (
      <TodoList
        order={selectedOrder}
        updateOrder={updateOrder}
        template={selectedTemplate}
        onCompleteOrder={() => removeOrder(selectedOrder.id)}
      />
    )}

    {showTemplateModal && (
      <TemplatePickerModal
        templates={data.templates}
        onClose={() => setShowTemplateModal(false)}
        onSelect={(template) => {
          createOrderFromTemplate(template);
          setShowTemplateModal(false);
        }}
      />
    )}

    {showManager && (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-xl max-h-screen overflow-y-auto">
          <TemplateManager
            templates={data.templates}
            selectedTemplateId={selectedTemplateId}
            setSelectedTemplateId={setSelectedTemplateId}
            updateTemplate={updateTemplate}
            deleteTemplate={deleteTemplate}
            createTemplate={createTemplate}
          />
          <div className="text-right mt-4">
            <button onClick={() => setShowManager(false)}>Lukk</button>
          </div>
        </div>
      </div>
    )}

    <button className="absolute top-0 right-0 mt-5 mr-5 bg-primary-color" onClick={() => setShowManager(true)}>⚙️ Rediger maler</button>
    </div>
  </div>
  );
}

export default App;
