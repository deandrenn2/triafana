import type { CollectionConfig } from 'payload'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',

  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'createdAt'],
  },

  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      label: 'Correo',
    },
  ],

  access: {
    // Cualquiera puede suscribirse desde el footer
    create: () => true,
    // Solo admins ven y gestionan la lista
    read: ({ req }) => {
      return Boolean(req.user && req.user.collection !== 'customers')
    },
    update: ({ req }) => {
      return Boolean(req.user && req.user.collection !== 'customers')
    },
    delete: ({ req }) => {
      return Boolean(req.user && req.user.collection !== 'customers')
    },
  },
}
