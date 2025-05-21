// DOM Elements
const dom = {
    title: document.getElementById('title'),
    price: document.getElementById('price'),
    taxes: document.getElementById('taxes'),
    ads: document.getElementById('ads'),
    discount: document.getElementById('discount'),
    total: document.getElementById('total'),
    count: document.getElementById('count'),
    category: document.getElementById('category'),
    submit: document.getElementById('submit'),
    search: document.getElementById('search'),
    searchTitleBtn: document.getElementById('searchtitle'),
    searchCategoryBtn: document.getElementById('searchcategory'),
    deleteAllBtn: document.getElementById('deleteAll'),
    printBtn: document.getElementById('printBtn'),
    tbody: document.getElementById('tbody')
};

// Global Variables
let state = {
    mood: 'create',
    tempId: null,
    searchMode: 'title'
};

// Initialize jsPDF
window.jsPDF = window.jspdf.jsPDF;

// Calculate Total
function getTotal() {
    if (dom.price.value) {
        const total = (+dom.price.value + +dom.taxes.value + +dom.ads.value) - +dom.discount.value;
        dom.total.textContent = total;
        dom.total.style.background = '#040';
        return total;
    } else {
        dom.total.textContent = '';
        dom.total.style.background = '#a00d02';
        return 0;
    }
}

// Load Products
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`, {
            headers: {
                'x-auth-token': localStorage.getItem('token')
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load products');
        }

        const products = await response.json();
        renderTable(products);
    } catch (error) {
        console.error('Error loading products:', error);
        alert('Failed to load products');
    }
}

// Handle Form Submission
async function handleSubmit() {
    if (!validateForm()) return;

    const productData = {
        title: dom.title.value.trim(),
        price: +dom.price.value,
        taxes: +dom.taxes.value || 0,
        ads: +dom.ads.value || 0,
        discount: +dom.discount.value || 0,
        total: getTotal(),
        category: dom.category.value.trim()
    };

    try {
        if (state.mood === 'create') {
            await createProduct(productData);
        } else {
            await updateProduct(productData);
        }

        resetForm();
        loadProducts();
    } catch (error) {
        console.error('Error handling submit:', error);
        alert(error.message);
    }
}

// Create Product
async function createProduct(productData) {
    const count = +dom.count.value || 1;
    const promises = [];

    for (let i = 0; i < count; i++) {
        const promise = fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify(productData)
        });
        promises.push(promise);
    }

    await Promise.all(promises);
}

// Update Product
async function updateProduct(productData) {
    const response = await fetch(`${API_URL}/products/${state.tempId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(productData)
    });

    if (!response.ok) {
        throw new Error('Failed to update product');
    }

    state.mood = 'create';
    dom.submit.textContent = 'Create';
    dom.count.style.display = 'block';
}

// Delete Product
async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: {
                'x-auth-token': localStorage.getItem('token')
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete product');
        }

        loadProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
    }
}

// Delete All Products
async function deleteAllProducts() {
    if (!confirm('Are you sure you want to delete ALL products?')) return;

    try {
        const response = await fetch(`${API_URL}/products`, {
            headers: {
                'x-auth-token': localStorage.getItem('token')
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load products');
        }

        const products = await response.json();
        const deletePromises = products.map(product => 
            fetch(`${API_URL}/products/${product._id}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            })
        );

        await Promise.all(deletePromises);
        loadProducts();
    } catch (error) {
        console.error('Error deleting all products:', error);
        alert('Failed to delete all products');
    }
}

// Prepare Update
function prepareUpdate(product) {
    dom.title.value = product.title;
    dom.price.value = product.price;
    dom.taxes.value = product.taxes;
    dom.ads.value = product.ads;
    dom.discount.value = product.discount;
    dom.category.value = product.category;
    getTotal();
    
    dom.count.style.display = 'none';
    dom.submit.textContent = 'Update';
    state.mood = 'update';
    state.tempId = product._id;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Validate Form
function validateForm() {
    if (!dom.title.value || !dom.price.value || !dom.category.value) {
        alert('Please fill all required fields (Title, Price, Category)');
        return false;
    }
    return true;
}

// Reset Form
function resetForm() {
    dom.title.value = '';
    dom.price.value = '';
    dom.taxes.value = '';
    dom.ads.value = '';
    dom.discount.value = '';
    dom.total.textContent = '';
    dom.count.value = '';
    dom.category.value = '';
    getTotal();
}

// Render Table
function renderTable(products) {
    let tableHTML = '';
    products.forEach((product, index) => {
        tableHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>${product.title}</td>
            <td>${product.price}</td>
            <td>${product.taxes}</td>
            <td>${product.ads}</td>
            <td>${product.discount}</td>
            <td>${product.total}</td>
            <td>${product.category}</td>
            <td><button onclick="prepareUpdate(${JSON.stringify(product)})">Update</button></td>
            <td><button onclick="deleteProduct('${product._id}')">Delete</button></td>
        </tr>
        `;
    });

    dom.tbody.innerHTML = tableHTML;
    renderDeleteAllBtn(products.length);
}

// Render Delete All Button
function renderDeleteAllBtn(count) {
    dom.deleteAllBtn.innerHTML = count > 0
        ? `<button onclick="deleteAllProducts()">Delete All (${count})</button>`
        : '';
}

// Search Functions
function getSearchMode(mode) {
    state.searchMode = mode === 'searchtitle' ? 'title' : 'category';
    dom.search.placeholder = `Search by ${state.searchMode}`;
    dom.search.focus();
    dom.search.value = '';
    loadProducts();
}

async function searchData(keyword) {
    try {
        const response = await fetch(`${API_URL}/products`, {
            headers: {
                'x-auth-token': localStorage.getItem('token')
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load products');
        }

        const products = await response.json();
        
        if (!keyword) {
            renderTable(products);
            return;
        }

        const filtered = products.filter(product => 
            product[state.searchMode].toLowerCase().includes(keyword.toLowerCase())
        );

        renderTable(filtered);
    } catch (error) {
        console.error('Error searching products:', error);
        alert('Failed to search products');
    }
}

// Export to PDF
function exportToPDF() {
    try {
        if (typeof window.jspdf === 'undefined') {
            throw new Error('PDF library not loaded');
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const tableWidth = 180;
        const marginLeft = (pageWidth - tableWidth) / 2;
        
        doc.setFontSize(18);
        doc.text('Product Report', pageWidth / 2, 20, { align: 'center' });
        
        const dateString = new Date().toLocaleString();
        doc.setFontSize(10);
        doc.text(`Generated: ${dateString}`, pageWidth / 2, 27, { align: 'center' });

        const headers = [["ID", "Title", "Price", "Taxes", "Ads", "Discount", "Total", "Category"]];
        
        // Get current products from the table
        const rows = [];
        document.querySelectorAll('#tbody tr').forEach((row, index) => {
            const cells = row.querySelectorAll('td');
            rows.push([
                index + 1,
                cells[1].textContent,
                cells[2].textContent,
                cells[3].textContent,
                cells[4].textContent,
                cells[5].textContent,
                cells[6].textContent,
                cells[7].textContent
            ]);
        });

        doc.autoTable({
            head: headers,
            body: rows,
            startY: 35,
            margin: { left: marginLeft, right: marginLeft },
            styles: {
                fontSize: 10,
                cellPadding: 4,
                halign: 'center',
                valign: 'middle',
                textColor: [0, 0, 0],
                fillColor: [255, 255, 255],
                lineWidth: 0.2,
                lineColor: [200, 200, 200]
            },
            headStyles: {
                fillColor: [70, 130, 180],
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            },
            columnStyles: {
                0: { cellWidth: 15 },
                1: { cellWidth: 40 },
                2: { cellWidth: 20 },
                3: { cellWidth: 20 },
                4: { cellWidth: 20 },
                5: { cellWidth: 20 },
                6: { cellWidth: 20 },
                7: { cellWidth: 25 }
            },
            tableWidth: tableWidth,
            showHead: 'everyPage'
        });

        doc.save(`products_report_${new Date().getTime()}.pdf`);
    } catch (error) {
        console.error('PDF Generation Error:', error);
        alert('Error generating PDF. Please check console for details.');
    }
}

// Event Listeners
dom.submit.addEventListener('click', handleSubmit);
dom.printBtn.addEventListener('click', exportToPDF);
dom.searchTitleBtn.addEventListener('click', () => getSearchMode('searchtitle'));
dom.searchCategoryBtn.addEventListener('click', () => getSearchMode('searchcategory'));

[dom.price, dom.taxes, dom.ads, dom.discount].forEach(input => {
    input.addEventListener('input', getTotal);
}); 