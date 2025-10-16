from django.contrib.auth.models import AbstractUser
from django.utils.timezone import now
from django.db import models

class CustomUser(AbstractUser):
    """
    Extends Django's AbstractUser to add custom fields for a restaurant management system.
    """
    
    username = models.CharField(
        max_length=100,  # Set a custom maximum length if needed
        unique=True,
           # Ensure the username is unique
        error_messages={
            'unique': "A user with that username already exists.",
        },)
    
    email = models.EmailField(unique=True)       # Ensures email is unique
    password= models.CharField(max_length= 200, unique=True)
    
    phone_number = models.CharField(max_length=20, blank=True, null=True)  # Optional phone number
    restaurant_name = models.CharField(max_length=100, blank=True, null=True)  # Name of the restaurant (optional)

    def __str__(self):
        return f"{self.username} - {self.restaurant_name or 'No Restaurant'}"



class Waiter(models.Model):
    waiter_id = models.AutoField(primary_key=True)
    waiter_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15)
    hire_date = models.DateField()

    def __str__(self):
        return self.waiter_name
    

class Table(models.Model):
    
    table_id = models.AutoField(unique=True, primary_key=True)
    table_number = models.CharField(max_length=10, unique=True)  # Unique identifier for the table

    
    def __str__(self):
        return self.table_number
    



class MenuItem(models.Model):
    CATEGORY_CHOICES = [
        ('Veg', 'Vegetarian'),
        ('Non-Veg', 'Non-Vegetarian'),
    ]

    SECTION_CHOICES = [
        ('Starter', 'Starter'),
        ('Main Course', 'Main Course'),
        ('Drinks', 'Drinks'),
        ('Desserts', 'Desserts'),
    ]

    item_id = models.AutoField(primary_key=True, unique=True)
    item_name = models.CharField(max_length=255)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES)
    section = models.CharField(max_length=20, choices=SECTION_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='menu_images/')  # Upload to 'media/menu_images/'

    def __str__(self):
        return f"{self.item_name} - {self.item_id}"
    

class Order(models.Model):
    ORDER_TYPES = [
        ('dinein', 'Dine In'),
        ('takeaway', 'Take Away'),
    ]
    order_id = models.AutoField(primary_key=True)
    order_type = models.CharField(max_length=10, choices=ORDER_TYPES)
    table_number = models.CharField(max_length=10)
    waiter = models.ForeignKey(Waiter, on_delete=models.CASCADE)
    order_time = models.DateTimeField(default=now)

    def __str__(self):
        return f"Order {self.order_id} - {self.order_type}"


class OrderItem(models.Model):
    order_item_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    notes = models.TextField(blank=True, null=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    gst_rate = models.DecimalField(max_digits=5, decimal_places=2, default=5.0)  # Default GST 5%
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        self.unit_price = self.item.price 
        self.total_price = self.quantity * self.unit_price * (1 + self.gst_rate / 100)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.item.item_name} - {self.quantity}"
    


class KitchenOrderTicket(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('preparing', 'Preparing'),
        ('completed', 'Completed'),
    ]

    kot_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='kot')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"KOT {self.kot_id} - {self.status}"

class KitchenOrderItem(models.Model):
    kot = models.ForeignKey(KitchenOrderTicket, on_delete=models.CASCADE, related_name='items')
    order_item = models.ForeignKey(OrderItem, on_delete=models.CASCADE)
    item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    special_notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.item.item_name} - {self.quantity}"


class Bill(models.Model):
    bill_id = models.AutoField(primary_key=True)
    kot = models.ManyToManyField(KitchenOrderTicket)
    mode_of_payment = models.CharField(max_length=50)
    bill_date = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)  # Save first so we can access m2m later

        # Calculate total from all KOTs' order items
        total = 0
        for kot in self.kot.all():
            order_items = kot.order.items.all()
            total += sum(item.total_price for item in order_items)
        self.total_amount = total

        # Save again to update total_amount
        super().save(update_fields=['total_amount'])

    def __str__(self):
        kot_ids = ', '.join(str(k.kot_id) for k in self.kots.all())
        return f"Bill {self.bill_id} for KOT(s) {kot_ids}"
    


# Inventory Management Models
from django.db import models
from django.utils import timezone



# Supplier information
class Supplier(models.Model):
    name = models.CharField(max_length=100)
    contact_no = models.CharField(max_length=100)
    category = models.CharField(max_length=100, null=True, blank=True)
    address = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

# Inventory item (stock)
class Item(models.Model):
    UNIT_CHOICES = [
        ('kg', 'Kilogram'),
        ('ltr', 'Litre'),
        ('pcs', 'Pieces'),
        ('pkt', 'Packet'),
        ('dozen', 'Dozen')
    ]

    name = models.CharField(max_length=100)
    unit = models.CharField(max_length=10, choices=UNIT_CHOICES)
    current_quantity = models.FloatField(default=0)
    reorder_level = models.FloatField(default=0)
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return self.name

    def is_below_reorder(self):
        return self.current_quantity <= self.reorder_level

# Record of stock received (stock-in)
class StockIn(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.FloatField()
    date = models.DateTimeField(default=timezone.now)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Stock In: {self.item.name} - {self.quantity} {self.item.unit}"

# Record of stock used (stock-out)
class StockOut(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.FloatField()
    date = models.DateTimeField(default=timezone.now)
    used_for = models.CharField(max_length=255, blank=True, null=True)  # e.g., Dish name or event

    def __str__(self):
        return f"Stock Out: {self.item.name} - {self.quantity} {self.item.unit}"