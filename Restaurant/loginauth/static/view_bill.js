function printBill() {
    var printContents = document.getElementById('bill-content').innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    location.reload();
}