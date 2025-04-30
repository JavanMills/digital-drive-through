const db = require('../config/database');

const createIngredient = (id, name, quantity) => Object.freeze({
    id,
    name,
    quantity
});

// Database operations
const initializeIngredients = async () => {
    const initialIngredients = {
        proteins: [
            ['beef-patty', 'Beef Patty', 100],
            ['grilled-chicken', 'Grilled Chicken', 100],
            ['crispy-chicken', 'Crispy Chicken', 100]
        ],
        buns: [
            ['regular-bun', 'Regular Bun', 200],
            ['sesame-bun', 'Sesame Seed Bun', 200],
            ['lettuce-wrap', 'Lettuce Wrap', 100]
        ],
        toppings: [
            ['lettuce', 'Lettuce', 300],
            ['tomato', 'Tomato', 300],
            ['onion', 'Onion', 300],
            ['pickles', 'Pickles', 300],
            ['cheese', 'American Cheese', 400]
        ],
        sauces: [
            ['mayo', 'Mayonnaise', 500],
            ['ketchup', 'Ketchup', 500],
            ['mustard', 'Mustard', 500],
            ['special-sauce', 'Special Sauce', 300]
        ],
        sides: [
            ['fries', 'French Fries', 200],
            ['onion-rings', 'Onion Rings', 150],
            ['salad', 'Side Salad', 100]
        ],
        drinks: [
            ['cola', 'Cola', 500],
            ['diet-cola', 'Diet Cola', 500],
            ['lemonade', 'Lemonade', 300],
            ['water', 'Bottled Water', 400]
        ]
    };

    for (const [category, items] of Object.entries(initialIngredients)) {
        const categoryResult = await db.query(
            'SELECT id FROM ingredient_categories WHERE name = $1',
            [category]
        );
        const categoryId = categoryResult.rows[0].id;

        for (const [id, name, quantity] of items) {
            await db.query(
                'INSERT INTO ingredients (id, name, quantity, category_id) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO UPDATE SET quantity = $3',
                [id, name, quantity, categoryId]
            );
        }
    }
};

const getAllIngredients = async () => {
    const result = await db.query(`
        SELECT c.name as category, json_agg(json_build_object(
            'id', i.id,
            'name', i.name,
            'quantity', i.quantity
        )) as ingredients
        FROM ingredient_categories c
        JOIN ingredients i ON i.category_id = c.id
        GROUP BY c.name
    `);

    return result.rows.reduce((acc, row) => ({
        ...acc,
        [row.category]: row.ingredients
    }), {});
};

const findIngredient = async (ingredientId) => {
    const result = await db.query(
        'SELECT id, name, quantity FROM ingredients WHERE id = $1',
        [ingredientId]
    );
    return result.rows[0];
};

const updateIngredientQuantity = async (ingredientId, newQuantity) => {
    const result = await db.query(
        'UPDATE ingredients SET quantity = $1 WHERE id = $2 RETURNING *',
        [newQuantity, ingredientId]
    );
    return result.rows[0];
};

// Initialize ingredients on module load
initializeIngredients().catch(console.error);

module.exports = {
    getAllIngredients,
    findIngredient,
    updateIngredientQuantity,
    createIngredient
}; 