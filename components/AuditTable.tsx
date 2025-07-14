'use client'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { motion } from 'framer-motion'

type AuditEntry = {
  date: string
  activity: string
  status: 'Completed' | 'In Progress' | 'Pending'
  user: string
}

const data: AuditEntry[] = [
  {
    date: '2025-01-14',
    activity: 'Ethics Checklist Updated',
    status: 'Completed',
    user: 'John Doe',
  },
  {
    date: '2025-01-13',
    activity: 'Day 2 Training Completed',
    status: 'Completed',
    user: 'John Doe',
  },
  {
    date: '2025-01-12',
    activity: 'Client File Review',
    status: 'In Progress',
    user: 'Jane Smith',
  },
]

const columnHelper = createColumnHelper<AuditEntry>()

const columns = [
  columnHelper.accessor('date', {
    header: 'Date',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('activity', {
    header: 'Activity',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => {
      const status = info.getValue()
      const colors = {
        Completed: 'bg-green-100 text-green-800',
        'In Progress': 'bg-amber-100 text-amber-800',
        Pending: 'bg-gray-100 text-gray-800',
      }
      return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[status]}`}>
          {status}
        </span>
      )
    },
  }),
  columnHelper.accessor('user', {
    header: 'User',
    cell: info => info.getValue(),
  }),
]

export function AuditTable() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-hidden">
      <table className="min-w-full divide-y divide-secondary-200">
        <thead className="bg-secondary-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-secondary-200">
          {table.getRowModel().rows.map((row, index) => (
            <motion.tr
              key={row.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="hover:bg-secondary-50 transition-colors"
            >
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}