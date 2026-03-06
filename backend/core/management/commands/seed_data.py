from django.core.management.base import BaseCommand
from branches.models import Branch
from products.models import Category, Product, Inventory
from django.contrib.auth import get_user_model
from core.models import StaffProfile
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Seed initial data for the thrift platform'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        # Create Branches
        branches_data = [
            {'name': 'Nairobi CBD', 'location': 'Nairobi CBD, Kimathi Street'},
            {'name': 'Westlands', 'location': 'Westlands, Sarit Centre'},
            {'name': 'Kasarani', 'location': 'Kasarani, Season'},
            {'name': 'Mombasa', 'location': 'Mombasa, Nyali'},
        ]
        
        branches = []
        for b_data in branches_data:
            branch, created = Branch.objects.get_or_create(name=b_data['name'], defaults={'location': b_data['location']})
            branches.append(branch)
            if created:
                self.stdout.write(f'Created branch: {branch.name}')

        # Create Categories
        categories_data = ['Men Clothes', 'Women Clothes', 'Kids Clothes', 'Shoes', 'Ex-UK Bales']
        categories = []
        for c_name in categories_data:
            category, created = Category.objects.get_or_create(name=c_name, slug=c_name.lower().replace(' ', '-'))
            categories.append(category)
            if created:
                self.stdout.write(f'Created category: {category.name}')

        # Create a SuperAdmin
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={'email': 'admin@budgetwear.com', 'is_staff_member': True, 'is_superuser': True}
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            StaffProfile.objects.create(user=admin_user, branch=branches[0], role='SuperAdmin')
            self.stdout.write('Created SuperAdmin: admin/admin123')

        # Create some products
        for i in range(20):
            branch = random.choice(branches)
            category = random.choice(categories)
            product = Product.objects.create(
                branch=branch,
                category=category,
                name=f"Product {i+1} in {category.name}",
                description=f"High quality {category.name} from UK.",
                price=random.randint(500, 5000),
                condition='Good'
            )
            Inventory.objects.create(branch=branch, product=product, quantity=random.randint(1, 10), size='M')
            
        self.stdout.write(self.style.SUCCESS('Successfully seeded initial data'))
