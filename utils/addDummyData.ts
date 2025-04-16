import { projects, todos } from '@/db/schema';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';

import AsyncStorage from 'expo-sqlite/kv-store';

export const addDummyData = async (db: ExpoSQLiteDatabase) => {
  const value = AsyncStorage.getItemSync('initialized');
  if (value) return;

  await db.insert(projects).values([
    { name: 'Inbox', color: '#000000' },
    { name: 'Work', color: '#0a009c' },
  ]);
  await db.insert(todos).values([
    {
      name: 'Check out Galaxies.dev for epic React Native courses',
      description: 'And learn how to build your own apps',
      priority: 1,
      completed: 0,
      project_id: 1,
      date_added: Date.now(),
    },
    {
      name: 'Buy groceries for the week',
      priority: 2,
      completed: 0,
      project_id: 2,
      date_added: Date.now(),
    },
    {
      name: 'Buy groceries for the week',
      priority: 2,
      completed: 0,
      project_id: 3,
      date_added: Date.now(),
    },
    {
      name: 'Buy groceries for the week',
      priority: 2,
      completed: 0,
      project_id: 4,
      date_added: Date.now(),
    },
    {
      name: 'Buy groceries for the week',
      priority: 2,
      completed: 0,
      project_id: 5,
      date_added: Date.now(),
    },
    {
      name: 'Buy groceries for the week',
      priority: 2,
      completed: 0,
      project_id: 6,
      date_added: Date.now(),
    },
    {
      name: 'Buy groceries for the week',
      priority: 2,
      completed: 0,
      project_id: 7,
      date_added: Date.now(),
    },
    {
      name: 'Buy groceries for the week',
      priority: 2,
      completed: 0,
      project_id: 8,
      date_added: Date.now(),
    },
    {
      name: 'Buy groceries for the week',
      priority: 2,
      completed: 0,
      project_id: 9,
      date_added: Date.now(),
    },
    {
      name: 'Buy groceries for the week',
      priority: 2,
      completed: 0,
      project_id: 10,
      date_added: Date.now(),
    },
    {
      name: 'Buy groceries for the week',
      priority: 2,
      completed: 0,
      project_id: 11,
      date_added: Date.now(),
    },
    {
      name: 'Buy groceries for the week',
      priority: 2,
      completed: 0,
      project_id: 12,
      date_added: Date.now(),
    },
  ]);
  AsyncStorage.setItemSync('initialized', 'true');
};