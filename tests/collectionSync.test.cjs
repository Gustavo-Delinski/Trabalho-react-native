const { test, before } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
let recordChanges;
let overlayPending;
before(async () => {
  const source = fs.readFileSync(path.join(__dirname, '../src/utils/collectionSync.js'), 'utf8');
  ({ recordChanges, overlayPending } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`));
});

test('favorito criado offline entra na fila e é preservado ao receber a nuvem', () => {
  const local = { id: 1, name: 'Local' };
  const pending = recordChanges([], [local], {});
  assert.deepEqual(pending, { 1: { item: local } });
  assert.deepEqual(overlayPending([{ id: 2, name: 'Outro aparelho' }], pending), [
    { id: 2, name: 'Outro aparelho' }, local,
  ]);
});

test('remoção offline não ressuscita depois da leitura remota', () => {
  const item = { id: 1, name: 'Removida' };
  const pending = recordChanges([item], [], {});
  assert.deepEqual(pending, { 1: { item: null } });
  assert.deepEqual(overlayPending([item], pending), []);
});

test('nota nova substitui a pendência anterior do mesmo item', () => {
  const old = { id: 1, name: 'Série', rating: 2 };
  const updated = { ...old, rating: 5 };
  const pending = recordChanges([old], [updated], { 1: { item: old } });
  assert.deepEqual(overlayPending([old], pending), [updated]);
});

test('editar uma série mantém pendências e dados de outras séries', () => {
  const existingOperation = { item: { id: 2, name: 'Pendente' } };
  const old = { id: 1, rating: 2 };
  const pending = recordChanges([old], [{ ...old, rating: 4 }], { 2: existingOperation });
  assert.equal(pending[2], existingOperation);
  assert.equal(pending[1].item.rating, 4);
});

test('lista sem mudanças não agenda gravações desnecessárias', () => {
  const item = { id: 1, name: 'Série' };
  assert.deepEqual(recordChanges([item], [{ ...item }], {}), {});
});

test('adicionar e remover offline resulta em uma remoção idempotente', () => {
  const item = { id: 1, name: 'Série' };
  const pending = recordChanges([item], [], recordChanges([], [item], {}));
  assert.deepEqual(pending, { 1: { item: null } });
});
