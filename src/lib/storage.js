import Dexie from 'dexie';

const db = new Dexie('funweek');
db.version(1).stores({
  samples: `++id, time, blob`,
});
db.version(2).stores({
  samples: `++id, time, blob`,
  slots: `id, sampleId`,
});

window.db = db;

export const Sample = db.samples.defineClass({
  id: Number,
  time: Number,
  blob: Blob,
});

export const Slot = db.slots.defineClass({
  id: Number,
  sampleId: Number,
});

export const fetchFromSlot = async id => {
  const slot = await db.slots
    .where('id')
    .equals(id)
    .first();

  if (slot && slot.sampleId) {
    return findById(slot.sampleId);
  }
};

export const saveToSlot = async ({ id, sample }) => {
  console.log('saveToSlot', id);

  const slot = await db.slots
    .where('id')
    .equals(id)
    .first();

  console.log('slot', slot);

  const sampleId = await save(sample);

  console.log('saved sample', sampleId);

  if (slot == null) {
    return db.slots.add({ id, sampleId });
  } else {
    return db.slots.update(id, { sampleId });
  }
};

export const save = sample => {
  return db.samples.add(sample);
};

export const load = () => db.samples.toArray();

export const findById = async id =>
  db.samples
    .where('id')
    .equals(id)
    .first();

export const removeById = async id => {
  return db.samples
    .where('id')
    .equals(id)
    .delete();
};
