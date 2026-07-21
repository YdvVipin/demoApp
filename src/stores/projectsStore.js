import { createStore } from './createStore'

const seed = [
  { id: 1, name: 'Website Redesign', client: 'Acme Corp', status: 'Active', progress: 65, budget: 24000, lead: 'Alice Johnson', tasks: 12, deadline: '2024-09-30' },
  { id: 2, name: 'Mobile App v2', client: 'Globex', status: 'Active', progress: 40, budget: 52000, lead: 'Bob Smith', tasks: 20, deadline: '2024-11-15' },
  { id: 3, name: 'Data Migration', client: 'Initech', status: 'On Hold', progress: 15, budget: 18000, lead: 'Carol White', tasks: 8, deadline: '2024-10-05' },
  { id: 4, name: 'Brand Refresh', client: 'Umbrella', status: 'Completed', progress: 100, budget: 12000, lead: 'David Brown', tasks: 6, deadline: '2024-06-01' },
]

export const projectsStore = createStore(seed)

export const addProject = (p) =>
  projectsStore.set(list => [
    { id: Date.now(), progress: 0, tasks: 0, ...p },
    ...list,
  ])

export const deleteProject = (id) =>
  projectsStore.set(list => list.filter(p => p.id !== id))

export const getProject = (id) =>
  projectsStore.get().find(p => String(p.id) === String(id))

export const updateProject = (id, patch) =>
  projectsStore.set(list => list.map(p => (String(p.id) === String(id) ? { ...p, ...patch } : p)))
