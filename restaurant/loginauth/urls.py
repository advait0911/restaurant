from django.urls import path
from django.contrib.auth.views import LoginView, LogoutView
from . import views

urlpatterns = [
    path('register/', views.register_view, name='register'),
    path('', LoginView.as_view(redirect_authenticated_user=True, template_name='loginauth/login.html'), name='login'),
    path('logout/', LogoutView.as_view(next_page='login'), name='logout'),
    path('dashboard/', views.dashboard_view, name='dashboard'),  # Dashboard view
   
   
    path('add_waiter/', views.add_waiter, name='add_waiter'),
    path('add_menu/', views.add_menu, name='add_menu'),
    path('menu_show/', views.show_menu, name='menu_show'),

    
    path('orders/', views.order_list, name='order_list'),
    path('orders/new/', views.create_order, name='create_order'),
    path('orders/edit/<int:order_id>/', views.create_order, name='edit_order'),
    path('orders/delete/<int:order_item_id>/', views.order_delete, name='delete_order'), 

    path('orders/dashboard/', views.order_dashboard, name='order_dashboard'),
    # path('orders/print_bill/<int:table_id>/', views.print_bill, name='print_bill'),
    path('orders/add_table/', views.add_table, name='add_table'),



    path('kitchen_orders/', views.kitchen_orders, name='kitchen_orders'),
    path('update-kot-status/<int:kot_id>/', views.update_kot_status, name='update_kot_status'),


    path('generate_bill/', views.generate_bill, name='generate_bill'),
    path('view_bill/<int:bill_id>/', views.view_bill, name='view_bill'),

    path('get-items-by-section/', views.get_items_by_section, name='get_items_by_section'),
    path('ajax/get-item-price/', views.get_item_price, name='get_item_price'),

    path('inventory_item/', views.inventory_item, name='inventory_item'),
    path('inventory_stockitem/', views.add_item, name='add_item'),
    path('add_stock/', views.add_stock_in, name='add_stock_in'),
    path('stock_out/', views.add_stock_out, name='add_stock_out'),
    

    path('supplier/', views.add_supplier, name='add_supplier'),
   

    path('supplier_staff_list/', views.combined_list, name='combined_list'),
    # path('inventory_history/', views.inventory_history, name='inventory_history'),
    path('inventory_history/<int:item_id>/', views.stock_history, name='stock_history'),
    path('history_table/', views.inventory_history_table, name='inventory_history_table'),
]






