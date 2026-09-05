"use client";

import { Button } from "@/components/ui/Button";
import { useOsStore } from "@/store/os-store";

export function TrashApp() {
  const trash = useOsStore((s) => s.trash);
  const restoreNode = useOsStore((s) => s.restoreNode);
  const setModal = useOsStore((s) => s.setModal);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <p className="text-xs text-zinc-400">{trash.length} item{trash.length === 1 ? "" : "s"}</p>
        <Button
          variant="danger"
          disabled={trash.length === 0}
          onClick={() =>
            setModal({
              title: "Empty Trash?",
              body: ["Deleted items will be removed permanently."],
              confirmLabel: "Empty",
              cancelLabel: "Cancel",
              danger: true,
              action: "empty-trash",
            })
          }
        >
          Empty Trash
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-3">
        {trash.length === 0 ? (
          <p className="text-sm text-zinc-500">Trash is empty.</p>
        ) : (
          <ul className="space-y-2">
            {trash.map((item) => (
              <li
                key={`${item.node.id}-${item.deletedAt}`}
                className="flex items-center justify-between gap-2 rounded-lg border border-white/10 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-white">{item.node.name}</p>
                  <p className="text-[11px] text-zinc-500">{item.node.type}</p>
                </div>
                <div className="flex gap-1">
                  <Button onClick={() => restoreNode(item.node.id)}>Restore</Button>
                  <Button
                    variant="danger"
                    onClick={() =>
                      setModal({
                        title: "Delete permanently?",
                        body: [`${item.node.name} will be removed forever.`],
                        confirmLabel: "Delete",
                        cancelLabel: "Cancel",
                        danger: true,
                        action: "delete-file",
                        payload: item.node.id,
                      })
                    }
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
