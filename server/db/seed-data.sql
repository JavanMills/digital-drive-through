-- Insert ingredients for each category
-- Get category IDs first
DO $$
DECLARE
    proteins_id INTEGER;
    buns_id INTEGER;
    toppings_id INTEGER;
    sauces_id INTEGER;
    sides_id INTEGER;
    drinks_id INTEGER;
BEGIN
    -- Get category IDs
    SELECT id INTO proteins_id FROM ingredient_categories WHERE name = 'proteins';
    SELECT id INTO buns_id FROM ingredient_categories WHERE name = 'buns';
    SELECT id INTO toppings_id FROM ingredient_categories WHERE name = 'toppings';
    SELECT id INTO sauces_id FROM ingredient_categories WHERE name = 'sauces';
    SELECT id INTO sides_id FROM ingredient_categories WHERE name = 'sides';
    SELECT id INTO drinks_id FROM ingredient_categories WHERE name = 'drinks';

    -- Insert ingredients
    -- Proteins
    INSERT INTO ingredients (id, name, quantity, category_id) VALUES
        ('beef-patty', 'Beef Patty', 100, proteins_id),
        ('grilled-chicken', 'Grilled Chicken', 75, proteins_id),
        ('crispy-chicken', 'Crispy Chicken', 50, proteins_id);

    -- Buns
    INSERT INTO ingredients (id, name, quantity, category_id) VALUES
        ('regular-bun', 'Regular Bun', 200, buns_id),
        ('sesame-bun', 'Sesame Seed Bun', 150, buns_id),
        ('lettuce-wrap', 'Lettuce Wrap', 100, buns_id);

    -- Toppings
    INSERT INTO ingredients (id, name, quantity, category_id) VALUES
        ('lettuce', 'Lettuce', 300, toppings_id),
        ('tomato', 'Tomato', 250, toppings_id),
        ('onion', 'Onion', 200, toppings_id),
        ('pickles', 'Pickles', 180, toppings_id),
        ('cheese', 'American Cheese', 400, toppings_id);

    -- Sauces
    INSERT INTO ingredients (id, name, quantity, category_id) VALUES
        ('mayo', 'Mayonnaise', 500, sauces_id),
        ('ketchup', 'Ketchup', 500, sauces_id),
        ('mustard', 'Mustard', 500, sauces_id),
        ('special-sauce', 'Special Sauce', 300, sauces_id);

    -- Sides
    INSERT INTO ingredients (id, name, quantity, category_id) VALUES
        ('fries', 'French Fries', 200, sides_id),
        ('onion-rings', 'Onion Rings', 150, sides_id),
        ('salad', 'Side Salad', 100, sides_id);

    -- Drinks
    INSERT INTO ingredients (id, name, quantity, category_id) VALUES
        ('cola', 'Cola', 500, drinks_id),
        ('diet-cola', 'Diet Cola', 500, drinks_id),
        ('lemonade', 'Lemonade', 300, drinks_id),
        ('water', 'Bottled Water', 400, drinks_id);
END $$;

-- Insert some sample orders
INSERT INTO orders (status) VALUES
    ('completed'),
    ('preparing'),
    ('ready');

-- Insert order items for the sample orders
-- Order 1: Classic Burger Meal
INSERT INTO order_items (order_id, ingredient_id, quantity) VALUES
    (1, 'beef-patty', 1),
    (1, 'regular-bun', 1),
    (1, 'lettuce', 1),
    (1, 'tomato', 1),
    (1, 'cheese', 1),
    (1, 'special-sauce', 1),
    (1, 'fries', 1),
    (1, 'cola', 1);

-- Order 2: Grilled Chicken Salad with Drink
INSERT INTO order_items (order_id, ingredient_id, quantity) VALUES
    (2, 'grilled-chicken', 1),
    (2, 'lettuce', 2),
    (2, 'tomato', 1),
    (2, 'onion', 1),
    (2, 'water', 1);

-- Order 3: Crispy Chicken Sandwich Combo
INSERT INTO order_items (order_id, ingredient_id, quantity) VALUES
    (3, 'crispy-chicken', 1),
    (3, 'sesame-bun', 1),
    (3, 'lettuce', 1),
    (3, 'mayo', 1),
    (3, 'pickles', 1),
    (3, 'onion-rings', 1),
    (3, 'lemonade', 1); 