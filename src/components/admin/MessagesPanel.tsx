// Author: UKARAKAS | Date: 09.11.2026 | Admin list of contact form messages
import { useCallback, useEffect, useState } from "react";
import { Loader2, Mail, Phone, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { apiRequest, ApiError } from "@/lib/api";
import { telLink } from "@/lib/contact";

interface Message {
  id: string;
  date: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" });
};

const MessagesPanel = ({ onAuthLost }: { onAuthLost: () => void }) => {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleError = useCallback(
    (e: unknown) => {
      if (e instanceof ApiError && e.status === 401) onAuthLost();
      toast.error(e instanceof Error ? e.message : "Bir hata oluştu.");
    },
    [onAuthLost],
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiRequest<{ messages: Message[] }>("messages.php");
      setMessages(res.messages);
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id: string) => {
    if (!confirm("Bu mesaj silinsin mi?")) return;
    try {
      await apiRequest("messages.php?action=delete", { body: { id } });
      setMessages((list) => (list ? list.filter((m) => m.id !== id) : list));
    } catch (e) {
      handleError(e);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          İletişim formundan gelen mesajlar burada saklanır. E-posta ulaşmasa bile mesaj kaybolmaz.
        </p>
        <button onClick={load} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm hover:bg-secondary">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Yenile
        </button>
      </div>

      {messages === null ? (
        <div className="flex justify-center py-12 text-muted-foreground">
          <Loader2 className="animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Henüz mesaj yok.</p>
      ) : (
        messages.map((m) => (
          <div key={m.id} className="bg-card border border-border rounded-lg p-4">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <div>
                <p className="font-semibold text-foreground">{m.name}</p>
                <p className="text-xs text-muted-foreground">{formatDate(m.date)}</p>
              </div>
              <button onClick={() => remove(m.id)} className="p-2 rounded-md text-destructive hover:bg-destructive/10" aria-label="Mesajı sil">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-4 text-sm mb-3">
              <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1 text-primary hover:underline">
                <Mail size={14} /> {m.email}
              </a>
              {m.phone && (
                <a href={telLink(m.phone)} className="inline-flex items-center gap-1 text-primary hover:underline">
                  <Phone size={14} /> {m.phone}
                </a>
              )}
            </div>
            <p className="text-sm text-foreground whitespace-pre-line">{m.message}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default MessagesPanel;
