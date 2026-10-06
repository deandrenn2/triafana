import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

// NOTA: recortada a mano. El generador incluyó CREATE de tablas que ya
// existían (coupons, products_sizes) por divergencia de snapshots entre
// ramas. Solo se asegura lo propio de esta migración: tabla subscribers
// y su columna de relación. IF NOT EXISTS la hace segura en cualquier entorno.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`subscribers\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`email\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX IF NOT EXISTS \`subscribers_email_idx\` ON \`subscribers\` (\`email\`);`,
  )
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`subscribers_updated_at_idx\` ON \`subscribers\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`subscribers_created_at_idx\` ON \`subscribers\` (\`created_at\`);`,
  )

  const relsCols = (await db.all(
    sql`SELECT name FROM pragma_table_info('payload_locked_documents_rels');`,
  )) as { name: string }[]
  if (!relsCols.some((col) => col.name === 'subscribers_id')) {
    await db.run(
      sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`subscribers_id\` integer REFERENCES subscribers(id);`,
    )
  }
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_subscribers_id_idx\` ON \`payload_locked_documents_rels\` (\`subscribers_id\`);`,
  )
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX IF EXISTS \`payload_locked_documents_rels_subscribers_id_idx\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`subscribers_created_at_idx\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`subscribers_updated_at_idx\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`subscribers_email_idx\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`subscribers\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`customers_id\` integer,
  	\`favorites_id\` integer,
  	\`orders_id\` integer,
  	\`users_id\` integer,
  	\`banners_id\` integer,
  	\`media_id\` integer,
  	\`products_id\` integer,
  	\`subcategories_id\` integer,
  	\`coupons_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`customers_id\`) REFERENCES \`customers\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`favorites_id\`) REFERENCES \`favorites\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`orders_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`banners_id\`) REFERENCES \`banners\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`subcategories_id\`) REFERENCES \`subcategories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`coupons_id\`) REFERENCES \`coupons\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "customers_id", "favorites_id", "orders_id", "users_id", "banners_id", "media_id", "products_id", "subcategories_id", "coupons_id") SELECT "id", "order", "parent_id", "path", "customers_id", "favorites_id", "orders_id", "users_id", "banners_id", "media_id", "products_id", "subcategories_id", "coupons_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_customers_id_idx\` ON \`payload_locked_documents_rels\` (\`customers_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_favorites_id_idx\` ON \`payload_locked_documents_rels\` (\`favorites_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_orders_id_idx\` ON \`payload_locked_documents_rels\` (\`orders_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_banners_id_idx\` ON \`payload_locked_documents_rels\` (\`banners_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_products_id_idx\` ON \`payload_locked_documents_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_subcategories_id_idx\` ON \`payload_locked_documents_rels\` (\`subcategories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_coupons_id_idx\` ON \`payload_locked_documents_rels\` (\`coupons_id\`);`)
}
