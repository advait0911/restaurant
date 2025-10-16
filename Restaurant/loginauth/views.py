

from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .forms import RegisterForm, LoginForm
from django.http import JsonResponse

def register_view(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Registration successful. You can now log in.")
            return redirect('login')
    else:
        form = RegisterForm()
    return render(request, 'loginauth/register.html', {'form': form})

def login_view(request):
    
    if request.method == 'POST':
        form = LoginForm(data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, f"Welcome, {user.username}!")
                return redirect('dashboard')  # Replace 'home' with your desired URL name
            else:
                messages.error(request, "Invalid username or password.")
    else:
        form = LoginForm()
    return render(request, 'loginauth/login.html', {'form': form})

def logout_view(request):
    logout(request)
    messages.success(request, "You have been logged out.")
    return redirect('/login')

from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required  # Ensures only authenticated users can access this view
def dashboard_view(request):
    return render(request, 'loginauth/dashboard.html', {'user': request.user})

from django.contrib.auth.views import LoginView

class CustomLoginView(LoginView):
    template_name = 'loginauth/login.html'  # Ensure the path matches the actual template location


from .forms import WaiterForm
from .models import Waiter
def dashboard(request):
    return render(request, 'dashboard.html')

from django.http import JsonResponse
from django.shortcuts import render
from .forms import WaiterForm

def add_waiter(request):
    print("🔹 Request Method:", request.method)

    if request.method == "POST":
        print("🔹 POST Data:", request.POST)  # Debugging line
        print("🔹 Request Headers:", request.headers)

        form = WaiterForm(request.POST)
        if form.is_valid():
            print("✅ Form is valid. Saving data...")
            form.save()
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':  # Check if AJAX request
                return JsonResponse({"message": "Waiter added successfully!", "redirect_hash": "Supplier_list"})
            return redirect('supplier_staff_list')
        else:
            print("❌ Form errors:", form.errors)
            return JsonResponse({"error": form.errors}, status=400)

    return render(request, 'loginauth/add_waiter.html', {'form': WaiterForm()})





from .models import MenuItem
from .forms import MenuItemForm

def add_menu(request):
    print("🔹 Request Method:", request.method)

    if request.method == "POST":
        form = MenuItemForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':  # Check if AJAX request
                return JsonResponse({"message": "Menu item added successfully!", "redirect_hash": "Show_menu"})
            return redirect('menu_show')
        else:
            print("❌ Form Errors:", form.errors)
            return JsonResponse({"error": form.errors}, status=400)

    form = MenuItemForm()
    return render(request, 'loginauth/add_menu.html', {'form': form})

def show_menu(request):
    starters = MenuItem.objects.filter(section='Starter')
    main_course = MenuItem.objects.filter(section='Main Course')
    drinks = MenuItem.objects.filter(section='Drinks')
    desserts = MenuItem.objects.filter(section='Desserts')

    return render(request, 'loginauth/menu_show.html', {
        'starters': starters,
        'main_course': main_course,
        'drinks': drinks,
        'desserts': desserts
    })



from .models import Order, OrderItem
from .forms import OrderForm, OrderItemForm

def order_list(request):
    orders = Order.objects.all()
    return render(request, 'loginauth/order_list.html', {'orders': orders})



from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.forms import inlineformset_factory
from .models import Order, OrderItem, MenuItem  # Ensure MenuItem is imported
from .forms import OrderForm, OrderItemForm

def create_order(request, order_id=None):
    order = None

    if order_id:
        order = get_object_or_404(Order, order_id=order_id)

    OrderItemFormSet = inlineformset_factory(Order, OrderItem, form=OrderItemForm, extra=1, can_delete=True)

    sections = MenuItem.objects.values_list('section', flat=True).distinct()  # Fetch unique sections

    order_form = OrderForm(instance=order)  # Always initialize the order form
    formset = OrderItemFormSet(instance=order)  # Always initialize the formset
    
    if request.method == "POST":
        order_form = OrderForm(request.POST, instance=order)
        print("🔹 Order Form Data:", request.POST)  # Debugging line
        if order_form.is_valid():
            order = order_form.save()  # Save Order before using it in formset
            print("✅ Order Form is valid. Order saved:", order.order_id)
            formset = OrderItemFormSet(request.POST, instance=order)  # Initialize with the saved order

            if formset.is_valid():
                print("✅ Formset is valid. Saving order items...")
                formset.save()  # Save order items

                # Create Kitchen Order Ticket (KOT)
                create_kot(order.order_id)

                if request.headers.get('X-Requested-With') == 'XMLHttpRequest':  # Check if AJAX request
                    return JsonResponse({"message": "Order item added successfully!", "redirect_hash": "Order_list"})

                return redirect('order_list')

    price_map = {
        str(item.pk): float(item.price)
        for item in MenuItem.objects.all()
    }
    return render(request, 'loginauth/create_order.html', {
        'order_form': order_form,
        'formset': formset,
        "sections": sections,
        "editing": order_id is not None,
        "price_map": price_map,
    })

from django.shortcuts import render
from django.http import JsonResponse
from .models import Table
from .forms import TableForm

# def order_dashboard(request):
#     tables = Table.objects.all().order_by('table_number')
#     table_form = TableForm()

#     if request.method == "POST" and request.headers.get("X-Requested-With") == "XMLHttpRequest":
#         form = TableForm(request.POST)
#         if form.is_valid():
#             table = form.save()
#             return JsonResponse({
#                 "success": True,
#                 "table_number": table.table_number,
#                 "table_id": table.table_id
#             })
#         else:
#             return JsonResponse({
#                 "success": False,
#                 "errors": form.errors
#             }, status=400)

#     return render(request, 'loginauth/order_dashboard.html', {
#         "tables": tables,
#         "table_form": table_form,
#     })


def order_dashboard(request):
    tables = Table.objects.all()
    return render(request, 'loginauth/order_dashboard.html', {'tables': tables})

def add_table(request):
    if request.method == 'POST':
        form = TableForm(request.POST)
        if form.is_valid():
            form.save()
    return redirect('order_dashboard')



def order_delete(request, order_item_id):
    order = get_object_or_404(OrderItem,order_item_id=order_item_id)
    order.delete()
    print("🔹 Order deleted:", order_item_id)
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':  # Handle AJAX request
        return JsonResponse({"message": "Order deleted successfully!", "redirect_url": "/orders/"})
    return redirect('order_list')


def get_items_by_section(request):
    section = request.GET.get('section')
    items = MenuItem.objects.filter(section=section).values('item_id', 'item_name')
    return JsonResponse(list(items), safe=False)



from .models import KitchenOrderTicket, KitchenOrderItem
from .forms import KitchenOrderUpdateForm
from django.db.models import Case, When, Value, IntegerField


def create_kot(order_id):
    order = get_object_or_404(Order, order_id=order_id)
    kot = KitchenOrderTicket.objects.create(order=order)

    order_items = OrderItem.objects.filter(order=order)
    for item in order_items:
        KitchenOrderItem.objects.create(
            kot=kot,
            order_item=item,
            item=item.item,
            quantity=item.quantity,
            special_notes=item.notes
        )
    return kot


def kitchen_orders(request):
    kot_orders = KitchenOrderTicket.objects.all().order_by(
        Case(
            When(status="pending", then=Value(1)),
            When(status="preparing", then=Value(2)),
            When(status="completed", then=Value(3)),
            
            output_field=IntegerField(),
        )
    )
    return render(request, 'loginauth/kitchen_orders.html', {'kot_orders': kot_orders})




def update_kot_status(request, kot_id):
    kot = get_object_or_404(KitchenOrderTicket, kot_id=kot_id)
    if request.method == "POST":
        new_status = request.POST.get("status")
        kot.status = new_status
        kot.save()
        return JsonResponse({"success": True})
    return JsonResponse({"success": False})




from django.http import JsonResponse
from .models import Bill
from .forms import BillForm
from django.urls import reverse

def generate_bill(request):
    if request.method == 'POST':
        form = BillForm(request.POST)
        if form.is_valid():
            bill = form.save()
            print("🔹 Bill generated:", bill.bill_id)
            bill_url = reverse('view_bill', args=[bill.bill_id])
            print("🔹 Bill URL:", bill_url)
            return JsonResponse({'success': True, 'redirect_url': bill_url})
        else:
            return JsonResponse({'success': False, 'errors': form.errors})
    else:
        form = BillForm()
    return render(request, 'loginauth/generate_bill.html', {'form': form})



def view_bill(request, bill_id):
    bill = get_object_or_404(Bill, pk=bill_id)
    order_items = []

    completed_kots = bill.kot.filter(status='completed')

    for kot in completed_kots:
        order_items.extend(kot.order.items.all())

    subtotal = sum(item.total_price for item in order_items)
    total = subtotal

    context = {
        'bill': bill,
        'order_items': order_items,
        'subtotal': subtotal,
        'total': total,
        'restaurant_name': "The Grand Restaurant",
        'gstin_number': "29ABCDE1234F2Z5",
    }
    return render(request, 'loginauth/view_bill.html', context)



from .models import Item, StockIn, StockOut, Supplier
from .forms import ItemForm, StockInForm, StockOutForm, SupplierForm

def add_supplier(request):
    if request.method == 'POST':
        form = SupplierForm(request.POST)
        if form.is_valid():
            form.save()
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':  # Check if AJAX request
                return JsonResponse({"message": "Supplier added successfully!", "redirect_hash": "Supplier_list"})
            return redirect('supplier_staff_list')
    else:
        form = SupplierForm()
    return render(request, 'loginauth/supplier.html', {'form': form, 'title': 'Add Supplier'})



def inventory_item(request):
    items = Item.objects.all()
    return render(request, 'loginauth/inventory_item.html', {'items': items})

def add_item(request):
    if request.method == 'POST':
        form = ItemForm(request.POST)
        if form.is_valid():
            form.save()
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':  # Check if AJAX request
                return JsonResponse({"message": "StockItem added successfully!", "redirect_hash": "Inventory_item"})
            return redirect('inventory_item')
    else:
        form = SupplierForm()
    return render(request, 'loginauth/inventory_stockitem.html', {'form': form, 'title': 'Add Stock Item'})

def add_stock_in(request):
    if request.method == 'POST':
        form = StockInForm(request.POST)
        
        if form.is_valid():
            stock = form.save()
            stock.item.current_quantity += stock.quantity
            stock.item.save()
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':  # Check if AJAX request
                return JsonResponse({"message": "StockIn added successfully!", "redirect_hash": "Inventory_item"})
            return redirect('inventory_item')
    else:
        form = StockInForm()
    return render(request, 'loginauth/add_stock.html', {'form': form, 'title': 'Add Stock In'})



# from django.shortcuts import render, redirect
# from django.forms import formset_factory
# from django.utils.timezone import now
# from django.utils import timezone
# from .models import StockIn, Supplier, Item
# from .forms import StockInForm  # Custom form for item, quantity, unit_price, total_price

# # Create a formset for multiple entries
# StockInItemFormSet = formset_factory(StockInForm, extra=1)

# def add_stock_in(request):
#     if request.method == 'POST':
#         formset = StockInItemFormSet(request.POST)
#         supplier_id = request.POST.get('supplier')
#         timestamp = timezone.now()  # Server timezone

#         if formset.is_valid() and supplier_id:
#             supplier = Supplier.objects.get(id=supplier_id)

#             for form in formset:
#                 cd = form.cleaned_data
#                 if cd.get('item') and cd.get('quantity') > 0:
#                     stock = StockIn.objects.create(
#                         item=cd['item'],
#                         quantity=cd['quantity'],
#                         unit_price=cd['unit_price'],
#                         total_price=cd['total_price'],
#                         supplier=supplier,
#                         date=timestamp
#                     )
#                     # Update current quantity in item
#                     stock.item.current_quantity += stock.quantity
#                     stock.item.save()

#             if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
#                 return JsonResponse({
#                     "message": "StockIN added successfully!",
#                     "redirect_hash": "Inventory_item"
#                 })
#             return redirect('inventory_item')  # Change to your URL name
#     else:
#         formset = StockInItemFormSet()

#     return render(request, 'loginauth/add_stock.html', {
#         'formset': formset,
#         'suppliers': Supplier.objects.all(),
#         'current_time': now().strftime('%Y-%m-%dT%H:%M'),  # HTML5 input[type="datetime-local"]
#         'title': 'Add Stock In',
#     })




from django.forms import modelformset_factory
from datetime import datetime
from django.utils import timezone
def add_stock_out(request):
    StockOutFormSet = modelformset_factory(StockOut, form=StockOutForm, extra=1, can_delete=False)

    if request.method == 'POST':
        formset = StockOutFormSet(request.POST)

        # Handle common date
        common_date_str = request.POST.get("date")
        try:
            common_date = datetime.strptime(common_date_str, "%Y-%m-%dT%H:%M") if common_date_str else timezone.now()
        except ValueError:
            common_date = timezone.now()

        if formset.is_valid():
            print("✅ Formset is valid. Saving data...")
            for form in formset:
                stock = form.save(commit=False)
                stock.date = common_date  # Set common date
                stock.item.current_quantity -= stock.quantity
                stock.item.save()
                stock.save()

            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    "message": "StockOut added successfully!",
                    "redirect_hash": "Inventory_item"
                })
            return redirect('inventory_item')

        elif request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({"success": False, "errors": formset.errors})

    else:
        formset = StockOutFormSet(queryset=StockOut.objects.none())

    return render(request, 'loginauth/stock_out.html', {
        'formset': formset
        
    })

def combined_list(request):
    waiters = Waiter.objects.all()
    suppliers = Supplier.objects.all()
    return render(request, 'loginauth/supplier_staff_list.html', {
        'waiters': waiters,
        'suppliers': suppliers,
    })




# def inventory_history(request):
#     items = Item.objects.all()
#     stockin_records = []
#     stockout_records = []

#     item_id = request.GET.get('item')
#     from_date = request.GET.get('from_date')
#     to_date = request.GET.get('to_date')
#     stock_type = request.GET.get('stock_type')

#     if item_id and from_date and to_date:
#         if stock_type in ['in', 'both']:
#             stockin_records = StockIn.objects.filter(
#                 item_id=item_id,
#                 date__range=[from_date, to_date]
#             )
#         if stock_type in ['out', 'both']:
#             stockout_records = StockOut.objects.filter(
#                 item_id=item_id,
#                 date__range=[from_date, to_date]
#             )

#     return render(request, 'loginauth/inventory_history.html', {
#         'items': items,
#         'stockin_records': stockin_records,
#         'stockout_records': stockout_records
#     })


from django.shortcuts import render
from django.http import JsonResponse
from django.template.loader import render_to_string
from .models import StockIn, StockOut
from django.utils.dateparse import parse_datetime, parse_date
from django.db.models import Q

def stock_history(request, item_id):
    stock_in_entries = StockIn.objects.filter(item_id=item_id).order_by('-date')
    stock_out_entries = StockOut.objects.filter(item_id=item_id).order_by('-date')

    return render(request, 'loginauth/inventory_history.html', {
        'item_id': item_id,
        'stock_in_entries': stock_in_entries,
        'stock_out_entries': stock_out_entries,
    })

def inventory_history_table(request):
    from_date = request.GET.get('from_date')
    to_date = request.GET.get('to_date')
    stock_type = request.GET.get('stock_type')
    item_id= request.GET.get('item_id')

    stock_in_entries = StockIn.objects.filter(item_id=item_id)
    stock_out_entries = StockOut.objects.filter(item_id=item_id)

    if from_date:
        from_date_obj = parse_date(from_date)
        if from_date_obj:
            stock_in_entries = stock_in_entries.filter(date__date__gte=from_date_obj)
            stock_out_entries = stock_out_entries.filter(date__date__gte=from_date_obj)

    if to_date:
        to_date_obj = parse_date(to_date)
        if to_date_obj:
            stock_in_entries = stock_in_entries.filter(date__date__lte=to_date_obj)
            stock_out_entries = stock_out_entries.filter(date__date__lte=to_date_obj)

    if stock_type == 'in':
        stock_out_entries = StockOut.objects.none()
    elif stock_type == 'out':
        stock_in_entries = StockIn.objects.none()

    item_name = ""
    try:
        item = Item.objects.get(id=item_id)
        item_name = item.name
    except Item.DoesNotExist:
        item_name = "Unknown Item"

    html = render_to_string('loginauth/history_table.html', {
        'stock_in_entries': stock_in_entries,
        'stock_out_entries': stock_out_entries,
        'item_name': item_name
    })
    return JsonResponse({'html': html})
    





















from django.http import JsonResponse
from .models import MenuItem

def get_items_by_section(request):
    section = request.GET.get('section')
    items = MenuItem.objects.filter(section=section).values('item_id', 'item_name')
    return JsonResponse(list(items), safe=False)

def get_item_price(request):
    item_id = request.GET.get('item_id')
    try:
        item = MenuItem.objects.get(pk=item_id)
        return JsonResponse({'price': float(item.price)})
    except MenuItem.DoesNotExist:
        return JsonResponse({'price': 0})
    


