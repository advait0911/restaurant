from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import Order, OrderItem
from .models import Waiter
from .models import MenuItem
from .models import CustomUser
from .models import KitchenOrderTicket
from .models import Bill

class RegisterForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'phone_number', 'restaurant_name', 'password1', 'password2']

class LoginForm(AuthenticationForm):
    class Meta:
        model = CustomUser
        fields = ['username', 'password']


class WaiterForm(forms.ModelForm):
    class Meta:
        model = Waiter
        fields = ['waiter_id', 'waiter_name', 'email', 'phone_number', 'hire_date']


class MenuItemForm(forms.ModelForm):
    class Meta:
        model = MenuItem
        fields = ['item_name', 'category', 'section', 'price', 'image']

        

from .models import Table 
class TableForm(forms.ModelForm):
    class Meta:
        model = Table
        fields = [ 'table_number']





class OrderForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = ['order_type', 'table_number', 'waiter' , 'order_time']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['order_time'].widget.attrs['readonly'] = True

class OrderItemForm(forms.ModelForm):
    class Meta:
        model = OrderItem
        fields = ['item', 'quantity', 'notes' , 'gst_rate', 'unit_price', 'total_price']
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['unit_price'].widget.attrs['readonly'] = True
        self.fields['total_price'].widget.attrs['readonly'] = True
    
        self.fields['item'].widget.attrs.update({'class': 'menu-item-select'})

        # Attach data-price to each <option>
        choices = []
        for item in self.fields['item'].queryset:
            choices.append((item.pk, f"{item.item_name} - {item.item_id}"))
        self.fields['item'].choices = choices

        # Store price data in widget attrs for JS (workaround — not rendered in select, handled in JS)
        self.price_map = {str(item.pk): float(item.price) for item in self.fields['item'].queryset}


class KitchenOrderUpdateForm(forms.ModelForm):
    class Meta:
        model = KitchenOrderTicket
        fields = ['status']
        widgets = {
            'status': forms.Select(choices=KitchenOrderTicket.STATUS_CHOICES, attrs={'class': 'form-control'})
        }


class BillForm(forms.ModelForm):
    class Meta:
        model = Bill
        fields = ['kot', 'mode_of_payment']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Only show completed KOTs in the dropdown
        self.fields['kot'].queryset = KitchenOrderTicket.objects.filter(status='completed')

    
from django import forms
from .models import Item, StockIn, StockOut, Supplier

class SupplierForm(forms.ModelForm):
    class Meta:
        model = Supplier
        fields = ['name', 'category', 'contact_no', 'address']

class ItemForm(forms.ModelForm):
    class Meta:
        model = Item
        fields = ['name', 'unit', 'current_quantity', 'reorder_level']

class StockInForm(forms.ModelForm):
    class Meta:
        model = StockIn
        fields = ['item', 'quantity', 'supplier', 'date', 'unit_price', 'total_price']
        widgets = {
            'date': forms.DateTimeInput(attrs={'type': 'datetime-local', 'readonly': 'readonly', 'id': 'date'}),
            'total_price': forms.NumberInput(attrs={'readonly': 'readonly'}),
        }

class StockOutForm(forms.ModelForm):
    class Meta:
        model = StockOut
        fields = ['item', 'quantity',  'used_for']
        