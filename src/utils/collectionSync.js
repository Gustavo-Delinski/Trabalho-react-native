// Operações por item: alterar uma série não substitui a coleção inteira na nuvem.
export function recordChanges(previous, next, pending) {
  const result = { ...pending };
  const oldItems = new Map(previous.map((item) => [String(item.id), item]));
  const newItems = new Map(next.map((item) => [String(item.id), item]));
  for (const [id, item] of newItems) {
    if (JSON.stringify(oldItems.get(id)) !== JSON.stringify(item)) result[id] = { item };
  }
  for (const id of oldItems.keys()) {
    if (!newItems.has(id)) result[id] = { item: null };
  }
  return result;
}

export function overlayPending(remote, pending) {
  const items = new Map(remote.map((item) => [String(item.id), item]));
  for (const [id, operation] of Object.entries(pending)) {
    if (operation.item === null) items.delete(id);
    else items.set(id, operation.item);
  }
  return Array.from(items.values());
}
