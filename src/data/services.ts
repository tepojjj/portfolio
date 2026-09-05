import type { LucideIcon } from 'lucide-react'
import { Code2, LineChart, LayoutDashboard, Workflow, ShoppingCart, Boxes, Plug } from 'lucide-react'

export interface Service {
  id: string
  title: string
  description: string
  icon: LucideIcon
  details: string
}

export const services: Service[] = [
  {
    id: 'web-dev',
    title: 'Web Development',
    description: 'React and TypeScript applications built for real operational use, not just demos.',
    icon: Code2,
    details:
      'From internal tools to customer-facing sites, with component-driven builds that stay maintainable as requirements change.',
  },
  {
    id: 'data-analytics',
    title: 'Data Analytics',
    description: 'Turning scattered exports and event data into numbers people actually trust.',
    icon: LineChart,
    details: 'Python/Pandas processing, SQL modeling, and reporting that holds up under scrutiny.',
  },
  {
    id: 'dashboards',
    title: 'Dashboard Development',
    description: 'Looker Studio and custom React dashboards that answer the question, not just display data.',
    icon: LayoutDashboard,
    details: 'GA4, Shopify, and internal database sources unified into one clear view.',
  },
  {
    id: 'automation',
    title: 'Automation',
    description: 'Scripted, scheduled workflows that remove repetitive manual steps between systems.',
    icon: Workflow,
    details: 'Fuzzy matching, format conversion, and scheduled reconciliation jobs.',
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Systems',
    description: 'Shopify API integrations and storefront analytics pipelines.',
    icon: ShoppingCart,
    details: 'Order, product, and revenue data connected into a single reporting layer.',
  },
  {
    id: 'inventory',
    title: 'Inventory Systems',
    description: 'Reconciliation, classification, and floor/zone assignment tooling for multi-store operations.',
    icon: Boxes,
    details: 'Built and battle-tested across 64+ retail locations and tens of thousands of SKUs.',
  },
  {
    id: 'api-integration',
    title: 'API Integration',
    description: 'Connecting Lark Base, Shopify, and internal systems through clean, scoped API layers.',
    icon: Plug,
    details: 'OAuth-secured backends that expose only what each client actually needs.',
  },
]
