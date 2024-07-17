window.addEventListener('load', () => {
    document.getElementById('generateButton').addEventListener('click', generateInvoice);
    document.getElementById('addItemButton').addEventListener('click', addItem);
    console.log('Event listeners added.');
});

function addItem() {
    const itemsContainer = document.getElementById('itemsContainer');
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');

    itemDiv.innerHTML = `
        <label for="itemDescription">Description de l'Article :</label>
        <input type="text" class="itemDescription" name="itemDescription" required>

        <label for="quantity">Quantité :</label>
        <input type="number" class="quantity" name="quantity" required>

        <label for="unitPrice">Prix Unitaire :</label>
        <input type="number" class="unitPrice" name="unitPrice" required>
    `;

    itemsContainer.appendChild(itemDiv);
}

async function generateInvoice() {
    const { jsPDF } = window.jspdf;

    const clientName = document.getElementById('clientName').value;
    const clientAddress = document.getElementById('clientAddress').value;
    const clientContact = document.getElementById('clientContact').value;
    const invoiceNumber = document.getElementById('invoiceNumber').value;
    const invoiceDate = document.getElementById('invoiceDate').value;

    const itemDescriptions = document.getElementsByClassName('itemDescription');
    const quantities = document.getElementsByClassName('quantity');
    const unitPrices = document.getElementsByClassName('unitPrice');

    const doc = new jsPDF();

    // Load image as base64
    const imgData = await getImageAsBase64('tabac.png');

    // Header background with gradient
    const gradient = doc.context2d.createLinearGradient(0, 0, 210, 0);
    gradient.addColorStop(0, '#00416A');
    gradient.addColorStop(1, '#E4E5E6');
    doc.context2d.fillStyle = gradient;
    doc.context2d.fillRect(0, 0, 210, 40);

    // Adding company name
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text('Colombian Tabaco', 10, 25);
    doc.addImage(imgData, 'PNG', 160, 0, 50, 40);


   

    // Adding client information
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Nom: ${clientName}`, 10, 50);
    doc.text(`Adresse: ${clientAddress}`, 10, 60);
    doc.text(`Contact: ${clientContact}`, 10, 70);
    doc.text(`Facture #: ${invoiceNumber}`, 150, 50);
    doc.text(`Date: ${invoiceDate}`, 150, 60);

    // Adding table headers with background color
    doc.setFillColor(100, 100, 255);
    doc.rect(10, 90, 190, 10, 'F');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text('Description', 12, 97);
    doc.text('Quantité', 80, 97);
    doc.text('Prix Unitaire', 110, 97);
    doc.text('Total', 160, 97);

    let currentY = 110;
    let totalInvoicePrice = 0;

    for (let i = 0; i < itemDescriptions.length; i++) {
        const itemDescription = itemDescriptions[i].value;
        const quantity = quantities[i].value;
        const unitPrice = unitPrices[i].value;
        const totalPrice = quantity * unitPrice;

        totalInvoicePrice += totalPrice;

        // Adding table data with alternate row colors
        if (i % 2 === 0) {
            doc.setFillColor(240, 240, 255);
        } else {
            doc.setFillColor(255, 255, 255);
        }
        doc.rect(10, currentY - 7, 190, 10, 'F');

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(itemDescription, 12, currentY);
        doc.text(quantity.toString(), 85, currentY);
        doc.text(unitPrice.toString(), 115, currentY);
        doc.text(totalPrice.toString(), 160, currentY);

        currentY += 10;
    }

    // Adding total with background color
    doc.setFillColor(100, 255, 100);
    doc.rect(150, currentY, 50, 10, 'F');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Total: ' + totalInvoicePrice.toString() + '$', 155, currentY + 7);

    

    // Adding footer with line
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(10, 280, 200, 280);
    doc.setFontSize(14);
    doc.text('Merci pour votre achat!', 90, 290);

    // Save the PDF with the invoice number
    doc.save(`facture_${invoiceNumber}.pdf`);

    // Utility function to get image as base64
    function getImageAsBase64(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const dataURL = canvas.toDataURL('image/png');
                resolve(dataURL);
            };
            img.onerror = (err) => reject(err);
            img.src = url;
        });
    }
}
