-- Add pdf_path column to articles table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'articles' AND column_name = 'pdf_path'
    ) THEN
        ALTER TABLE articles ADD COLUMN pdf_path TEXT;
    END IF;
END $$;

-- Update the article_view to include the pdf_path
CREATE OR REPLACE VIEW article_view AS
SELECT 
    id,
    title,
    description,
    category,
    image_url,
    pdf_url,
    pdf_path,
    published_date,
    author,
    read_time,
    created_at,
    updated_at
FROM articles
ORDER BY published_date DESC;
