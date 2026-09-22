import { NoteEditorHeader } from './features/notes/editor/components/header/NoteEditorHeader.js';
import { NoteEditorBody, mockNoteBlocks } from './features/notes/editor/components/body/NoteEditorBody.js';
import { NoteEditorToolbar } from './features/notes/editor/components/toolbar/NoteEditorToolbar.js';

const sampleBreadcrumbs = [
    { id: 1, name: 'Notepads' },
    { id: 2, name: 'Education' },
    { id: 3, name: 'IT' },
    { id: 4, name: 'Lectures' },
];

const state = {
    mode: 'write',
    paperStyle: 'lined',
    activeBlockId: 'block-1',
    currentBlockType: 'paragraph',
};

const getMount = (attribute) => document.querySelector(`[${attribute}]`);

function updateBodyBottomSpacing() {
    const toolbar = document.querySelector('[data-note-editor-toolbar-root]');
    const bodyMount = getMount('data-note-editor-body');
    const bodySpacer = bodyMount?.querySelector('.note-editor-body-spacer');
    if (bodySpacer) bodySpacer.style.height = '0px';
    if (!toolbar || !bodyMount || state.mode !== 'write') {
        if (bodyMount) bodyMount.style.paddingBottom = '0px';
        return;
    }

    bodyMount.style.paddingBottom = `${Math.ceil(toolbar.getBoundingClientRect().height + 24)}px`;
}

function mountBody() {
    const mountTarget = getMount('data-note-editor-body');
    if (!mountTarget) return;

    mountTarget.replaceChildren();
    const container = document.createElement('div');
    container.dataset.noteEditorBodyRoot = 'true';
    container.className = 'mx-auto max-w-5xl';

    const body = NoteEditorBody({
        blocks: mockNoteBlocks,
        mode: state.mode,
        paperStyle: state.paperStyle,
        activeBlockId: state.activeBlockId,
        toolbarVisible: state.mode === 'write',
        onBlockFocus: (blockId) => {
            state.activeBlockId = blockId;
            requestAnimationFrame(() => {
                document.querySelector(`[data-block-id="${blockId}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        },
        onBlockChange: (blockId, value) => console.info('Updated block:', blockId, value),
        onChecklistToggle: (blockId, itemId) => console.info('Checklist toggled:', blockId, itemId),
    });

    container.appendChild(body);
    mountTarget.appendChild(container);
}

function mountToolbar() {
    const mountTarget = getMount('data-note-editor-toolbar');
    if (!mountTarget) return;

    mountTarget.replaceChildren();
    if (state.mode !== 'write') {
        updateBodyBottomSpacing();
        return;
    }

    const toolbar = NoteEditorToolbar({
        mode: state.mode,
        paperStyle: state.paperStyle,
        currentBlockType: state.currentBlockType,
        onPaperStyleChange: (paperStyle) => {
            state.paperStyle = paperStyle;
            mountBody();
            mountToolbar();
        },
        onBlockTypeChange: (blockType) => {
            state.currentBlockType = blockType;
            console.info('Block type changed:', blockType);
        },
        onInsertImage: () => console.info('Insert image placeholder'),
        onInsertDrawing: () => console.info('Insert drawing placeholder'),
        onFormattingAction: (action) => console.info('Formatting action:', action),
    });

    mountTarget.appendChild(toolbar);
    toolbar.addEventListener('note-editor-toolbar-offset', (event) => {
        const keyboardHeight = event.detail?.keyboardHeight || 0;
        const toolbarHeight = toolbar.getBoundingClientRect().height;
        const bodyMount = getMount('data-note-editor-body');
        if (bodyMount) {
            bodyMount.style.paddingBottom = `${Math.ceil(toolbarHeight + keyboardHeight + 24)}px`;
        }
    });
    requestAnimationFrame(updateBodyBottomSpacing);
}

function mountHeader() {
    const mountTarget = getMount('data-note-editor-header');
    if (!mountTarget) return;

    mountTarget.replaceChildren();
    const container = document.createElement('div');
    container.dataset.noteEditorHeaderRoot = 'true';
    container.className = 'mx-auto max-w-5xl';

    const header = NoteEditorHeader({
        title: 'Mobile App UX Research',
        breadcrumbs: sampleBreadcrumbs,
        mode: state.mode,
        saveStatus: 'saved',
        canUndo: true,
        canRedo: true,
        onBack: () => console.info('Back clicked'),
        onTitleChange: (value) => console.info('Title changed:', value),
        onTitleCommit: (value) => console.info('Title committed:', value),
        onUndo: () => console.info('Undo clicked'),
        onRedo: () => console.info('Redo clicked'),
        onModeChange: (nextMode) => {
            state.mode = nextMode;
            mountBody();
            mountToolbar();
        },
        onMoveNote: (directory) => console.info('Move note to:', directory),
        onShareWithUser: () => console.info('Share with user'),
        onCopyShareLink: () => console.info('Copy share link'),
        onExport: () => console.info('Export note'),
        onCopyAsText: () => console.info('Copy as text'),
        onArchive: () => console.info('Archive note'),
        onDuplicate: () => console.info('Duplicate note'),
        onShowInfo: () => console.info('Show note info'),
        onDelete: () => console.info('Delete note'),
    });

    container.appendChild(header);
    mountTarget.appendChild(container);
}

document.addEventListener('DOMContentLoaded', () => {
    if (!getMount('data-note-editor-header') && !getMount('data-note-editor-body') && !getMount('data-note-editor-toolbar')) return;
    mountHeader();
    mountBody();
    mountToolbar();
});
