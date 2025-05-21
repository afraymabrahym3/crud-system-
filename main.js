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
    tempIndex: null,
    products: [],
    searchMode: 'title'
};

// Initialize jsPDF
window.jsPDF = window.jspdf.jsPDF;

// Initialize App
function init() {
    loadData();
    setupEventListeners();
}

// Load Data from LocalStorage
function loadData() {
    state.products = localStorage.product ? JSON.parse(localStorage.product) : [];
    renderTable();
}

// Calculate Total
function getTotal() {
    if (dom.price.value) {
        const total = (+dom.price.value + +dom.taxes.value + +dom.ads.value) - +dom.discount.value;
        dom.total.textContent = total;
        dom.total.style.background = '#040';
    } else {
        dom.total.textContent = '';
        dom.total.style.background = '#a00d02';
    }
}

// Handle Form Submission
function handleSubmit() {
    if (!validateForm()) return;

    const product = {
        title: dom.title.value.trim(),
        price: dom.price.value,
        taxes: dom.taxes.value || 0,
        ads: dom.ads.value || 0,
        discount: dom.discount.value || 0,
        total: dom.total.textContent,
        count: dom.count.value || 1,
        category: dom.category.value.trim()
    };

    if (state.mood === 'create') {
        addProducts(product);
    } else {
        updateProduct(product);
    }

    saveData();
    resetForm();
}

// Validate Form
function validateForm() {
    if (!dom.title.value || !dom.price.value || !dom.category.value) {
        alert('Please fill all required fields (Title, Price, Category)');
        return false;
    }
    return true;
}

// Add Products
function addProducts(product) {
    const count = product.count > 1 ? product.count : 1;
    for (let i = 0; i < count; i++) {
        state.products.push({...product});
    }
}

// Update Product
function updateProduct(product) {
    state.products[state.tempIndex] = product;
    state.mood = 'create';
    dom.submit.textContent = 'Create';
    dom.count.style.display = 'block';
}

// Save to LocalStorage
function saveData() {
    localStorage.setItem('product', JSON.stringify(state.products));
    renderTable();
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
function renderTable() {
    let tableHTML = '';
    state.products.forEach((product, index) => {
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
            <td><button onclick="prepareUpdate(${index})">Update</button></td>
            <td><button onclick="deleteProduct(${index})">Delete</button></td>
        </tr>
        `;
    });

    dom.tbody.innerHTML = tableHTML;
    renderDeleteAllBtn();
}

// Prepare Update
function prepareUpdate(index) {
    const product = state.products[index];
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
    state.tempIndex = index;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Delete Product
function deleteProduct(index) {
    if (confirm('Are you sure you want to delete this product?')) {
        state.products.splice(index, 1);
        saveData();
    }
}

// Render Delete All Button
function renderDeleteAllBtn() {
    dom.deleteAllBtn.innerHTML = state.products.length > 0
        ? `<button onclick="deleteAllProducts()">Delete All (${state.products.length})</button>`
        : '';
}

// Delete All Products
function deleteAllProducts() {
    if (state.products.length > 0 && confirm('Are you sure you want to delete ALL products?')) {
        state.products = [];
        localStorage.removeItem('product');
        renderTable();
    }
}

// Search Functions
function getSearchMode(mode) {
    state.searchMode = mode === 'searchtitle' ? 'title' : 'category';
    dom.search.placeholder = `Search by ${state.searchMode}`;
    dom.search.focus();
    dom.search.value = '';
    renderTable();
}

function searchData(keyword) {
    if (!keyword) return renderTable();
    
    const filtered = state.products.filter(product => 
        product[state.searchMode].toLowerCase().includes(keyword.toLowerCase())
    );

    let resultsHTML = '';
    filtered.forEach((product, index) => {
        resultsHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>${product.title}</td>
            <td>${product.price}</td>
            <td>${product.taxes}</td>
            <td>${product.ads}</td>
            <td>${product.discount}</td>
            <td>${product.total}</td>
            <td>${product.category}</td>
            <td><button onclick="prepareUpdate(${state.products.indexOf(product)})">Update</button></td>
            <td><button onclick="deleteProduct(${state.products.indexOf(product)})">Delete</button></td>
        </tr>
        `;
    });

    dom.tbody.innerHTML = resultsHTML;
}

// ... [الكود السابق يبقى كما هو حتى دالة exportToPDF]
function exportToPDF() {
    try {
        // التأكد من تحميل المكتبة
        if (typeof window.jspdf === 'undefined') {
            throw new Error('PDF library not loaded');
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // إعدادات الصفحة
        const pageWidth = doc.internal.pageSize.getWidth();
        const tableWidth = 180; // عرض ثابت للجدول (أقل من عرض A4 الذي هو 210mm)

        // حساب الهوامش لتمركز الجدول
        const marginLeft = (pageWidth - tableWidth) / 2;
        
        // العناوين والتواريخ
        doc.setFontSize(18);
        doc.text('Product Report', pageWidth / 2, 20, { align: 'center' });
        
        const dateString = new Date().toLocaleString();
        doc.setFontSize(10);
        doc.text(`Generated: ${dateString}`, pageWidth / 2, 27, { align: 'center' });

        // بيانات الجدول
        const headers = [["ID", "Title", "Price", "Taxes", "Ads", "Discount", "Total", "Category"]];
        const data = state.products.map((product, index) => [
            index + 1,
            product.title,
            product.price,
            product.taxes,
            product.ads,
            product.discount,
            product.total,
            product.category
        ]);

        // إنشاء الجدول المتمركز
        doc.autoTable({
            head: headers,
            body: data,
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
function setupEventListeners() {
    dom.submit.addEventListener('click', handleSubmit);
    dom.printBtn.addEventListener('click', exportToPDF);
    dom.searchTitleBtn.addEventListener('click', () => getSearchMode('searchtitle'));
    dom.searchCategoryBtn.addEventListener('click', () => getSearchMode('searchcategory'));
    
    [dom.price, dom.taxes, dom.ads, dom.discount].forEach(input => {
        input.addEventListener('input', getTotal);
    });
}

// Initialize App
document.addEventListener('DOMContentLoaded', init);