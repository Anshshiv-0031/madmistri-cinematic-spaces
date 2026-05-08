import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X } from "lucide-react";

type SingleProps = { bucket: string; multiple?: false; value: string; onChange: (url: string) => void; accept?: string };
type MultiProps = { bucket: string; multiple: true; value: string[]; onChange: (urls: string[]) => void; accept?: string };
type Props = SingleProps | MultiProps;

export function MediaUpload(props: Props) {
  const { bucket, accept = "image/*" } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error } = await supabase.storage.from(bucket).upload(path, file, { cacheControl: "3600" });
        if (error) throw error;
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        urls.push(data.publicUrl);
        await supabase.from("media").insert({ url: data.publicUrl, bucket, path, file_name: file.name, mime_type: file.type, size_bytes: file.size });
      }
      if (props.multiple) props.onChange([...(props.value ?? []), ...urls]);
      else props.onChange(urls[0]);
    } catch (e: any) {
      alert("Upload failed: " + e.message);
    } finally {
      setBusy(false);
    }
  };

  const removeOne = (url: string) => {
    if (props.multiple) props.onChange(props.value.filter((u) => u !== url));
    else props.onChange("");
  };

  const items = props.multiple ? props.value : props.value ? [props.value] : [];

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); upload(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer border border-dashed p-6 text-center text-sm text-bone/60 transition ${drag ? "border-gold bg-gold/5" : "border-bone/20 hover:border-gold"}`}
      >
        <Upload size={16} className="mx-auto mb-2 text-gold" />
        {busy ? "Uploading…" : "Drag & drop or click to upload"}
        <input ref={inputRef} type="file" accept={accept} multiple={props.multiple} onChange={(e) => upload(e.target.files)} className="hidden" />
      </div>
      {items.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {items.map((url) => (
            <div key={url} className="relative aspect-square bg-bone/5 group">
              {accept.startsWith("video") ? (
                <video src={url} className="w-full h-full object-cover" />
              ) : (
                <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
              )}
              <button type="button" onClick={() => removeOne(url)} className="absolute top-1 right-1 bg-ink/80 text-bone p-1 opacity-0 group-hover:opacity-100 transition">
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
