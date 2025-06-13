
-- Add stock management to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock JSONB DEFAULT '{"U": 0, "P": 0, "M": 0, "G": 0, "GG": 0}';

-- Update existing products to have stock data if they don't already
UPDATE products 
SET stock = '{"U": 10, "P": 10, "M": 10, "G": 10, "GG": 10}'
WHERE stock IS NULL;

-- Create a table to track stock movements (optional but useful for inventory management)
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment')),
  quantity INTEGER NOT NULL,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create an index for better performance on stock movements
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON stock_movements(created_at);

-- Create a function to update stock safely
CREATE OR REPLACE FUNCTION update_product_stock(
  p_product_id UUID,
  p_size TEXT,
  p_quantity INTEGER,
  p_movement_type TEXT,
  p_reason TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
  current_stock INTEGER;
  new_stock INTEGER;
  stock_data JSONB;
BEGIN
  -- Get current stock for the size
  SELECT stock INTO stock_data FROM products WHERE id = p_product_id;
  
  IF stock_data IS NULL THEN
    RAISE EXCEPTION 'Product not found or stock data is null';
  END IF;
  
  current_stock := COALESCE((stock_data ->> p_size)::INTEGER, 0);
  
  -- Calculate new stock based on movement type
  CASE p_movement_type
    WHEN 'in' THEN
      new_stock := current_stock + p_quantity;
    WHEN 'out' THEN
      new_stock := current_stock - p_quantity;
      IF new_stock < 0 THEN
        RAISE EXCEPTION 'Insufficient stock. Current: %, Requested: %', current_stock, p_quantity;
      END IF;
    WHEN 'adjustment' THEN
      new_stock := p_quantity;
    ELSE
      RAISE EXCEPTION 'Invalid movement type: %', p_movement_type;
  END CASE;
  
  -- Update the stock in products table
  UPDATE products 
  SET stock = jsonb_set(stock, ARRAY[p_size], to_jsonb(new_stock))
  WHERE id = p_product_id;
  
  -- Record the stock movement
  INSERT INTO stock_movements (
    product_id, size, movement_type, quantity, 
    previous_stock, new_stock, reason
  ) VALUES (
    p_product_id, p_size, p_movement_type, p_quantity,
    current_stock, new_stock, p_reason
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
