@AGENTS.md

# MenuCo

Outil multi-tenant de menus digitaux pour restaurants à Cotonou.
Opéré par François (admin unique). Les restaurants ont un mini dashboard limité.

## Stack
- Next.js 16 + TypeScript
- Prisma v7 + Prisma Postgres (console.prisma.io)
- Better Auth (sessions)
- Tailwind + shadcn/ui
- Uploadthing (photos)
- `qrcode` npm (génération QR)
- Vercel API (automation domaines perso)

## Structure app/
```
(admin)/          → Panel admin François — /dashboard, /restaurants/[id]/*
(owner)/          → Dashboard propriétaire restaurant
m/[slug]/         → Page publique menu (multi-tenant)
api/              → Routes API
```

## Multi-tenant
- Wildcard *.menuco.bj → middleware rewrite vers /m/[slug]
- Domaine perso → query param ?domain= résolu en DB
- Voir src/middleware.ts

## Rôles
- ADMIN : François, accès total
- OWNER : propriétaire restaurant, accès mini dashboard uniquement

## Modèle de données
Restaurant → Menu → Category → MenuItem → ItemVariant + ModifierGroup → ModifierOption

## Conventions
- Prix en XOF (entiers, pas de décimales)
- Revalidation ISR immédiate après update owner (revalidatePath)
- Pas de `any` — toujours `unknown` + type guards
- Zod pour validation aux frontières API
