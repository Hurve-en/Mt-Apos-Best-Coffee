/// <reference types="node" />
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Starting database seed...');

  try {
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.productCustomization.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});

    console.log('✅ Cleared existing data');

    const hashedPassword = await bcrypt.hash('password123', 10);

    const customer1 = await prisma.user.create({
      data: {
        email: 'customer1@coffeeorder.com',
        password: hashedPassword,
        name: 'John Doe',
        phone: '5551234567',
        address: '789 Customer Rd',
        city: 'Chicago',
        postalCode: '60601'
      }
    });

    const customer2 = await prisma.user.create({
      data: {
        email: 'customer2@coffeeorder.com',
        password: hashedPassword,
        name: 'Jane Smith',
        phone: '5559876543',
        address: '321 Customer Ln',
        city: 'Houston',
        postalCode: '77001'
      }
    });

    console.log('✅ Created 2 test users');

    const espresso = await prisma.product.create({
      data: {
        name: 'Espresso',
        description: 'Strong and concentrated coffee',
        price: 2.50,
        category: 'Espresso',
        image: '/images/espresso.jpg',
        isAvailable: true
      }
    });

    const cappuccino = await prisma.product.create({
      data: {
        name: 'Cappuccino',
        description: 'Espresso with steamed milk and foam',
        price: 4.00,
        category: 'Milk Coffee',
        image: '/images/cappuccino.jpg',
        isAvailable: true
      }
    });

    const latte = await prisma.product.create({
      data: {
        name: 'Latte',
        description: 'Espresso with steamed milk',
        price: 4.00,
        category: 'Milk Coffee',
        image: '/images/latte.jpg',
        isAvailable: true
      }
    });

    const mocha = await prisma.product.create({
      data: {
        name: 'Mocha',
        description: 'Espresso with chocolate and milk',
        price: 4.50,
        category: 'Specialty',
        image: '/images/mocha.jpg',
        isAvailable: true
      }
    });

    await prisma.product.create({
      data: {
        name: 'Americano',
        description: 'Espresso with hot water',
        price: 3.00,
        category: 'Espresso',
        image: '/images/americano.jpg',
        isAvailable: true
      }
    });

    await prisma.product.create({
      data: {
        name: 'Macchiato',
        description: 'Espresso with a dash of milk',
        price: 3.50,
        category: 'Espresso',
        image: '/images/macchiato.jpg',
        isAvailable: true
      }
    });

    console.log('✅ Created 6 test products');

    await prisma.productCustomization.createMany({
      data: [
        { productId: cappuccino.id, type: 'size', name: 'Small (8oz)', priceAdd: 0 },
        { productId: cappuccino.id, type: 'size', name: 'Medium (12oz)', priceAdd: 0.5 },
        { productId: cappuccino.id, type: 'size', name: 'Large (16oz)', priceAdd: 1.0 },
        { productId: latte.id, type: 'milk', name: 'Whole Milk', priceAdd: 0 },
        { productId: latte.id, type: 'milk', name: 'Almond Milk', priceAdd: 0.5 },
        { productId: latte.id, type: 'milk', name: 'Oat Milk', priceAdd: 0.5 },
        { productId: latte.id, type: 'milk', name: 'Soy Milk', priceAdd: 0.5 },
        { productId: mocha.id, type: 'extra', name: 'Extra Shot', priceAdd: 0.75 },
        { productId: mocha.id, type: 'extra', name: 'Whipped Cream', priceAdd: 0.5 },
        { productId: mocha.id, type: 'extra', name: 'Chocolate Drizzle', priceAdd: 0.5 }
      ]
    });

    console.log('✅ Created product customizations');

    await prisma.order.create({
      data: {
        customerId: customer1.id,
        status: 'DELIVERED',
        totalPrice: 8.50,
        deliveryAddress: '789 Customer Rd, Chicago, IL 60601',
        items: {
          create: [
            {
              productId: cappuccino.id,
              quantity: 2,
              price: 4.00,
              customizations: 'Size: Large, Milk: Oat Milk'
            },
            {
              productId: espresso.id,
              quantity: 1,
              price: 2.50,
              customizations: 'Size: Small'
            }
          ]
        }
      }
    });

    await prisma.order.create({
      data: {
        customerId: customer2.id,
        status: 'PENDING',
        totalPrice: 12.00,
        deliveryAddress: '321 Customer Ln, Houston, TX 77001',
        items: {
          create: [
            {
              productId: latte.id,
              quantity: 2,
              price: 4.00,
              customizations: 'Milk: Almond Milk'
            },
            {
              productId: mocha.id,
              quantity: 2,
              price: 4.50,
              customizations: 'Extra: Whipped Cream'
            }
          ]
        }
      }
    });

    console.log('✅ Created sample orders');

    console.log('\n🌱 Database seeded successfully!\n');
    console.log('Test Accounts:');
    console.log('  User: customer1@coffeeorder.com / password123');
    console.log('  User: customer2@coffeeorder.com / password123');
    console.log('\n✨ Ready to use!\n');
  } catch (e) {
    console.error('❌ Seed error:', e);
    throw e;
  }
}

main()
  .catch((e: unknown) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });