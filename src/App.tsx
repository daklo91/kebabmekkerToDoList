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
        basePrice: 150,
        requiredItems: [
          { id: "item-1", text: "Kebabkjøtt" },
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
        basePrice: 140,
        requiredItems: [
          { id: "item-1", text: "Kebabkjøtt" },
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

  const selectedOrder =
    data.orders.find((o) => o.id === selectedOrderId) ?? null;
  const selectedTemplate: Template | null = selectedOrder
    ? data.templates.find((t) => t.id === selectedOrder.templateId) ?? null
    : null;

  const createOrderFromTemplate = (template: Template) => {
    const id = crypto.randomUUID();
    const name = `Ordre ${data.orders.length + 1}`;
    const items = template.requiredItems.map((item) => ({
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
    const updatedOrders = data.orders.map((o) =>
      o.id === updated.id ? updated : o
    );
    setData({ ...data, orders: updatedOrders });
  };

  const removeOrder = (id: OrderId) => {
    const remaining = data.orders.filter((o) => o.id !== id);
    setData({ ...data, orders: remaining });
    if (selectedOrderId === id) {
      setSelectedOrderId(remaining[0]?.id ?? null);
    }
  };

  const updateTemplate = (updated: Template) => {
    const updatedTemplates = data.templates.map((t) =>
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
    const remainingTemplates = data.templates.filter((t) => t.id !== id);
    const remainingOrders = data.orders.filter((o) => o.templateId !== id);

    setData({
      templates: remainingTemplates,
      orders: remainingOrders,
    });

    if (selectedTemplateId === id) {
      setSelectedTemplateId(remainingTemplates[0]?.id ?? null);
    }
  };

  return (
    <div
      style={{ backgroundImage: `url('/src/assets/kebab.png')` }}
      className="p-4 space-y-4 flex items-center justify-center h-screen"
    >
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
            <div className="bg-primary text-text-color p-6 rounded-xl shadow-xl max-h-screen overflow-y-auto">
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

        <button
          className="bg-secondary hover:bg-secondary-dark text-text-color py-2 px-4 rounded-lg border-[1px] border-primary-dark absolute top-0 right-0 mt-5 mr-5 bg-primary-color flex gap-2 items-center"
          onClick={() => setShowManager(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-settings-icon lucide-settings"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span>Rediger maler</span>
        </button>
      </div>
    </div>
  );
}

export default App;
