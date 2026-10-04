import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Banners } from './collections/Banners'
import { Products } from './collections/products'
import { Customers } from './collections/Customers'
import { Subcategories } from './collections/Subcategories'
import { Favorites } from './collections/Favorites'
import { Orders } from './collections/Orders'
import { Coupons } from './collections/Coupons'
import { PromoBanner } from './globals/PromoBanner'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '- TRIAFANA Store',
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          url: '/triafana-logo.png',
        },
      ],
    },
    components: {
      graphics: {
        Logo: './components/Brand',
      },
    },
  },
  collections: [
    Customers,
    Favorites,
    Orders,
    Coupons,
    Users,
    Banners,
    Media,
    Products,
    Subcategories,
  ],
  globals: [PromoBanner],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  ...(process.env.SMTP_HOST
    ? {
        email: nodemailerAdapter({
          defaultFromAddress: process.env.SMTP_FROM_ADDRESS || 'no-reply@triafana.com',
          defaultFromName: process.env.SMTP_FROM_NAME || 'Triafana',
          transportOptions: {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          },
        }),
      }
    : {}),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || '',
    },
    // push desactivado a propósito: los cambios de esquema se aplican solo
    // con `pnpm migrate`. Sin esto, Payload intenta un push interactivo
    // (pregunta "created or renamed?") que cuelga el arranque y el build.
    push: false,
  }),
  sharp,
  plugins: [],
})
