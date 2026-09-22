import { DEFAULT_PAPER_STYLE, PAPER_STYLES } from '../../constants/paperStyles.js';

export const mockNoteBlocks = [
    {
        id: 'block-1',
        type: 'heading',
        level: 1,
        content: 'Mobile App UX Research',
    },
    {
        id: 'block-2',
        type: 'paragraph',
        content:
            'Today we discussed the key user needs for a modern note-taking app. The focus is on simplicity, speed, and flexibility across devices.',
    },
    {
        id: 'block-3',
        type: 'heading',
        level: 2,
        content: 'Key Insights',
    },
    {
        id: 'block-4',
        type: 'bulletList',
        items: [
            'Users want a clean and distraction-free writing experience',
            'Quick capture is more important than complex organization',
            'Cross-device sync is essential',
            'The ability to mix text, images, and drawings adds a lot of value',
        ],
    },
    {
        id: 'block-5',
        type: 'checklist',
        items: [
            { id: 'check-1', label: 'Finalize UI design for editor', checked: true },
            { id: 'check-2', label: 'Review technical requirements', checked: true },
            { id: 'check-3', label: 'Prepare prototype for testing', checked: false },
            { id: 'check-4', label: 'Gather more user feedback', checked: false },
        ],
    },
    {
        id: 'block-6',
        type: 'quote',
        content: '“A great note app should feel like a calm space to think, not a complicated tool to learn.”',
    },
    {
        id: 'block-7',
        type: 'heading',
        level: 3,
        content: 'Next Steps',
    },
    {
        id: 'block-8',
        type: 'numberedList',
        items: [
            'Finalize UI design for editor',
            'Review technical requirements',
            'Prepare prototype for testing',
            'Gather more user feedback',
        ],
    },
    {
        id: 'block-9',
        type: 'code',
        language: 'javascript',
        content: 'const editor = {\n  mode: "write",\n  paper: "lined",\n  focusTarget: "active-block"\n};\n\nconsole.log(editor);',
    },
    {
        id: 'block-10',
        type: 'image',
        caption: 'Prototype concept',
        src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    },
    {
        id: 'block-11',
        type: 'drawing',
        label: 'Sketch',
    },
];

function getPaperClass(paperStyle) {
    return PAPER_STYLES.includes(paperStyle) ? `note-paper--${paperStyle}` : `note-paper--${DEFAULT_PAPER_STYLE}`;
}

function renderTextContent(content, type, isWriteMode) {
    const text = document.createElement(type === 'heading' ? 'h1' : 'p');
    text.className = [
        'w-full whitespace-pre-wrap break-words text-slate-900 focus:outline-none dark:text-slate-50',
        type === 'heading' ? 'font-semibold tracking-[-0.04em] text-slate-900 dark:text-slate-50' : 'note-text text-[17px] text-slate-700 dark:text-slate-200',
    ].join(' ');

    if (type === 'heading') {
        text.textContent = content;
        text.setAttribute('role', 'heading');
    } else {
        text.textContent = content;
    }

    if (isWriteMode) {
        text.setAttribute('contenteditable', 'true');
        text.setAttribute('suppressContentEditableWarning', 'true');
    } else {
        text.setAttribute('contenteditable', 'false');
    }

    return text;
}

function createBlockFrame(blockId, isActive, isWriteMode) {
    const frame = document.createElement('div');
    frame.className = [
        'group relative rounded-2xl border border-transparent px-2 py-2 transition-all duration-150',
        isWriteMode && isActive ? 'border-sky-200 bg-sky-50/60 dark:border-sky-900/60 dark:bg-sky-950/20' : '',
    ].join(' ');
    frame.dataset.blockId = blockId;
    frame.dataset.active = isActive ? 'true' : 'false';
    return frame;
}

function renderHeading(block, isWriteMode, isActive) {
    const wrapper = createBlockFrame(block.id, isActive, isWriteMode);
    const tag = block.level === 2 ? 'h2' : block.level === 3 ? 'h3' : 'h1';
    const element = document.createElement(tag);
    element.className = [
        'w-full whitespace-pre-wrap break-words',
        'note-heading',
        block.level === 1 ? 'note-heading-1 text-3xl sm:text-[2.25rem]' : block.level === 2 ? 'note-heading-2 text-2xl sm:text-[1.8rem]' : 'note-heading-3 text-xl sm:text-[1.35rem]',
        'font-semibold tracking-[-0.04em] text-slate-900 dark:text-slate-50',
    ].join(' ');
    element.textContent = block.content;

    if (isWriteMode) {
        element.setAttribute('contenteditable', 'true');
        element.setAttribute('suppressContentEditableWarning', 'true');
    }

    wrapper.appendChild(element);
    return wrapper;
}

function renderParagraph(block, isWriteMode, isActive) {
    const wrapper = createBlockFrame(block.id, isActive, isWriteMode);
    const paragraph = document.createElement('p');
    paragraph.className = 'note-text w-full whitespace-pre-wrap break-words text-[17px] text-slate-700 dark:text-slate-200';
    paragraph.textContent = block.content;

    if (isWriteMode) {
        paragraph.setAttribute('contenteditable', 'true');
        paragraph.setAttribute('suppressContentEditableWarning', 'true');
    }

    wrapper.appendChild(paragraph);
    return wrapper;
}

function renderList(block, isWriteMode, isActive, listType) {
    const wrapper = createBlockFrame(block.id, isActive, isWriteMode);
    const list = document.createElement(listType === 'numbered' ? 'ol' : 'ul');
    list.className = listType === 'numbered' ? 'note-list list-decimal space-y-2 pl-6 text-[17px] text-slate-700 dark:text-slate-200' : 'note-list list-disc space-y-2 pl-6 text-[17px] text-slate-700 dark:text-slate-200';

    block.items.forEach((item) => {
        const listItem = document.createElement('li');
        listItem.className = 'pl-1';
        listItem.textContent = item;
        list.appendChild(listItem);
    });

    wrapper.appendChild(list);
    return wrapper;
}

function renderChecklist(block, isWriteMode, isActive) {
    const wrapper = createBlockFrame(block.id, isActive, isWriteMode);
    const list = document.createElement('ul');
    list.className = 'note-checklist space-y-2';

    block.items.forEach((item) => {
        const row = document.createElement('li');
        row.className = 'note-checklist-row flex min-h-[var(--note-rhythm)] items-center gap-3 rounded-xl px-2';

        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = [
            'h-5 w-5 rounded-md border text-[11px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60',
            item.checked ? 'border-emerald-500 bg-emerald-500 text-white dark:border-emerald-400 dark:bg-emerald-500' : 'border-slate-300 bg-white text-transparent dark:border-slate-600 dark:bg-slate-900',
        ].join(' ');
        toggle.setAttribute('aria-label', item.label);
        toggle.setAttribute('aria-pressed', String(item.checked));
        toggle.textContent = item.checked ? '✓' : '';
        toggle.disabled = !isWriteMode;

        if (isWriteMode) {
            toggle.addEventListener('click', () => {
                toggle.setAttribute('aria-pressed', String(!item.checked));
                toggle.textContent = item.checked ? '' : '✓';
                row.querySelector('.checklist-label').classList.toggle('line-through', !item.checked);
                row.querySelector('.checklist-label').classList.toggle('text-slate-500', !item.checked);
                row.querySelector('.checklist-label').classList.toggle('dark:text-slate-400', !item.checked);
                item.checked = !item.checked;
            });
        }

        const label = document.createElement('span');
        label.className = [
            'checklist-label note-text text-[17px]',
            item.checked ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-700 dark:text-slate-200',
        ].join(' ');
        label.textContent = item.label;

        row.append(toggle, label);
        list.appendChild(row);
    });

    wrapper.appendChild(list);
    return wrapper;
}

function renderQuote(block, isWriteMode, isActive) {
    const wrapper = createBlockFrame(block.id, isActive, isWriteMode);
    const quote = document.createElement('blockquote');
    quote.className = 'note-quote border-l-2 border-sky-300 bg-sky-50/50 px-4 py-3 text-[17px] italic text-slate-700 dark:border-sky-700 dark:bg-sky-950/20 dark:text-slate-200';
    quote.textContent = block.content;
    wrapper.appendChild(quote);
    return wrapper;
}

function renderCode(block, isWriteMode, isActive) {
    const wrapper = createBlockFrame(block.id, isActive, isWriteMode);
    const pre = document.createElement('pre');
    pre.className = 'overflow-x-auto rounded-2xl border border-slate-200 bg-slate-900 p-4 text-sm leading-6 text-slate-100 shadow-inner shadow-slate-950/10 dark:border-slate-700 dark:bg-slate-950';
    const code = document.createElement('code');
    code.className = 'font-mono';
    code.textContent = block.content;
    pre.appendChild(code);
    wrapper.appendChild(pre);
    return wrapper;
}

function renderImage(block, isWriteMode, isActive) {
    const wrapper = createBlockFrame(block.id, isActive, isWriteMode);
    const frame = document.createElement('figure');
    frame.className = 'overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950';

    const img = document.createElement('img');
    img.src = block.src;
    img.alt = block.caption || 'Note image';
    img.className = 'h-[240px] w-full object-cover sm:h-[300px]';

    const caption = document.createElement('figcaption');
    caption.className = 'px-4 py-3 text-sm text-slate-500 dark:text-slate-400';
    caption.textContent = block.caption || 'Image block';

    frame.append(img, caption);
    wrapper.appendChild(frame);
    return wrapper;
}

function renderDrawing(block, isWriteMode, isActive) {
    const wrapper = createBlockFrame(block.id, isActive, isWriteMode);
    const sketch = document.createElement('div');
    sketch.className = 'relative overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-950/40';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 800 260');
    svg.setAttribute('class', 'h-[220px] w-full');
    svg.setAttribute('preserveAspectRatio', 'none');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M0 180 C 90 120, 150 200, 210 170 S 330 80, 410 160 S 560 80, 620 160 S 740 130, 800 95');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#3b82f6');
    path.setAttribute('stroke-width', '4');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '120');
    circle.setAttribute('cy', '120');
    circle.setAttribute('r', '18');
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', '#3b82f6');
    circle.setAttribute('stroke-width', '4');

    const label = document.createElement('div');
    label.className = 'absolute left-4 top-4 rounded-full border border-sky-200 bg-white/80 px-2 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-sky-700 dark:border-sky-800 dark:bg-slate-900/70 dark:text-sky-300';
    label.textContent = block.label || 'Sketch';

    svg.append(path, circle);
    sketch.append(svg, label);
    wrapper.appendChild(sketch);
    return wrapper;
}

function renderBlock(block, index, mode, activeBlockId, onBlockFocus, onBlockChange, onChecklistToggle) {
    const isActive = activeBlockId === block.id;
    let element;

    if (block.type === 'heading') {
        element = renderHeading(block, mode === 'write', isActive);
    } else if (block.type === 'paragraph') {
        element = renderParagraph(block, mode === 'write', isActive);
    } else if (block.type === 'bulletList') {
        element = renderList(block, mode === 'write', isActive, 'bullet');
    } else if (block.type === 'numberedList') {
        element = renderList(block, mode === 'write', isActive, 'numbered');
    } else if (block.type === 'checklist') {
        element = renderChecklist(block, mode === 'write', isActive);
    } else if (block.type === 'quote') {
        element = renderQuote(block, mode === 'write', isActive);
    } else if (block.type === 'code') {
        element = renderCode(block, mode === 'write', isActive);
    } else if (block.type === 'image') {
        element = renderImage(block, mode === 'write', isActive);
    } else if (block.type === 'drawing') {
        element = renderDrawing(block, mode === 'write', isActive);
    } else {
        element = renderParagraph({ ...block, content: block.content || 'Untitled block' }, mode === 'write', isActive);
    }

    if (mode === 'write') {
        const editableTarget = element.querySelector('[contenteditable="true"]');
        if (editableTarget) {
            editableTarget.addEventListener('focus', () => onBlockFocus(block.id));
            editableTarget.addEventListener('input', (event) => {
                if (typeof onBlockChange === 'function') {
                    onBlockChange(block.id, event.target.textContent);
                }
            });
        }
    }

    return element;
}

export function NoteEditorBody({
    blocks = mockNoteBlocks,
    mode = 'write',
    paperStyle = DEFAULT_PAPER_STYLE,
    activeBlockId = null,
    toolbarVisible = true,
    onBlockFocus = () => {},
    onBlockChange = () => {},
    onChecklistToggle = () => {},
}) {
    const root = document.createElement('section');
    root.className = 'w-full';
    root.dataset.noteEditorBody = 'true';

    const canvas = document.createElement('div');
    canvas.className = [
        'note-canvas mx-auto w-full max-w-[760px] rounded-[30px] border border-slate-200/80 p-3 shadow-[0_10px_28px_rgba(15,23,42,0.04)] transition-colors sm:p-4 lg:max-w-[900px] lg:p-6',
        'bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50',
        getPaperClass(paperStyle),
    ].join(' ');

    const content = document.createElement('div');
    content.className = 'note-content flex flex-col px-2 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6';

    if (!blocks || blocks.length === 0) {
        const emptyState = document.createElement('button');
        emptyState.type = 'button';
        emptyState.className = 'block w-full rounded-2xl border border-dashed border-slate-300 bg-transparent px-4 py-12 text-left text-[17px] text-slate-500 transition hover:border-sky-300 hover:bg-sky-50/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-700 dark:text-slate-400 dark:hover:border-sky-800 dark:hover:bg-sky-950/20';
        emptyState.textContent = 'Start writing...';
        if (mode === 'write') {
            emptyState.addEventListener('click', () => onBlockFocus('empty-state'));
        }
        content.appendChild(emptyState);
    } else {
        blocks.forEach((block, index) => {
            const blockNode = renderBlock(block, index, mode, activeBlockId, onBlockFocus, onBlockChange, onChecklistToggle);
            content.appendChild(blockNode);
        });
    }

    canvas.appendChild(content);
    root.appendChild(canvas);

    const bottomSpacing = document.createElement('div');
    bottomSpacing.className = `note-editor-body-spacer w-full ${toolbarVisible ? 'h-24' : 'h-0'}`;
    root.appendChild(bottomSpacing);

    return root;
}
