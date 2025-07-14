import { MongoClient } from 'mongodb';  

async function run() {
    const uri = "mongodb+srv://admin:123@cluster0.hpnby.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db("test");
        const orders = [];

        for (let i = 1; i <= 100; i++) {
            const orderId = "ORD" + String(10 + i).padStart(4, '0');
            const startTimestamp = new Date(2025, 0, 1).getTime();
            const endTimestamp = new Date(2025, 6, 31).getTime();
            const randomStart = new Date(startTimestamp + Math.random() * (endTimestamp - startTimestamp));
            const randomEnd = new Date(randomStart.getTime() + (7 * 24 * 60 * 60 * 1000));
            const randomOrderDate = new Date(randomStart.getTime() - Math.floor(Math.random() * 3 * 24 * 60 * 60 * 1000));

            orders.push({
                orderId: orderId,
                orderedItems: [
                    {
                        product: {
                            key: "SND004",
                            name: "25W Megaphone with Detachable Microphone",
                            image: "https://ibwnaajpdtcqzmgrhsyf.supabase.co/storage/v1/object/public/images/1744450781436Megaphone-rent.webp",
                            price: 2500
                        },
                        quantity: 2
                    },
                    {
                        product: {
                            key: "SND006",
                            name: "Road Reader 2.8 Audio Amplifier",
                            image: "https://ibwnaajpdtcqzmgrhsyf.supabase.co/storage/v1/object/public/images/1744451151843Website-Product-Images1-2.webp",
                            price: 1500
                        },
                        quantity: 2
                    }
                ],
                days: 7,
                startingDate: randomStart,
                endingDate: randomEnd,
                totalCost: 56000,
                orderStatus: false,
                status: "Pending",
                email: "user@mail.com",
                orderDate: randomOrderDate,
                __v: 0
            });
        }

        await db.collection('orders').insertMany(orders);
        console.log("Inserted 100 orders successfully!");
    } finally {
        await client.close();
    }
}

run().catch(console.dir);