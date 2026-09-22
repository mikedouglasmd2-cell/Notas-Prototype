import { NOTE_EDITOR_MORE_ACTIONS, NOTE_EDITOR_SHARE_OPTIONS } from '../../constants/noteEditorActions.js';
import { renderMoveNoteDialog } from './MoveNoteDialog.js';

const SAVE_STATUS_LABELS = {
    idle: 'Idle',
    saving: 'Saving...',
    saved: 'Saved',
    offline: 'Offline',
    error: 'Error',
};

const SAVE_STATUS_ICONS = {
    idle: '•',
    saving: '⏳',
    saved: '✓',
    offline: '◌',
    error: '!',
};

function IconButton({ ariaLabel, title, onClick, icon, className = '', disabled = false }) {
    return `
        <button
            type="button"
            aria-label="${ariaLabel}"
            title="${title ?? ariaLabel}"
            class="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white dark:focus-visible:ring-offset-slate-950 ${className}"
            ${disabled ? 'disabled' : ''}
            data-action="${ariaLabel}"
        >
            ${icon}
        </button>
    `;
}

function MenuItem({ label, subtitle, dangerous = false, onClick }) {
    return `
        <button
            type="button"
            class="group flex w-full items-start justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${dangerous ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'}"
            data-menu-item="${label}"
        >
            <span class="flex flex-col">
                <span class="text-sm font-medium ${dangerous ? 'text-red-600 dark:text-red-400' : ''}">${label}</span>
                <span class="mt-0.5 text-xs ${dangerous ? 'text-red-500/80' : 'text-slate-500 dark:text-slate-400'}">${subtitle}</span>
            </span>
        </button>
    `;
}

function renderSaveStatus(saveStatus = 'saved') {
    const normalized = SAVE_STATUS_LABELS[saveStatus] ? saveStatus : 'saved';
    const icon = SAVE_STATUS_ICONS[normalized];
    const label = SAVE_STATUS_LABELS[normalized];

    return `
        <span class="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.02em] text-slate-500 dark:text-slate-400">
            <span class="inline-flex h-4 w-4 items-center justify-center rounded-full ${normalized === 'error' ? 'bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400' : normalized === 'saving' ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400' : normalized === 'offline' ? 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'}">
                ${icon}
            </span>
            <span>${label}</span>
        </span>
    `;
}

function buildModeButton(mode, onModeChange) {
    const isWriteMode = mode === 'write';
    const label = isWriteMode ? 'Write' : 'Read';
    const icon = isWriteMode
        ? `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="h-4 w-4">
                <path d="M4 20.5V16l10.5-10.5a2.12 2.12 0 1 1 3 3L7 19.5H4Z" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M13.5 6.5 17.5 10.5" stroke-linecap="round"></path>
            </svg>
        `
        : `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="h-4 w-4">
                <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12Z" stroke-linecap="round" stroke-linejoin="round"></path>
                <circle cx="12" cy="12" r="3"></circle>
            </svg>
        `;

    return `
        <button
            type="button"
            aria-label="Toggle read and write mode"
            class="inline-flex items-center gap-2 rounded-xl border px-2.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${isWriteMode ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-400' : 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-400'}"
        >
            <span class="inline-flex h-7 w-7 items-center justify-center rounded-lg ${isWriteMode ? 'bg-white/75 text-emerald-600 dark:bg-slate-900/60 dark:text-emerald-400' : 'bg-white/75 text-sky-600 dark:bg-slate-900/60 dark:text-sky-400'}">
                ${icon}
            </span>
            <span class="hidden sm:inline">${label}</span>
        </button>
    `;
}

function buildBreadcrumbTrail(breadcrumbs = []) {
    if (!breadcrumbs.length) {
        return '<span class="text-xs text-slate-500 dark:text-slate-400">No folder</span>';
    }

    const mobileStartIndex = Math.max(0, breadcrumbs.length - 2);

    return breadcrumbs
        .map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const content = item.name || 'Untitled';
            const visibilityClass = index < mobileStartIndex ? 'hidden sm:inline-flex' : 'inline-flex';
            const mobileEllipsis = index === mobileStartIndex && mobileStartIndex > 0
                ? '<span class="inline-flex items-center px-1 text-slate-400 sm:hidden">…</span>'
                : '';
            return `
                ${mobileEllipsis}
                <span class="${visibilityClass} items-center gap-1.5">
                    <button type="button" class="max-w-[8rem] truncate rounded-md px-1 py-0.5 text-left text-[11px] font-medium text-slate-500 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-slate-400 dark:hover:text-slate-200" data-breadcrumb="${encodeURIComponent(content)}">
                        ${content}
                    </button>
                    ${!isLast ? `<span class="text-slate-400 dark:text-slate-500">›</span>` : ''}
                </span>
            `;
        })
        .join('');
}

export function NoteEditorHeader({
    title = 'Untitled note',
    breadcrumbs = [],
    mode = 'write',
    saveStatus = 'saved',
    canUndo = false,
    canRedo = false,
    onBack,
    onTitleChange,
    onTitleCommit,
    onUndo,
    onRedo,
    onModeChange,
    onMoveNote,
    onShareWithUser,
    onCopyShareLink,
    onExport,
    onCopyAsText,
    onArchive,
    onDuplicate,
    onShowInfo,
    onDelete,
}) {
    const state = {
        title,
        draftTitle: title,
        mode,
        saveStatus,
        breadcrumbs,
        isEditingTitle: false,
        moveDialogOpen: false,
        activeMenu: null,
    };

    const root = document.createElement('header');
    root.className = 'w-full rounded-[28px] border border-slate-200 bg-white p-3 shadow-[0_8px_24px_rgba(15,23,42,0.06)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_18px_40px_rgba(2,6,23,0.38)]';

    const shell = document.createElement('div');
    shell.className = 'flex items-center justify-between gap-3';

    const left = document.createElement('div');
    left.className = 'flex min-w-0 flex-1 items-center gap-2 sm:gap-3';

    const backButton = document.createElement('button');
    backButton.type = 'button';
    backButton.className = 'inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white dark:focus-visible:ring-offset-slate-950';
    backButton.setAttribute('aria-label', 'Go back');
    backButton.title = 'Go back';
    backButton.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="h-4 w-4">
            <path d="M15 18 9 12l6-6" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
    `;
    backButton.addEventListener('click', onBack);
    left.appendChild(backButton);

    const titleBlock = document.createElement('div');
    titleBlock.className = 'min-w-0 flex-1';

    const titleRow = document.createElement('div');
    titleRow.className = 'flex min-w-0 items-center gap-2';

    const titleWrap = document.createElement('div');
    titleWrap.className = 'min-w-0 flex-1';

    const titleAnchor = document.createElement('button');
    titleAnchor.type = 'button';
    titleAnchor.className = 'w-full max-w-full truncate text-left text-base font-semibold tracking-[-0.02em] text-slate-900 transition-colors hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-slate-50 dark:hover:text-slate-200 dark:focus-visible:ring-offset-slate-950';
    titleAnchor.textContent = state.title;
    titleAnchor.title = state.title;
    titleAnchor.addEventListener('click', () => {
        if (state.mode === 'write') {
            state.isEditingTitle = true;
            state.draftTitle = state.title;
            renderTitleEditor();
        }
    });

    const input = document.createElement('input');
    input.type = 'text';
    input.value = state.draftTitle;
    input.className = 'w-full rounded-xl border border-sky-200 bg-white px-3 py-2 text-base font-semibold tracking-[-0.02em] text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50';
    input.style.display = 'none';
    input.setAttribute('aria-label', 'Edit note title');

    const commitTitle = (shouldCancel = false) => {
        if (shouldCancel) {
            state.isEditingTitle = false;
            state.draftTitle = state.title;
            renderTitleEditor();
            return;
        }

        const nextTitle = input.value.trim() || state.title;
        state.title = nextTitle;
        state.draftTitle = nextTitle;
        state.isEditingTitle = false;
        if (typeof onTitleChange === 'function') onTitleChange(nextTitle);
        if (typeof onTitleCommit === 'function') onTitleCommit(nextTitle);
        renderTitleEditor();
    };

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            commitTitle();
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            commitTitle(true);
        }
    });

    input.addEventListener('blur', () => {
        if (state.isEditingTitle) {
            commitTitle();
        }
    });

    function renderTitleEditor() {
        titleAnchor.textContent = state.title;
        titleAnchor.title = state.title;
        input.value = state.draftTitle;

        if (state.isEditingTitle && state.mode === 'write') {
            titleAnchor.style.display = 'none';
            input.style.display = 'block';
            input.focus();
            input.select();
        } else {
            titleAnchor.style.display = 'block';
            input.style.display = 'none';
        }
    }

    const folderButton = document.createElement('button');
    folderButton.type = 'button';
    folderButton.className = 'inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100';
    folderButton.setAttribute('aria-label', 'Open move note dialog');
    folderButton.title = 'Open move note dialog';
    folderButton.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="h-4 w-4">
            <path d="M3.75 7.75A2.75 2.75 0 0 1 6.5 5h3.1c.5 0 1 .2 1.4.56l.88 1.02c.36.42.87.66 1.4.66H17.5A2.75 2.75 0 0 1 20.25 10v7.5A2.75 2.75 0 0 1 17.5 20.5h-11A2.75 2.75 0 0 1 3.75 17.75V7.75Z" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
    `;
    folderButton.addEventListener('click', () => {
        openMoveDialog();
    });

    titleRow.append(titleWrap);
    titleWrap.append(titleAnchor, input);
    titleBlock.appendChild(titleRow);

    const breadcrumb = document.createElement('div');
    breadcrumb.className = 'mt-1.5 flex min-w-0 items-center gap-0.5 overflow-hidden text-ellipsis';
    breadcrumb.append(folderButton);
    const breadcrumbTrail = document.createElement('div');
    breadcrumbTrail.className = 'flex min-w-0 items-center gap-0.5 overflow-hidden text-ellipsis';
    breadcrumbTrail.innerHTML = buildBreadcrumbTrail(state.breadcrumbs);
    breadcrumb.appendChild(breadcrumbTrail);
    breadcrumb.addEventListener('click', (event) => {
        const target = event.target.closest('[data-breadcrumb]');
        if (target) {
            openMoveDialog();
        }
    });
    titleBlock.appendChild(breadcrumb);
    left.appendChild(titleBlock);

    const right = document.createElement('div');
    right.className = 'flex shrink-0 items-center gap-1.5 sm:gap-2.5';

    const undoButton = document.createElement('div');
    undoButton.innerHTML = IconButton({
        ariaLabel: 'Undo',
        title: 'Undo',
        onClick: onUndo,
        icon: `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="h-4 w-4">
                <path d="M9 7 4 12l5 5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M20 18v-2a6 6 0 0 0-6-6H4" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
        `,
        disabled: !canUndo,
        className: 'max-sm:hidden sm:inline-flex',
    });
    undoButton.querySelector('button').addEventListener('click', onUndo);
    right.appendChild(undoButton.firstElementChild);

    const redoButton = document.createElement('div');
    redoButton.innerHTML = IconButton({
        ariaLabel: 'Redo',
        title: 'Redo',
        onClick: onRedo,
        icon: `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="h-4 w-4">
                <path d="m15 7 5 5-5 5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M4 18v-2a6 6 0 0 1 6-6h10" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
        `,
        disabled: !canRedo,
        className: 'max-sm:hidden sm:inline-flex',
    });
    redoButton.querySelector('button').addEventListener('click', onRedo);
    right.appendChild(redoButton.firstElementChild);

    const modeButton = document.createElement('div');
    modeButton.innerHTML = buildModeButton(state.mode, onModeChange);
    const modeButtonEl = modeButton.firstElementChild;
    modeButtonEl.addEventListener('click', () => {
        const nextMode = state.mode === 'write' ? 'read' : 'write';
        state.mode = nextMode;
        if (typeof onModeChange === 'function') onModeChange(nextMode);
        modeButton.innerHTML = buildModeButton(state.mode, onModeChange);
        modeButton.lastElementChild?.addEventListener('click', () => {});
        renderTitleEditor();
    });
    right.appendChild(modeButton.firstElementChild);

    const shareWrap = document.createElement('div');
    shareWrap.className = 'relative max-sm:hidden';
    const shareButton = document.createElement('button');
    shareButton.type = 'button';
    shareButton.className = 'inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800';
    shareButton.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="h-4 w-4">
            <path d="M15.5 8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM8.5 15.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM15.5 20.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="m11 13 3.5-2.5M11 11l3.5 2.5" stroke-linecap="round"></path>
        </svg>
        <span class="hidden sm:inline">Share</span>
    `;
    shareButton.addEventListener('click', () => {
        const open = state.activeMenu === 'share';
        state.activeMenu = open ? null : 'share';
        renderMenu();
    });
    shareWrap.appendChild(shareButton);

    const shareMenu = document.createElement('div');
    shareMenu.className = 'absolute right-0 top-[calc(100%+12px)] z-20 hidden w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-950/10 dark:border-slate-700 dark:bg-slate-900';
    const handleShareAction = (action) => {
        if (action === 'onShareWithUser' && typeof onShareWithUser === 'function') onShareWithUser();
        if (action === 'onCopyShareLink' && typeof onCopyShareLink === 'function') onCopyShareLink();
        if (action === 'onExport' && typeof onExport === 'function') onExport();
        if (action === 'onCopyAsText' && typeof onCopyAsText === 'function') onCopyAsText();
        state.activeMenu = null;
        renderMenu();
    };
    shareMenu.innerHTML = NOTE_EDITOR_SHARE_OPTIONS.map((item) => `
        <button type="button" data-share-action="${item.action}" class="flex w-full items-start justify-between rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:hover:bg-slate-800">
            <span>
                <span class="block text-sm font-medium text-slate-700 dark:text-slate-200">${item.label}</span>
                <span class="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">${item.subtitle}</span>
            </span>
        </button>
    `).join('');
    shareMenu.querySelectorAll('[data-share-action]').forEach((menuItem) => {
        menuItem.addEventListener('click', () => {
            handleShareAction(menuItem.dataset.shareAction);
        });
    });
    shareWrap.appendChild(shareMenu);
    right.appendChild(shareWrap);

    const moreWrap = document.createElement('div');
    moreWrap.className = 'relative';
    const moreButton = document.createElement('button');
    moreButton.type = 'button';
    moreButton.className = 'inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800';
    moreButton.setAttribute('aria-label', 'More actions');
    moreButton.title = 'More actions';
    moreButton.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4">
            <circle cx="12" cy="5" r="1.6"></circle>
            <circle cx="12" cy="12" r="1.6"></circle>
            <circle cx="12" cy="19" r="1.6"></circle>
        </svg>
    `;
    moreButton.addEventListener('click', () => {
        const open = state.activeMenu === 'more';
        state.activeMenu = open ? null : 'more';
        renderMenu();
    });
    moreWrap.appendChild(moreButton);

    const moreMenu = document.createElement('div');
    moreMenu.className = 'absolute right-0 top-[calc(100%+12px)] z-20 hidden w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-950/10 dark:border-slate-700 dark:bg-slate-900';
    const renderMoreAction = (item) => {
        if (item.key === 'delete') {
            return `
                <div class="my-2 h-px bg-slate-200 dark:bg-slate-700"></div>
                <button type="button" data-more-action="${item.action}" class="flex w-full items-start justify-between rounded-xl px-3 py-2.5 text-left transition-colors text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:text-red-400 dark:hover:bg-red-950/20">
                    <span>
                        <span class="block text-sm font-medium">${item.label}</span>
                        <span class="mt-0.5 block text-xs text-red-500/80">${item.subtitle}</span>
                    </span>
                </button>
            `;
        }

        return `
            <button type="button" data-more-action="${item.action}" class="flex w-full items-start justify-between rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:hover:bg-slate-800">
                <span>
                    <span class="block text-sm font-medium text-slate-700 dark:text-slate-200">${item.label}</span>
                    <span class="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">${item.subtitle}</span>
                </span>
            </button>
        `;
    };
    const mobileShareItem = `
        <div class="my-2 h-px bg-slate-200 max-sm:block sm:hidden dark:bg-slate-700"></div>
        <button type="button" data-more-action="onOpenShareMenu" class="hidden w-full items-start justify-between rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 max-sm:flex dark:hover:bg-slate-800">
            <span>
                <span class="block text-sm font-medium text-slate-700 dark:text-slate-200">Share...</span>
                <span class="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">Share or export this note</span>
            </span>
            <span class="text-slate-400 dark:text-slate-500">›</span>
        </button>
    `;
    moreMenu.innerHTML = NOTE_EDITOR_MORE_ACTIONS
        .filter((item) => item.key !== 'delete')
        .map(renderMoreAction)
        .join('') + mobileShareItem + NOTE_EDITOR_MORE_ACTIONS
        .filter((item) => item.key === 'delete')
        .map(renderMoreAction)
        .join('');

    const mobileShareMenu = document.createElement('div');
    mobileShareMenu.className = 'absolute right-0 top-[calc(100%+12px)] z-20 hidden w-[calc(100vw-2rem)] max-w-72 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-950/10 dark:border-slate-700 dark:bg-slate-900 sm:hidden';
    mobileShareMenu.innerHTML = `
        <button type="button" data-mobile-share-back class="mb-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100">
            <span aria-hidden="true">‹</span>
            <span>More actions</span>
        </button>
        ${NOTE_EDITOR_SHARE_OPTIONS.map((item) => `
            <button type="button" data-mobile-share-action="${item.action}" class="flex w-full items-start justify-between rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:hover:bg-slate-800">
                <span>
                    <span class="block text-sm font-medium text-slate-700 dark:text-slate-200">${item.label}</span>
                    <span class="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">${item.subtitle}</span>
                </span>
            </button>
        `).join('')}
    `;
    mobileShareMenu.querySelector('[data-mobile-share-back]').addEventListener('click', () => {
        state.activeMenu = 'more';
        renderMenu();
    });
    mobileShareMenu.querySelectorAll('[data-mobile-share-action]').forEach((menuItem) => {
        menuItem.addEventListener('click', () => {
            handleShareAction(menuItem.dataset.mobileShareAction);
        });
    });

    const deleteConfirmation = document.createElement('div');
    deleteConfirmation.className = 'fixed inset-0 z-40 hidden items-center justify-center bg-slate-900/40 p-4';
    deleteConfirmation.innerHTML = `
        <div class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-950/10 dark:border-slate-700 dark:bg-slate-900" role="dialog" aria-modal="true" aria-labelledby="delete-note-title">
            <h3 id="delete-note-title" class="text-lg font-semibold text-slate-900 dark:text-slate-50">Delete note?</h3>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">This action cannot be undone.</p>
            <div class="mt-5 flex justify-end gap-3">
                <button type="button" data-delete-cancel class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800">Cancel</button>
                <button type="button" data-delete-confirm class="rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-red-600/30 transition hover:bg-red-500 dark:bg-red-500 dark:hover:bg-red-400">Delete</button>
            </div>
        </div>
    `;

    moreMenu.querySelectorAll('[data-more-action]').forEach((menuItem) => {
        menuItem.addEventListener('click', () => {
            const action = menuItem.dataset.moreAction;
            if (action === 'onArchive' && typeof onArchive === 'function') onArchive();
            if (action === 'onOpenMoveDialog') openMoveDialog();
            if (action === 'onDuplicate' && typeof onDuplicate === 'function') onDuplicate();
            if (action === 'onShowInfo' && typeof onShowInfo === 'function') onShowInfo();
            if (action === 'onOpenShareMenu') state.activeMenu = 'mobile-share';
            if (action === 'onDelete') {
                deleteConfirmation.classList.remove('hidden');
                deleteConfirmation.classList.add('flex');
            }
            if (action !== 'onOpenShareMenu') {
                state.activeMenu = null;
            }
            renderMenu();
        });
    });

    deleteConfirmation.querySelector('[data-delete-cancel]').addEventListener('click', () => {
        deleteConfirmation.classList.add('hidden');
        deleteConfirmation.classList.remove('flex');
    });
    deleteConfirmation.querySelector('[data-delete-confirm]').addEventListener('click', () => {
        if (typeof onDelete === 'function') onDelete();
        deleteConfirmation.classList.add('hidden');
        deleteConfirmation.classList.remove('flex');
    });
    moreWrap.appendChild(moreMenu);
    moreWrap.appendChild(mobileShareMenu);
    right.appendChild(moreWrap);

    const saveStatusEl = document.createElement('div');
    saveStatusEl.className = 'max-md:hidden md:flex';
    saveStatusEl.innerHTML = renderSaveStatus(state.saveStatus);
    right.appendChild(saveStatusEl);

    const closeMenusOnOutsideClick = (event) => {
        if (!root.contains(event.target)) {
            state.activeMenu = null;
            renderMenu();
        }
    };

    const closeMenusOnEscape = (event) => {
        if (event.key === 'Escape') {
            state.activeMenu = null;
            renderMenu();
            if (state.moveDialogOpen) {
                state.moveDialogOpen = false;
                const openDialog = document.querySelector('[role="dialog"][aria-modal="true"]');
                if (openDialog) {
                    openDialog.remove();
                }
            }
        }
    };

    document.addEventListener('click', closeMenusOnOutsideClick);
    document.addEventListener('keydown', closeMenusOnEscape);

    function openMoveDialog() {
        state.activeMenu = null;
        state.moveDialogOpen = true;
        renderMenu();
        const dialog = renderMoveNoteDialog({
            directories: [
                { id: 1, name: 'Personal', children: [{ id: 11, name: 'Journal', children: [] }] },
                { id: 2, name: 'Work', children: [] },
                { id: 3, name: 'Education', children: [{ id: 31, name: 'IT', children: [] }] },
                { id: 4, name: 'Business', children: [] },
                { id: 5, name: 'Medicine', children: [] },
                { id: 6, name: 'Projects', children: [] },
                { id: 7, name: 'Ideas', children: [] },
                { id: 8, name: 'Diaries', children: [] },
            ],
            selectedDirectory: null,
            onSelectDirectory: (directory) => {
                if (typeof onMoveNote === 'function') onMoveNote(directory);
            },
            onMove: () => {
                if (typeof onMoveNote === 'function') onMoveNote({ name: 'Selected directory' });
            },
            onCreateFolder: () => {}
            ,
            onClose: () => {
                state.moveDialogOpen = false;
                dialog.remove();
            },
        });

        document.body.appendChild(dialog);
    }

    function renderMenu() {
        shareMenu.classList.toggle('hidden', state.activeMenu !== 'share');
        moreMenu.classList.toggle('hidden', state.activeMenu !== 'more');
        mobileShareMenu.classList.toggle('hidden', state.activeMenu !== 'mobile-share');
        if (state.activeMenu === 'share') {
            shareMenu.classList.remove('hidden');
        }
        if (state.activeMenu === 'more') {
            moreMenu.classList.remove('hidden');
        }
        if (state.activeMenu === 'mobile-share') {
            mobileShareMenu.classList.remove('hidden');
        }
    }

    shell.append(left, right);
    root.append(shell, deleteConfirmation);
    renderTitleEditor();
    renderMenu();

    return root;
}
