const db = require('../config/database');
const { findIngredient, updateIngredientQuantity } = require('../data/ingredients');

// Helper function to check ingredients availability
const checkIngredientsAvailability = async (orderItems) => {
    for (const item of orderItems) {
        const { ingredientId, quantity = 1 } = item;
        const ingredient = await findIngredient(ingredientId);
        
        if (!ingredient) {
            return {
                available: false,
                message: `Ingredient ${ingredientId} not found`
            };
        }
        
        if (ingredient.quantity < quantity) {
            return {
                available: false,
                message: `Not enough ${ingredient.name} in stock. Available: ${ingredient.quantity}`
            };
        }
    }
    
    return { available: true };
};

// Helper function to deduct ingredients
const deductIngredients = async (orderItems) => {
    for (const { ingredientId, quantity = 1 } of orderItems) {
        const ingredient = await findIngredient(ingredientId);
        await updateIngredientQuantity(ingredientId, ingredient.quantity - quantity);
    }
};

const createOrder = async (orderItems) => {
    // Start a transaction
    const client = await db.pool.connect();
    
    try {
        await client.query('BEGIN');

        // Check availability
        const availabilityCheck = await checkIngredientsAvailability(orderItems);
        if (!availabilityCheck.available) {
            throw new Error(availabilityCheck.message);
        }

        // Create new order
        const orderResult = await client.query(
            'INSERT INTO orders (status) VALUES ($1) RETURNING *',
            ['preparing']
        );
        const order = orderResult.rows[0];

        // Create order items
        for (const item of orderItems) {
            await client.query(
                'INSERT INTO order_items (order_id, ingredient_id, quantity) VALUES ($1, $2, $3)',
                [order.id, item.ingredientId, item.quantity || 1]
            );
        }

        // Deduct ingredients
        await deductIngredients(orderItems);

        await client.query('COMMIT');

        return {
            ...order,
            items: orderItems
        };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const getOrder = async (orderId) => {
    const orderResult = await db.query(
        'SELECT * FROM orders WHERE id = $1',
        [orderId]
    );

    if (orderResult.rows.length === 0) {
        throw new Error('Order not found');
    }

    const order = orderResult.rows[0];

    const itemsResult = await db.query(
        'SELECT ingredient_id, quantity FROM order_items WHERE order_id = $1',
        [orderId]
    );

    return {
        ...order,
        items: itemsResult.rows.map(row => ({
            ingredientId: row.ingredient_id,
            quantity: row.quantity
        }))
    };
};

const updateOrderStatus = async (orderId, status) => {
    const result = await db.query(
        'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
        [status, orderId]
    );

    if (result.rows.length === 0) {
        throw new Error('Order not found');
    }

    return getOrder(orderId);
};

const getAllOrders = async () => {
    const result = await db.query(`
        SELECT o.*, 
            json_agg(json_build_object(
                'ingredientId', oi.ingredient_id,
                'quantity', oi.quantity
            )) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        GROUP BY o.id
        ORDER BY o.created_at DESC
    `);

    return result.rows.map(row => ({
        ...row,
        items: row.items[0] === null ? [] : row.items
    }));
};

module.exports = {
    createOrder,
    getOrder,
    updateOrderStatus,
    getAllOrders
}; 