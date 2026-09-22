export function NoteCanvas({ children, paperStyle = 'lined', mode = 'write' }) {
    const root = document.createElement('div');
    root.className = [
        'mx-auto w-full max-w-[760px] rounded-[30px] border border-slate-200/80 p-3 shadow-[0_10px_28px_rgba(15,23,42,0.04)] transition-colors sm:p-4 lg:max-w-[900px] lg:p-6',
        'bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50',
        paperStyle === 'plain' ? 'note-paper--plain' : '',
        paperStyle === 'lined' ? 'note-paper--lined' : '',
        paperStyle === 'grid' ? 'note-paper--grid' : '',
        paperStyle === 'dotted' ? 'note-paper--dotted' : '',
    ].filter(Boolean).join(' ');

    const inner = document.createElement('div');
    inner.className = 'space-y-4 px-2 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6';
    inner.appendChild(children);
    root.appendChild(inner);
    return root;
}
