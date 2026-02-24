
-- Create storage bucket for restoration images
INSERT INTO storage.buckets (id, name, public) VALUES ('restorations', 'restorations', true);

-- Allow public uploads (no auth yet)
CREATE POLICY "Allow public upload restorations" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'restorations');
CREATE POLICY "Allow public read restorations" ON storage.objects FOR SELECT USING (bucket_id = 'restorations');
CREATE POLICY "Allow public update restorations" ON storage.objects FOR UPDATE USING (bucket_id = 'restorations');
