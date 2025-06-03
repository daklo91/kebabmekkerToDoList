import type { TodoItem as ITodoItem } from "../types";

type Props = {
  item: ITodoItem;
  checked: boolean;
  onToggle: () => void;
  onTextChange: (text: string) => void;
  onDelete: () => void;
};

function TodoItem({ item, checked, onToggle, onTextChange, onDelete }: Props) {
  return (
    <li className="flex items-center space-x-2 mb-2">
      <input type="checkbox" checked={checked} onChange={onToggle} />
      <input
        type="text"
        value={item.text}
        onChange={(e) => onTextChange(e.target.value)}
        className="border px-2 py-1"
      />
      <button onClick={onDelete}>Slett</button>
    </li>
  );
}

export default TodoItem;
