# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-11-15 13:18
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('take', '0002_auto_20161106_1857'),
    ]

    operations = [
        migrations.AddField(
            model_name='response',
            name='name',
            field=models.TextField(default='default_name', verbose_name='student name'),
            preserve_default=False,
        ),
    ]
