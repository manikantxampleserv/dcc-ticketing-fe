import { Card, CardContent } from '@mui/joy';
import { FileText } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ticketAttachmentFn } from 'services/Ticket';
import Loader from '../components/Loader';

interface Attachment {
  id: number;
  file_name: string;
  file_path: string;
  content_type?: string;
  file_size?: number;
  created_at?: string;
}

interface TicketAttachmentsCardProps {
  ticketId: number | { id?: number };
  baseUrl?: string; // Optional base URL for file paths
}

export const TicketAttachmentsCard: React.FC<TicketAttachmentsCardProps> = ({ ticketId, baseUrl = '' }) => {
  const [state, setState] = useState<{
    attachments: Attachment[];
    loading: boolean;
    error: string | null;
  }>({
    attachments: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    let isMounted = true;

    const fetchAttachments = async () => {
      try {
        setState({ attachments: [], loading: true, error: null });
        const id = (ticketId as any)?.id ?? ticketId;
        console.log('Fetching attachments for ticketId:', id);

        const data = await ticketAttachmentFn(id);
        console.log('Fetched attachments:', data);

        if (isMounted) {
          setState({
            attachments: Array.isArray(data) ? data : data ? [data] : [],
            loading: false,
            error: null
          });
        }
      } catch (err: any) {
        if (isMounted) {
          setState({
            attachments: [],
            loading: false,
            error: err?.message || 'Failed to fetch attachments'
          });
        }
      }
    };

    fetchAttachments();
    return () => {
      isMounted = false;
    };
  }, [ticketId]);

  return (
    <Card className="w-full shadow-sm border border-gray-200">
      <CardContent className="p-4">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">Attachments File</h2>

        <div className="max-h-[250px] overflow-y-auto flex flex-col gap-2 pr-2">
          {state.loading ? (
            <div className="h-[100px] flex justify-center items-center">
              <Loader text="Loading attachments..." color="bg-blue-500" />
            </div>
          ) : state.error ? (
            <p className="text-red-500 text-center py-6">{state.error}</p>
          ) : state.attachments.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No attachments found.</p>
          ) : (
            state.attachments.map(file => {
              const isImage = file.content_type?.startsWith('image/') || /\.(jpg|jpeg|png|gif)$/i.test(file.file_name);
              const extension = file.file_name?.split('.').pop()?.toUpperCase();
              const fileUrl = file.file_path
                ? file.file_path.startsWith('http')
                  ? file.file_path
                  : `${baseUrl}${file.file_path}`
                : null;

              return (
                <div
                  key={file.id}
                  className="w-full flex items-center gap-3 border rounded-lg p-2 bg-white hover:shadow-md transition"
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded border bg-gray-50 overflow-hidden">
                    {isImage && fileUrl ? (
                      <img src={fileUrl} alt={file.file_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-500 text-[9px]">
                        <FileText size={16} />
                        {extension || 'FILE'}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">{file.file_name}</p>
                    <div className="flex items-center text-[10px] text-gray-400 gap-2">
                      {file.file_size && <span>{(file.file_size / 1024 / 1024).toFixed(2)} MB</span>}
                      {file.created_at && <span>{new Date(file.created_at).toLocaleDateString()}</span>}
                    </div>
                  </div>

                  {fileUrl && (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-600 text-white text-[11px] rounded hover:bg-blue-700 transition"
                    >
                      View
                    </a>
                  )}
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};
