export const NOTE_EDITOR_DIRECTORY_TREE = [
    {
        id: 1,
        name: 'Personal',
        children: [
            { id: 11, name: 'Journal', children: [] },
            { id: 12, name: 'Daily notes', children: [] },
        ],
    },
    { id: 2, name: 'Work', children: [] },
    {
        id: 3,
        name: 'Education',
        children: [
            { id: 31, name: 'IT', children: [] },
            { id: 32, name: 'Science', children: [] },
        ],
    },
    { id: 4, name: 'Business', children: [] },
    { id: 5, name: 'Medicine', children: [] },
    { id: 6, name: 'Projects', children: [] },
    { id: 7, name: 'Ideas', children: [] },
    { id: 8, name: 'Diaries', children: [] },
];

export const NOTE_EDITOR_SHARE_OPTIONS = [
    {
        key: 'share-with-user',
        label: 'Share with user',
        subtitle: 'Share with another Notas user',
        action: 'onShareWithUser',
    },
    {
        key: 'copy-share-link',
        label: 'Copy share link',
        subtitle: 'Create a link to share this note',
        action: 'onCopyShareLink',
    },
    {
        key: 'export',
        label: 'Export',
        subtitle: 'Export as PDF, Markdown or Text',
        action: 'onExport',
    },
    {
        key: 'copy-as-text',
        label: 'Copy as text',
        subtitle: 'Copy clean text for ChatGPT or another app',
        action: 'onCopyAsText',
    },
];

export const NOTE_EDITOR_MORE_ACTIONS = [
    {
        key: 'archive',
        label: 'Archive',
        subtitle: 'Move this note to archive',
        action: 'onArchive',
        variant: 'neutral',
    },
    {
        key: 'move-to',
        label: 'Move to...',
        subtitle: 'Change the note’s directory',
        action: 'onOpenMoveDialog',
        variant: 'neutral',
    },
    {
        key: 'duplicate',
        label: 'Duplicate',
        subtitle: 'Create a copy of this note',
        action: 'onDuplicate',
        variant: 'neutral',
    },
    {
        key: 'note-info',
        label: 'Note information',
        subtitle: 'View details and stats',
        action: 'onShowInfo',
        variant: 'neutral',
    },
    {
        key: 'delete',
        label: 'Delete',
        subtitle: 'Permanently delete this note',
        action: 'onDelete',
        variant: 'danger',
    },
];
