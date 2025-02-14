import { Product } from '@/app/types/product';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const generateHTML = (product: Product) => {
  const totalStock = product.stocks.reduce((acc: number, stock) => acc + stock.quantity, 0);
  const totalValue = totalStock * product.price;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          body { font-family: 'Helvetica', sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; color: #2563eb; }
          .product-image { max-width: 200px; margin: 20px auto; display: block; }
          .section { margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
          th { background-color: #f3f4f6; color: #374151; }
          .summary { background-color: #f8fafc; padding: 15px; border-radius: 8px; }
          .total { color: #2563eb; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${product.name}</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>

        <img src="${product.image}" class="product-image" />

        <div class="section">
          <h2>Basic Information</h2>
          <table>
            <tr><th>Price</th><td>$${product.price.toFixed(2)}</td></tr>
            <tr><th>Supplier</th><td>${product.supplier}</td></tr>
            <tr><th>Barcode</th><td>${product.barcode}</td></tr>
            <tr><th>Type</th><td>${product.type}</td></tr>
          </table>
        </div>

        <div class="section">
          <h2>Stock Information</h2>
          <table>
            <thead>
              <tr>
                <th>Warehouse</th>
                <th>City</th>
                <th>Quantity</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              ${product.stocks.map(stock => `
                <tr>
                  <td>${stock.name}</td>
                  <td>${stock.localisation.city}</td>
                  <td>${stock.quantity}</td>
                  <td>$${(stock.quantity * product.price).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section summary">
          <h2>Summary</h2>
          <table>
            <tr><th>Total Stock</th><td>${totalStock} units</td></tr>
            <tr><th>Total Value</th><td class="total">$${totalValue.toFixed(2)}</td></tr>
          </table>
        </div>

        <div class="section">
          <h2>Edit History</h2>
          <table>
            <thead>
              <tr>
                <th>Modified By</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${product.editedBy.map(edit => `
                <tr>
                  <td>${edit.warehousemanName}</td>
                  <td>${new Date(edit.at).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </body>
    </html>
  `;
};

export const generateProductPDF = async (product: Product) => {
  try {
    const html = generateHTML(product);
    
    // Generate PDF file
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false
    });

    // Share the PDF
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: `${product.name} Details`,
      UTI: 'com.adobe.pdf'
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}; 