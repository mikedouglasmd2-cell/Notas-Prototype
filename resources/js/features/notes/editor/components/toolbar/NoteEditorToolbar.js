import { TEXT_FORMATTING_ACTIONS } from '../../constants/formattingActions.js';
import { NOTE_BLOCK_TYPES } from '../../constants/blockTypes.js';
import { PAPER_STYLES } from '../../constants/paperStyles.js';

const PAPER_LABELS = {
    plain: 'Plain',
    lined: 'Lined',
    grid: 'Grid',
    dotted: 'Dotted',
};

function buttonClasses(active = false) {
    return [
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500',
        active
            ? 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/70 dark:bg-sky-950/40 dark:text-sky-300'
            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800',
    ].join(' ');
}

function menuSurfaceClasses() {
    return 'absolute bottom-[calc(100%+12px)] left-1/2 z-20 hidden w-72 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-950/10 max-sm:hidden dark:border-slate-700 dark:bg-slate-900';
}

function createMenuRow(label, subtitle = '', active = false) {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = [
        'flex min-h-12 w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500',
        active ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
    ].join(' ');
    row.innerHTML = `<span><span class="block text-sm font-medium">${label}</span>${subtitle ? `<span class="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">${subtitle}</span>` : ''}</span>`;
    return row;
}

function createSheet(title) {
    const sheet = document.createElement('div');
    sheet.className = 'fixed inset-x-0 bottom-0 z-50 hidden max-h-[calc(100dvh-1rem)] overflow-y-auto rounded-t-3xl border border-slate-200 bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:hidden';
    sheet.innerHTML = `
        <div class="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700"></div>
        <div class="mb-3 flex items-center justify-between">
            <h2 class="text-base font-semibold text-slate-900 dark:text-slate-50">${title}</h2>
            <button type="button" data-sheet-close class="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Close ${title}">×</button>
        </div>
        <div data-sheet-content class="space-y-1"></div>
    `;
    return sheet;
}

export function NoteEditorToolbar({
    mode = 'write',
    paperStyle = 'lined',
    currentBlockType = 'paragraph',
    onPaperStyleChange = () => {},
    onBlockTypeChange = () => {},
    onInsertImage = () => {},
    onInsertDrawing = () => {},
    onFormattingAction = () => {},
}) {
    const root = document.createElement('section');
    root.className = 'note-editor-toolbar fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:px-4';
    root.dataset.noteEditorToolbarRoot = 'true';
    root.dataset.mode = mode;
    root.style.setProperty('--note-toolbar-keyboard-offset', '0px');

    const dock = document.createElement('div');
    dock.className = 'relative mx-auto flex max-w-3xl items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-[0_12px_36px_rgba(15,23,42,0.14)] backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 dark:shadow-[0_16px_40px_rgba(2,6,23,0.45)] sm:justify-between sm:px-3';
    root.appendChild(dock);

    const menuStates = { text: false, layout: false, block: false };
    const menus = {};
    const sheets = {};

    const closeMenus = () => {
        Object.keys(menuStates).forEach((key) => { menuStates[key] = false; });
        Object.values(menus).forEach((menu) => {
            menu.classList.add('hidden');
            menu.style.display = '';
        });
        Object.values(sheets).forEach((sheet) => sheet.classList.add('hidden'));
    };

    const openMenu = (key) => {
        closeMenus();
        menuStates[key] = true;
        if (window.innerWidth >= 640) {
            menus[key].classList.remove('hidden');
        }
        sheets[key].classList.remove('hidden');
    };

    const makeControl = (key, icon, label, active = false) => {
        const wrap = document.createElement('div');
        wrap.className = 'relative flex-1 sm:flex-none';
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `${buttonClasses(active)} w-full sm:min-w-28`;
        button.innerHTML = `<span class="font-semibold">${icon}</span><span>${label}</span>`;
        button.addEventListener('click', () => openMenu(key));
        wrap.appendChild(button);
        dock.appendChild(wrap);
        return wrap;
    };

    const textWrap = makeControl('text', 'Aa', 'Text');
    const layoutWrap = makeControl('layout', '▧', 'Layout', paperStyle !== 'plain');
    const blockWrap = makeControl('block', '¶', 'Block', currentBlockType !== 'paragraph');

    const textMenu = document.createElement('div');
    textMenu.className = menuSurfaceClasses();
    TEXT_FORMATTING_ACTIONS.forEach((action) => {
        const row = createMenuRow(action.label, action.key === 'clearFormatting' ? 'Remove inline formatting' : 'Mock formatting action');
        row.addEventListener('click', () => {
            onFormattingAction(action.key);
            closeMenus();
        });
        textMenu.appendChild(row);
    });
    textWrap.appendChild(textMenu);
    menus.text = textMenu;

    const layoutMenu = document.createElement('div');
    layoutMenu.className = menuSurfaceClasses();
    PAPER_STYLES.forEach((style) => {
        const row = createMenuRow(PAPER_LABELS[style], `Use ${style} paper`, paperStyle === style);
        row.dataset.paperStyle = style;
        row.addEventListener('click', () => {
            onPaperStyleChange(style);
            closeMenus();
        });
        layoutMenu.appendChild(row);
    });
    layoutWrap.appendChild(layoutMenu);
    menus.layout = layoutMenu;

    const blockMenu = document.createElement('div');
    blockMenu.className = `${menuSurfaceClasses()} max-h-[min(28rem,calc(100vh-8rem))] overflow-y-auto`;
    NOTE_BLOCK_TYPES.forEach((group) => {
        const heading = document.createElement('p');
        heading.className = 'px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400';
        heading.textContent = group.group;
        blockMenu.appendChild(heading);
        group.items.forEach((item) => {
            const row = createMenuRow(item.label, '', currentBlockType === item.key);
            row.dataset.blockType = item.key;
            row.addEventListener('click', () => {
                if (item.key === 'image') onInsertImage();
                else if (item.key === 'drawing') onInsertDrawing();
                else onBlockTypeChange(item.key);
                closeMenus();
            });
            blockMenu.appendChild(row);
        });
    });
    blockWrap.appendChild(blockMenu);
    menus.block = blockMenu;

    const sheetDefinitions = [
        ['text', 'Text formatting', TEXT_FORMATTING_ACTIONS.map((action) => ({ label: action.label, action: () => { onFormattingAction(action.key); closeMenus(); } }))],
        ['layout', 'Paper layout', PAPER_STYLES.map((style) => ({ label: PAPER_LABELS[style], action: () => { onPaperStyleChange(style); closeMenus(); } }))],
        ['block', 'Block type', NOTE_BLOCK_TYPES.flatMap((group) => group.items.map((item) => ({ label: `${group.group}: ${item.label}`, action: () => { if (item.key === 'image') onInsertImage(); else if (item.key === 'drawing') onInsertDrawing(); else onBlockTypeChange(item.key); closeMenus(); } })))],
    ];

    sheetDefinitions.forEach(([key, title, items]) => {
        const sheet = createSheet(title);
        const content = sheet.querySelector('[data-sheet-content]');
        items.forEach((item) => {
            const row = createMenuRow(item.label);
            row.addEventListener('click', item.action);
            content.appendChild(row);
        });
        sheet.querySelector('[data-sheet-close]').addEventListener('click', closeMenus);
        root.appendChild(sheet);
        sheets[key] = sheet;
    });

    const updateKeyboardOffset = () => {
        let keyboardHeight = 0;
        if (!window.visualViewport || window.innerWidth >= 640) {
            root.style.setProperty('--note-toolbar-keyboard-offset', '0px');
            root.style.bottom = '0px';
        } else {
            const viewport = window.visualViewport;
            keyboardHeight = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
            root.style.setProperty('--note-toolbar-keyboard-offset', `${keyboardHeight}px`);
            root.style.bottom = `${keyboardHeight}px`;
        }

        Object.values(sheets).forEach((sheet) => {
            sheet.style.bottom = keyboardHeight > 0 ? `${keyboardHeight}px` : '0px';
        });
        root.dispatchEvent(new CustomEvent('note-editor-toolbar-offset', {
            bubbles: true,
            detail: { keyboardHeight },
        }));
    };

    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', updateKeyboardOffset);
        window.visualViewport.addEventListener('scroll', updateKeyboardOffset);
    }
    window.addEventListener('resize', updateKeyboardOffset);
    updateKeyboardOffset();

    root.addEventListener('click', (event) => {
        if (event.target === root) closeMenus();
    });

    return root;
}
