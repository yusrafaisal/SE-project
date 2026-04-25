from database import get_connection

conn = get_connection()
cursor = conn.cursor()

statements = [
    """
    CREATE TABLE IF NOT EXISTS menu_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(50) NOT NULL,
        is_available BOOLEAN DEFAULT TRUE,
        image_url VARCHAR(500) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS delivery_addresses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        label VARCHAR(100),
        address TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        delivery_address TEXT NOT NULL,
        payment_method ENUM('cash', 'card') NOT NULL,
        special_instructions TEXT,
        status ENUM('placed','accepted','preparing','out_for_delivery','delivered') DEFAULT 'placed',
        total_price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        menu_item_id INT NOT NULL,
        quantity INT NOT NULL,
        price_at_order DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS inventory (
        id INT AUTO_INCREMENT PRIMARY KEY,
        menu_item_id INT NOT NULL UNIQUE,
        quantity INT NOT NULL DEFAULT 0,
        low_stock_threshold INT DEFAULT 5,
        FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
    )
    """,
]

for stmt in statements:
    cursor.execute(stmt)
    print("OK")

# Seed inventory only for menu items not already in inventory
cursor.execute("""
    INSERT IGNORE INTO inventory (menu_item_id, quantity)
    SELECT id, 50 FROM menu_items
""")

conn.commit()
conn.close()
print("\nAll tables created and inventory seeded.")