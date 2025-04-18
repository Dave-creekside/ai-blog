-- Add repository_url and html_data_url columns to articles table if they don't exist
DO $$
BEGIN
   IF NOT EXISTS (
       SELECT FROM information_schema.columns 
       WHERE table_name = 'articles' AND column_name = 'repository_url'
   ) THEN
       ALTER TABLE articles ADD COLUMN repository_url TEXT;
   END IF;

   IF NOT EXISTS (
       SELECT FROM information_schema.columns 
       WHERE table_name = 'articles' AND column_name = 'html_data_url'
   ) THEN
       ALTER TABLE articles ADD COLUMN html_data_url TEXT;
   END IF;

   -- Add is_project column to identify if an entry is a project
   IF NOT EXISTS (
       SELECT FROM information_schema.columns 
       WHERE table_name = 'articles' AND column_name = 'is_project'
   ) THEN
       ALTER TABLE articles ADD COLUMN is_project BOOLEAN DEFAULT FALSE;
   END IF;
END $$;

-- Update the article_view to include the new fields
CREATE OR REPLACE VIEW article_view AS
SELECT 
   id,
   title,
   description,
   category,
   image_url,
   pdf_url,
   pdf_path,
   repository_url,
   html_data_url,
   is_project,
   published_date,
   author,
   read_time,
   created_at,
   updated_at
FROM articles
ORDER BY published_date DESC;
