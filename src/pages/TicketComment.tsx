import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'quill-mention/dist/quill.mention.css';
import { useRef } from 'react';

// Quill.register('modules/mention', Mention);
import * as Mention from 'quill-mention';
Quill.register('modules/mention', Mention as any);

interface MentionEditorProps {
  newMessage: string;
  onChangeHandler: (value: string) => void;
  searchUsersHandler: (searchTerm: string) => Promise<Array<{ id: string; value: string; display: string }>>;
  mentionedUsers: Array<{ id: string; display: string }>;
  attachments: { name: string } | null;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeAttachment: () => void;
  isInternal: boolean;
  setIsInternal: (checked: boolean) => void;
  handleSendMessage: () => void;
  isCreating: boolean;
}

const MentionEditor: React.FC<MentionEditorProps> = ({
  newMessage,
  onChangeHandler,
  searchUsersHandler,
  mentionedUsers,
  attachments,
  handleFileSelect,
  removeAttachment,
  isInternal,
  setIsInternal,
  handleSendMessage,
  isCreating
}) => {
  const quillRef = useRef<ReactQuill | null>(null);

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['link', 'image'],
      [{ list: 'ordered' }, { list: 'bullet' }]
    ],
    mention: {
      source: async (searchTerm: string, renderList: any) => {
        const results = await searchUsersHandler(searchTerm);
        renderList(results, searchTerm);
      },
      //   source: async (searchTerm: string, renderList: any) => {
      //     if (searchTerm.length === 0) {
      //       renderList([], searchTerm);
      //     } else {
      //       const users = await searchUsersHandler(searchTerm);
      //       renderList(users, searchTerm);
      //     }
      //   },
      mentionDenotationChars: ['@'],
      renderItem: (item: any) => `<div>${item.display}</div>`,
      onSelect: (item: any, insertItem: any) => insertItem(item),
      isolateCharacter: true
    }
  };

  const formats = ['bold', 'italic', 'underline', 'link', 'image', 'list', 'bullet', 'mention'];

  return (
    <div className="p-4 border-t bg-white rounded shadow-sm">
      <label htmlFor="comment" className="block mb-1 font-medium text-gray-700">
        Add a comment (use <span className="font-semibold">@</span> to mention)
      </label>

      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={newMessage}
        onChange={onChangeHandler}
        modules={modules}
        formats={formats}
        placeholder="Write your comment here..."
        style={{ minHeight: 150, marginBottom: 16 }}
      />

      {mentionedUsers.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 bg-blue-50 border border-blue-200 rounded p-2">
          <span className="text-sm text-blue-800 font-semibold">Mentioned:</span>
          {mentionedUsers.map((m, i) => {
            const cleanName = m.display.startsWith('@') ? m.display.slice(1) : m.display;
            return (
              <span key={i} className="bg-blue-200 text-blue-900 px-3 py-1 rounded-full text-xs select-none">
                {cleanName}
              </span>
            );
          })}
        </div>
      )}

      <div className="mt-4">
        <label htmlFor="attachment" className="block mb-1 font-medium text-gray-700 cursor-pointer">
          Attach a file
        </label>
        <input
          id="attachment"
          type="file"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
        />
        {attachments && (
          <div className="mt-2 flex justify-between items-center bg-gray-100 p-2 rounded text-gray-800 text-sm">
            <span>{attachments.name}</span>
            <button onClick={removeAttachment} className="text-red-500 font-bold hover:text-red-600">
              ×
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between space-x-4">
        <label className="flex items-center space-x-2 text-gray-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isInternal}
            onChange={e => setIsInternal(e.target.checked)}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span>Internal Comment</span>
        </label>
        <button
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || isCreating}
          className="inline-flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isCreating ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default MentionEditor;
