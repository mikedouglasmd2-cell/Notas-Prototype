function buildDirectoryTree(nodes, depth = 0) {
    return nodes
        .map((node) => {
            const hasChildren = Array.isArray(node.children) && node.children.length > 0;
            const item = document.createElement('button');
            item.type = 'button';
            item.className = [
                'group flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left text-sm transition-colors',
                'border-transparent hover:border-slate-200 hover:bg-slate-100/80 dark:hover:border-slate-700 dark:hover:bg-slate-800/80',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950',
            ].join(' ');
            item.style.marginLeft = `${depth * 16}px`;
            item.dataset.directoryId = String(node.id);
            item.dataset.directoryName = node.name;

            const left = document.createElement('span');
            left.className = 'flex items-center gap-3';

            const icon = document.createElement('span');
            icon.className = 'flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300';
            icon.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="h-4 w-4">
                    <path d="M3.75 7.75A2.75 2.75 0 0 1 6.5 5h3.1c.5 0 1 .2 1.4.56l.88 1.02c.36.42.87.66 1.4.66H17.5A2.75 2.75 0 0 1 20.25 10v7.5A2.75 2.75 0 0 1 17.5 20.5h-11A2.75 2.75 0 0 1 3.75 17.75V7.75Z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;

            const label = document.createElement('span');
            label.className = 'font-medium text-slate-700 dark:text-slate-200';
            label.textContent = node.name;

            left.append(icon, label);

            const suffix = document.createElement('span');
            suffix.className = 'flex h-5 w-5 items-center justify-center text-slate-400 dark:text-slate-500';
            if (hasChildren) {
                suffix.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="h-4 w-4">
                        <path d="m9 7 5 5-5 5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;
            }

            item.append(left, suffix);

            if (hasChildren) {
                const children = document.createElement('div');
                children.className = 'mt-2 space-y-1';
                const nested = buildDirectoryTree(node.children, depth + 1);
                nested.forEach((child) => children.append(child));
                item.after(children);
            }

            return item;
        })
        .flat();
}

export function renderMoveNoteDialog({
    directories,
    selectedDirectory = null,
    onSelectDirectory,
    onMove,
    onCreateFolder,
    onClose,
}) {
    const backdrop = document.createElement('div');
    backdrop.className = 'fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-8';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-labelledby', 'move-note-dialog-title');

    const panel = document.createElement('div');
    panel.className = 'w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-950';

    const header = document.createElement('div');
    header.className = 'flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800';
    header.innerHTML = `
        <div>
            <p id="move-note-dialog-title" class="text-lg font-semibold text-slate-900 dark:text-white">Move to...</p>
        </div>
        <button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white" aria-label="Close move dialog">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="h-4 w-4">
                <path d="M6 6l12 12M18 6 6 18" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    `;
    const closeButton = header.querySelector('button');
    closeButton.addEventListener('click', onClose);

    const searchWrap = document.createElement('div');
    searchWrap.className = 'px-5 py-4';
    searchWrap.innerHTML = `
        <label class="relative block">
            <span class="sr-only">Search notepads or categories</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                <circle cx="11" cy="11" r="5.5"></circle>
                <path d="m16 16 4 4" stroke-linecap="round"></path>
            </svg>
            <input type="search" placeholder="Search notepads or categories..." class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500" />
        </label>
    `;

    const listWrap = document.createElement('div');
    listWrap.className = 'max-h-72 overflow-y-auto px-3 pb-2';
    const list = document.createElement('div');
    list.className = 'space-y-1';

    const directoryNodes = buildDirectoryTree(directories || []);
    directoryNodes.forEach((item) => {
        item.addEventListener('click', () => {
            const chosen = item.dataset.directoryName;
            if (typeof onSelectDirectory === 'function') {
                onSelectDirectory({ id: Number(item.dataset.directoryId), name: chosen });
            }

            const allButtons = list.querySelectorAll('button');
            allButtons.forEach((button) => {
                const isSelected = button.dataset.directoryId === item.dataset.directoryId;
                button.classList.toggle('border-sky-200', isSelected && !button.classList.contains('dark:border-sky-700'));
                button.classList.toggle('bg-sky-50', isSelected);
                button.classList.toggle('dark:border-sky-800', isSelected);
                button.classList.toggle('dark:bg-sky-950/40', isSelected);
            });
        });
        list.appendChild(item);
    });

    listWrap.appendChild(list);

    const footer = document.createElement('div');
    footer.className = 'flex items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900';
    footer.innerHTML = `
        <button type="button" class="inline-flex items-center gap-2 text-sm font-medium text-sky-600 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-sky-400 dark:hover:text-sky-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="h-4 w-4">
                <path d="M12 5v14M5 12h14" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Create new folder</span>
        </button>
        <button type="button" class="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-sky-600/30 transition hover:bg-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950">
            Move here
        </button>
    `;

    const createButton = footer.querySelector('button[type="button"]');
    const moveButton = footer.querySelectorAll('button')[1];
    createButton.addEventListener('click', onCreateFolder);
    moveButton.addEventListener('click', onMove);

    panel.append(header, searchWrap, listWrap, footer);
    backdrop.appendChild(panel);

    backdrop.addEventListener('click', (event) => {
        if (event.target === backdrop) {
            onClose();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            onClose();
        }
    }, { once: true });

    if (selectedDirectory) {
        const selectedItem = list.querySelector(`[data-directory-id="${selectedDirectory.id}"]`);
        if (selectedItem) {
            selectedItem.classList.add('border-sky-200', 'bg-sky-50', 'dark:border-sky-800', 'dark:bg-sky-950/40');
        }
    }

    return backdrop;
}
