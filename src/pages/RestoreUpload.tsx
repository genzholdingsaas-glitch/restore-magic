import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestoreFlow } from '@/context/RestoreFlowContext';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Upload, ImagePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import exampleRestore from '@/assets/example-restore.png';

const RestoreUpload = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { flow, setImageUri } = useRestoreFlow();
  const [preview, setPreview] = useState<string | null>(flow.imageUri);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<File | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    fileRef.current = file;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setImageUri(url);
  };

  const handleContinue = async () => {
    if (!fileRef.current && !flow.imageUri) return;
    if (!user) {
      toast.info('Faça login para continuar');
      navigate('/auth');
      return;
    }

    // If we have a file, upload to storage
    if (fileRef.current) {
      setUploading(true);
      try {
        const ext = fileRef.current.name.split('.').pop() || 'jpg';
        const path = `input/${Date.now()}.${ext}`;
        const { error } = await supabase.storage
          .from('restorations')
          .upload(path, fileRef.current, { contentType: fileRef.current.type });

        if (error) throw error;

        const { data: publicUrlData } = supabase.storage
          .from('restorations')
          .getPublicUrl(path);

        setImageUri(publicUrlData.publicUrl);
      } catch (err) {
        console.error('Upload error:', err);
        toast.error('Erro ao enviar imagem. Tente novamente.');
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    navigate('/restore/form');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-4">
        <button onClick={() => navigate('/')} className="rounded-full p-1 hover:bg-muted transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Restaurar foto</h1>
      </div>

      <div className="px-5">
        {/* Example before/after */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 overflow-hidden rounded-2xl bg-card shadow-card"
        >
          <img
            src={exampleRestore}
            alt="Exemplo de restauração: antes e depois"
            className="w-full object-cover"
          />
          <p className="px-3 py-2 text-center text-xs text-muted-foreground">
            Exemplo de restauração com IA ✨
          </p>
        </motion.div>

        {/* Upload area */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {!preview ? (
            <motion.button
              key="upload-placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => inputRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border bg-card py-20 transition-colors hover:border-accent"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">Escolher foto</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  JPG, PNG — fotos antigas, danificadas, desbotadas
                </p>
              </div>
            </motion.button>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative overflow-hidden rounded-2xl bg-card shadow-card"
            >
              <img
                src={preview}
                alt="Preview da foto"
                className="mx-auto max-h-[55vh] w-full object-contain"
              />
              <button
                onClick={() => inputRef.current?.click()}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1.5 text-xs font-medium text-foreground shadow backdrop-blur-sm"
              >
                <Upload className="h-3.5 w-3.5" />
                Trocar
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <Button
            onClick={handleContinue}
            disabled={!preview || uploading}
            className="w-full rounded-xl py-6 text-base font-bold gradient-accent text-accent-foreground shadow-accent disabled:opacity-40 disabled:shadow-none"
          >
            {uploading ? 'Enviando…' : 'Restaurar imagem'}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default RestoreUpload;
