# Generated manually

from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_branch_map_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='flashsale',
            name='image_url',
            field=models.URLField(blank=True, max_length=500, null=True),
        ),
    ]
