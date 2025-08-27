import { Calendar, Clock } from "lucide-react";

export default function SlotCard({ slot, onSelect }) {
  return (
    <div className="border p-4 rounded-lg shadow-sm hover:shadow-md">
      <div className="flex items-center gap-2 mb-2">
        <Calendar className="w-4 h-4 text-gray-500" />
        <span>{slot.date}</span>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-gray-500" />
        <span>{slot.time}</span>
      </div>
      <button
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        onClick={() => {
            console.log("Slot selected:", slot.id);
            onSelect(slot.id)}}
      >
        Select Slot
      </button>
    </div>
  );
}
