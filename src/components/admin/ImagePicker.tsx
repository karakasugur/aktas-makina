// Author: UKARAKAS | Date: 09.11.2026 | Admin image field: pick a bundled image or upload a new one
import { useRef, useState } from "react";
import { Upload, ImageOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { bundledImages, resolveImage } from "@/lib/images";
import { apiRequest, ApiError } from "@/lib/api";

const MAX_SIDE = 1600;

/** Shrinks big photos in the browser before upload, so they load fast and fit hosting limits. */
const shrinkImage = (file: File): Promise<Blob> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(file);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => resolve(blob && blob.size < file.size ? blob : file), "image/webp", 0.85);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Bu dosya resim olarak açılamadı."));
    };
    img.src = url;
  });

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const ImagePicker = ({ value, onChange }: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const preview = resolveImage(value);
  const isBundled = value.startsWith("asset:");

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const blob = await shrinkImage(file);
      const form = new FormData();
      const ext = blob.type === "image/webp" ? "webp" : file.name.split(".").pop() || "jpg";
      form.append("file", blob, `gorsel.${ext}`);
      const res = await apiRequest<{ url: string }>("upload.php", { form });
      onChange(res.url);
      toast.success("Görsel yüklendi. Kalıcı olması için Kaydet'e basmayı unutmayın.");
    } catch (e) {
      toast.error(e instanceof ApiError || e instanceof Error ? e.message : "Görsel yüklenemedi.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
      <div className="w-28 h-20 shrink-0 rounded-md border border-border bg-white overflow-hidden flex items-center justify-center">
        {preview ? (
          <img src={preview} alt="" className="w-full h-full object-contain" />
        ) : (
          <ImageOff className="text-muted-foreground" size={24} />
        )}
      </div>
      <div className="flex-1 flex flex-col sm:flex-row gap-2">
        <select
          className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
          value={isBundled ? value : ""}
          onChange={(e) => e.target.value && onChange(e.target.value)}
        >
          <option value="">{isBundled ? "Hazır görsel seç" : value ? "Yüklenen görsel" : "Görsel yok"}</option>
          {Object.entries(bundledImages).map(([key, img]) => (
            <option key={key} value={`asset:${key}`}>
              {img.label}
            </option>
          ))}
        </select>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:bg-secondary disabled:opacity-60"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? "Yükleniyor..." : "Yeni görsel yükle"}
        </button>
      </div>
    </div>
  );
};

export default ImagePicker;
