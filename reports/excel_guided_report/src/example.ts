/**
 * Example: Generate a Sales Report
 */

import { ExcelReportGenerator } from './generator.js'

async function main() {
  const generator = new ExcelReportGenerator({
    locale: 'pt',
  })

  // Sample data
  const salesData = [
    { id: 1, name: 'Produto A', category: 'Eletrônicos', quantity: 150, price: 299.99, total: 44998.50, date: new Date('2024-01-15') },
    { id: 2, name: 'Produto B', category: 'Móveis', quantity: 45, price: 899.00, total: 40455.00, date: new Date('2024-01-18') },
    { id: 3, name: 'Produto C', category: 'Eletrônicos', quantity: 230, price: 149.99, total: 34497.70, date: new Date('2024-01-20') },
    { id: 4, name: 'Produto D', category: 'Vestuário', quantity: 500, price: 59.90, total: 29950.00, date: new Date('2024-01-22') },
    { id: 5, name: 'Produto E', category: 'Móveis', quantity: 28, price: 1299.00, total: 36372.00, date: new Date('2024-01-25') },
    { id: 6, name: 'Produto F', category: 'Eletrônicos', quantity: 89, price: 449.99, total: 40049.11, date: new Date('2024-01-28') },
    { id: 7, name: 'Produto G', category: 'Vestuário', quantity: 320, price: 89.90, total: 28768.00, date: new Date('2024-01-30') },
    { id: 8, name: 'Produto H', category: 'Acessórios', quantity: 180, price: 39.99, total: 7198.20, date: new Date('2024-02-01') },
  ]

  await generator.generate({
    title: 'Relatório de Vendas - Janeiro 2024',
    columns: [
      { key: 'id', labelKey: 'headers.id', width: 8, type: 'number' },
      { key: 'name', labelKey: 'headers.name', width: 20 },
      { key: 'category', labelKey: 'headers.category', width: 15 },
      { key: 'quantity', labelKey: 'headers.quantity', width: 12, type: 'number', format: '#,##0' },
      { key: 'price', labelKey: 'headers.price', width: 12, type: 'currency' },
      { key: 'total', labelKey: 'headers.total', width: 15, type: 'currency' },
      { key: 'date', labelKey: 'headers.date', width: 12, type: 'date' },
    ],
    data: salesData,
    summary: {
      totals: ['quantity', 'total'],
      averages: ['price', 'total'],
    },
  })

  const outputPath = './output/sales-report.xlsx'
  await generator.save(outputPath)

  console.log(`Report generated: ${outputPath}`)
}

main().catch(console.error)
