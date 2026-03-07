import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Clearing database...');
    await prisma.productImage.deleteMany();
    await prisma.wishlist.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.branch.deleteMany();

    console.log('Seeding Branches...');
    const nairobi = await prisma.branch.create({
        data: { name: 'Nairobi Branch', location: 'Nairobi CBD', type: 'thrift_store' }
    });
    const mombasa = await prisma.branch.create({
        data: { name: 'Mombasa Branch', location: 'Nyali', type: 'thrift_store' }
    });
    const nakuru = await prisma.branch.create({
        data: { name: 'Nakuru Branch', location: 'Nakuru Town', type: 'thrift_store' }
    });
    const eldoret = await prisma.branch.create({
        data: { name: 'Eldoret Branch', location: 'Eldoret Town', type: 'thrift_store' }
    });
    const babyShop = await prisma.branch.create({
        data: { name: 'Baby Shop Branch', location: 'Nairobi Mall', type: 'baby_shop' }
    });

    console.log('Seeding Categories...');
    const catMen = await prisma.category.create({ data: { name: 'Men' } });
    const catWomen = await prisma.category.create({ data: { name: 'Women' } });
    const catKids = await prisma.category.create({ data: { name: 'Kids' } });
    const catShoes = await prisma.category.create({ data: { name: 'Shoes' } });
    const catBales = await prisma.category.create({ data: { name: 'Bales' } });
    const catBabyClothes = await prisma.category.create({ data: { name: 'Baby Clothes' } });
    const catBabyShoes = await prisma.category.create({ data: { name: 'Baby Shoes' } });
    const catBabyToys = await prisma.category.create({ data: { name: 'Baby Toys' } });

    console.log('Seeding Products...');

    const products = [
        { name: 'Blue Denim Jacket', price: 2500, description: 'High-quality UK imported denim jacket. Comfortable, durable, and stylish for casual wear. Perfect for cool weather and everyday outfits.', branchId: nairobi.id, categoryId: catMen.id },
        { name: 'Nike Air Sneakers', price: 3200, description: 'Comfortable and stylish sneakers.', branchId: nakuru.id, categoryId: catShoes.id },
        { name: 'Red Summer Dress', price: 2100, description: 'Light and breezy dress for warm days.', branchId: mombasa.id, categoryId: catWomen.id },
        { name: 'Kids Winter Jacket', price: 1500, description: 'Warm jacket for kids.', branchId: eldoret.id, categoryId: catKids.id },
        { name: 'Baby Cotton Romper', price: 800, description: 'Soft cotton romper for babies.', branchId: babyShop.id, categoryId: catBabyClothes.id },
        { name: 'Baby Walking Shoes', price: 900, description: 'Sturdy shoes for first steps.', branchId: babyShop.id, categoryId: catBabyShoes.id },
        { name: 'Toy Teddy Bear', price: 600, description: 'Plush teddy bear toy.', branchId: babyShop.id, categoryId: catBabyToys.id },
        { name: 'Leather Jacket', price: 4500, description: 'Classic black leather jacket.', branchId: nairobi.id, categoryId: catMen.id },
        { name: 'Floral Skirt', price: 1200, description: 'Beautiful floral print skirt.', branchId: mombasa.id, categoryId: catWomen.id },
        { name: 'Running Shoes', price: 2800, description: 'Lightweight running shoes.', branchId: nairobi.id, categoryId: catShoes.id },
        { name: 'Men Suit Bale', price: 15000, description: 'Bale of assorted men suits.', branchId: nakuru.id, categoryId: catBales.id },
        { name: 'Women Tops Bale', price: 12000, description: 'Bale of assorted women tops.', branchId: eldoret.id, categoryId: catBales.id },
        { name: 'Kids Shoes Bale', price: 18000, description: 'Bale of assorted kids shoes.', branchId: nairobi.id, categoryId: catBales.id },
        { name: 'Baby Beanie', price: 300, description: 'Warm beanie for babies.', branchId: babyShop.id, categoryId: catBabyClothes.id },
        { name: 'Baby Socks Pack', price: 400, description: 'Pack of 5 pairs of baby socks.', branchId: babyShop.id, categoryId: catBabyClothes.id },
        { name: 'Building Blocks', price: 1500, description: 'Educational building blocks set.', branchId: babyShop.id, categoryId: catBabyToys.id },
        { name: 'Denim Jeans Men', price: 1800, description: 'Classic blue denim jeans.', branchId: mombasa.id, categoryId: catMen.id },
        { name: 'Evening Gown', price: 5500, description: 'Elegant evening gown.', branchId: nairobi.id, categoryId: catWomen.id },
        { name: 'Formal Shoes', price: 3500, description: 'Black formal leather shoes.', branchId: nakuru.id, categoryId: catShoes.id },
        { name: 'Kids T-Shirt', price: 500, description: 'Cotton t-shirt for kids.', branchId: eldoret.id, categoryId: catKids.id },
        { name: 'Baby Blankets Set', price: 2000, description: 'Set of 3 soft baby blankets.', branchId: babyShop.id, categoryId: catBabyClothes.id }
    ];

    for (const p of products) {
        await prisma.product.create({
            data: {
                name: p.name,
                price: p.price,
                description: p.description,
                branch_id: p.branchId,
                category_id: p.categoryId,
                stock: Math.floor(Math.random() * 20) + 1,
                images: {
                    create: [
                        { image_url: 'https://placehold.co/600x400/png', position: 0 },
                        { image_url: 'https://placehold.co/600x400/png', position: 1 },
                    ]
                }
            }
        });
    }

    console.log('Seeding Complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
