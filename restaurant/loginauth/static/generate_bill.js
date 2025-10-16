// document.getElementById('billForm').addEventListener('submit', function(e) {
//     e.preventDefault();
//     const form = e.target;
//     const formData = new FormData(form);
//     const url = form.getAttribute('data-url');

//     fetch( url , {
//         method: 'POST',
//         headers: {
//             'X-CSRFToken': formData.get('csrfmiddlewaretoken'),
//         },
//         body: formData
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//             document.getElementById('billResult').innerHTML = data.bill_html;
//             form.reset();
//         } else {
//             alert('Error creating bill');
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// });




function handleBillFormSubmit(form, event) {
    event.preventDefault();
  
    const url = form.dataset.url;
    const formData = new FormData(form);
  
    submitBillForm(url, formData);
    return false; // Prevent default form submission
  }
  
  function submitBillForm(url, formData) {
    fetch(url, {
      method: 'POST',
      headers: {
        'X-CSRFToken': formData.get('csrfmiddlewaretoken'),
      },
      body: formData,
    })
      .then(handleJsonResponse)
      .catch(handleError);
  }
  
  function handleJsonResponse(response) {
    return response.json().then(data => {
      if (data.success) {
        loadBillIntoModal(data.redirect_url);
      } else {
        alert("Form is invalid. Please check the fields.");
        console.log(data.errors);
      }
    });
  }
  
  function loadBillIntoModal(url) {
    fetch(url)
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const billHTML = doc.getElementById('bill-content').innerHTML;
  
        document.getElementById('bill-content').innerHTML = billHTML;
        openModal();
      })
      .catch(handleError);
  }
  
  function openModal() {
    document.getElementById('billModal').style.display = 'block';
  }
  
  function closeModal() {
    document.getElementById('billModal').style.display = 'none';
  }
  
  function printBill() {
    const billContents = document.getElementById('bill-content').innerHTML;
    const printWindow = window.open('', '_blank', 'width=800,height=600');

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Bill</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h2 { text-align: center; }
            p { margin: 5px 0; }
          </style>
        </head>
        <body>
          ${billContents}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
}

  
  function handleError(error) {
    console.error('Error:', error);
  }
  

  function initializeKOTSelect2() {
    console.log("Initializing KOT Select2...");
    const kotSelect = document.getElementById('id_kot');
    if (kotSelect) {
        $(kotSelect).select2({
            placeholder: "Select KOTs",
            width: '100%',
            allowClear: true
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
  initializeKOTSelect2();
});